// Copyright 2014-2020, University of Colorado Boulder

/**
 * Shows a readout of the elapsed time, with play and pause buttons.  By default there are no units (which could be used
 * if all of a simulations time units are in 'seconds'), or you can specify a selection of units to choose from.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Anton Ulyanov (Mlearner)
 */

import Bounds2 from '../../dot/js/Bounds2.js';
import InstanceRegistry from '../../phet-core/js/documentation/InstanceRegistry.js';
import inherit from '../../phet-core/js/inherit.js';
import merge from '../../phet-core/js/merge.js';
import DragListener from '../../scenery/js/listeners/DragListener.js';
import Circle from '../../scenery/js/nodes/Circle.js';
import HBox from '../../scenery/js/nodes/HBox.js';
import Node from '../../scenery/js/nodes/Node.js';
import Path from '../../scenery/js/nodes/Path.js';
import VBox from '../../scenery/js/nodes/VBox.js';
import BooleanRectangularToggleButton from '../../sun/js/buttons/BooleanRectangularToggleButton.js';
import RectangularPushButton from '../../sun/js/buttons/RectangularPushButton.js';
import Tandem from '../../tandem/js/Tandem.js';
import DragBoundsProperty from './DragBoundsProperty.js';
import PauseIconShape from './PauseIconShape.js';
import PlayIconShape from './PlayIconShape.js';
import sceneryPhet from './sceneryPhet.js';
import ShadedRectangle from './ShadedRectangle.js';
import Stopwatch from './Stopwatch.js';
import StopwatchReadoutNode from './StopwatchReadoutNode.js';
import UTurnArrowShape from './UTurnArrowShape.js';

/**
 * @param {Stopwatch} stopwatch
 * @param {Object} [options]
 */
function StopwatchNode( stopwatch, options ) {
  assert && assert( stopwatch instanceof Stopwatch, `invalid stopwatch: ${stopwatch}` );

  options = merge( {

    // See also options that pass through to StopwatchReadoutNode
    cursor: 'pointer',
    iconHeight: 10,
    iconFill: 'black',
    iconLineWidth: 1,
    backgroundBaseColor: 'rgb( 80, 130, 230 )',
    buttonBaseColor: '#DFE0E1',
    xSpacing: 6, // horizontal space between the buttons
    ySpacing: 6, // vertical space between readout and buttons
    xMargin: 8,
    yMargin: 8,

    // {number} the maximum time value, in seconds. See StopwatchReadoutNode options.maxValue
    maxValue: StopwatchReadoutNode.DEFAULT_MAX_VALUE,

    // options propagated to StopwatchReadoutNode
    stopwatchReadoutNodeOptions: null,

    visibleBoundsProperty: null, // {Property.<Bounds2>|null} if provided, the node is draggable within the bounds

    // Tandem is required to make sure the buttons are instrumented
    tandem: Tandem.REQUIRED,

    // options propagated to the DragListener
    dragListenerOptions: null
  }, options );

  assert && assert( options.xSpacing >= 0, 'Buttons cannot overlap' );
  assert && assert( options.ySpacing >= 0, 'Buttons cannot overlap the readout' );

  // fill in stopwatchReadoutNodeOptions defaults
  assert && assert( !options.stopwatchReadoutNodeOptions || options.stopwatchReadoutNodeOptions.maxValue === undefined,
    'StopwatchNode sets maxValue' );
  options.stopwatchReadoutNodeOptions = options.stopwatchReadoutNodeOptions || {};
  options.stopwatchReadoutNodeOptions.maxValue = options.maxValue;

  // Create the StopwatchReadoutNode.
  // NOTE: If we need more flexibility for this part, consider inversion of control (i.e. client passing in an alternate Node)
  const stopwatchReadoutNode = new StopwatchReadoutNode( stopwatch.timeProperty, options.stopwatchReadoutNodeOptions );

  // Buttons ----------------------------------------------------------------------------

  const resetPath = new Path( new UTurnArrowShape( options.iconHeight ), {
    fill: options.iconFill
  } );

  const playIconHeight = resetPath.height;
  const playIconWidth = 0.8 * playIconHeight;
  const playPath = new Path( new PlayIconShape( playIconWidth, playIconHeight ), {
    fill: options.iconFill
  } );

  const pausePath = new Path( new PauseIconShape( 0.75 * playIconWidth, playIconHeight ), {
    fill: options.iconFill
  } );

  const playPauseButton = new BooleanRectangularToggleButton( pausePath, playPath, stopwatch.isRunningProperty, {
    baseColor: options.buttonBaseColor,
    tandem: options.tandem.createTandem( 'playPauseButton' )
  } );

  const resetButton = new RectangularPushButton( {
    listener: function resetTimer() {
      stopwatch.isRunningProperty.set( false );
      stopwatch.timeProperty.set( 0 );
    },
    content: resetPath,
    baseColor: options.buttonBaseColor,
    tandem: options.tandem.createTandem( 'resetButton' )
  } );

  const contents = new VBox( {
    spacing: options.ySpacing,
    children: [
      stopwatchReadoutNode,
      new HBox( {
        spacing: options.xSpacing,
        children: [ resetButton, playPauseButton ]
      } )
    ]
  } );

  // Background panel ----------------------------------------------------------------------------

  const backgroundNode = new ShadedRectangle( new Bounds2( 0, 0,
    contents.width + 2 * options.xMargin, contents.height + 2 * options.yMargin ), {
    baseColor: options.backgroundBaseColor
  } );
  contents.center = backgroundNode.center;

  assert && assert( !options.children, 'StopwatchNode sets children' );
  options.children = [ backgroundNode, contents ];

  Node.call( this, options );

  // @public (read-only) - Target for drag listeners
  this.dragTarget = backgroundNode;

  // Disable the reset button when time is zero.
  const timeListener = function( time ) {
    resetButton.enabled = time > 0;
    playPauseButton.enabled = time < options.maxValue;
    if ( time >= options.maxValue ) {
      stopwatch.isRunningProperty.value = false;
    }
  };
  stopwatch.timeProperty.link( timeListener );

  // Put a red dot at the origin, for debugging layout.
  if ( phet.chipper.queryParameters.dev ) {
    this.addChild( new Circle( 3, { fill: 'red' } ) );
  }

  const stopwatchVisibleListener = visible => {
    this.visible = visible;
    if ( visible ) {
      this.moveToFront();
    }
    else {

      // interrupt user interactions when the stopwatch is made invisible
      this.interruptSubtreeInput();
    }
  };
  stopwatch.isVisibleProperty.link( stopwatchVisibleListener );

  // Move to the stopwatch's position
  const stopwatchPositionListener = position => this.setTranslation( position );
  stopwatch.positionProperty.link( stopwatchPositionListener );

  // @public (read-only) {DragListener|null} -- reassigned below, if draggable.  Can be used for forwarding press
  // events when dragging out of a toolbox.
  this.dragListener = null;
  let moveToFrontListener = null;

  let dragBoundsProperty = null;

  if ( options.visibleBoundsProperty ) {

    // drag bounds, adjusted to keep this entire Node inside visible bounds
    dragBoundsProperty = new DragBoundsProperty( this, options.visibleBoundsProperty );

    // interrupt user interactions when the visible bounds changes, such as a device orientation change or window resize
    options.visibleBoundsProperty.link( () => this.interruptSubtreeInput() );

    // If the stopwatch is outside the drag bounds, move it inside.
    dragBoundsProperty.link( dragBounds => {
      if ( !dragBounds.containsPoint( stopwatch.positionProperty ) ) {
        stopwatch.positionProperty.value = dragBounds.closestPointTo( stopwatch.positionProperty.value );
      }
    } );

    // dragging, added to background so that other UI components get input events on touch devices
    this.dragListener = new DragListener( merge( {
      targetNode: this,
      positionProperty: stopwatch.positionProperty,
      dragBoundsProperty: dragBoundsProperty,
      tandem: options.tandem.createTandem( 'dragListener' )
    }, options.dragListenerOptions ) );
    this.dragTarget.addInputListener( this.dragListener );

    // Move to front on pointer down, anywhere on this Node, including interactive subcomponents.
    // This needs to be a DragListener so that touchSnag works.
    moveToFrontListener = new DragListener( {
      attach: false, // so that this DragListener won't be ignored
      start: () => this.moveToFront(),
      tandem: options.tandem.createTandem( 'moveToFrontListener' )
    } );
    this.addInputListener( moveToFrontListener );
  }

  this.addLinkedElement( stopwatch, {
    tandem: options.tandem.createTandem( 'stopwatch' )
  } );

  // @private
  this.disposeStopwatchNode = function() {
    stopwatch.isVisibleProperty.unlink( stopwatchVisibleListener );
    stopwatch.timeProperty.unlink( timeListener );
    stopwatch.positionProperty.unlink( stopwatchPositionListener );

    stopwatchReadoutNode.dispose();
    resetButton.dispose();
    playPauseButton.dispose();

    if ( this.dragListener ) {
      this.dragTarget.removeInputListener( this.dragListener );
      this.dragListener.dispose();
    }
    if ( moveToFrontListener ) {
      this.removeInputListener( moveToFrontListener );
      moveToFrontListener.dispose();
    }

    dragBoundsProperty && dragBoundsProperty.dispose();
  };

  // support for binder documentation, stripped out in builds and only runs when ?binder is specified
  assert && phet.chipper.queryParameters.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'StopwatchNode', this );
}

sceneryPhet.register( 'StopwatchNode', StopwatchNode );

export default inherit( Node, StopwatchNode, {

  /**
   * Release resources when no longer be used.
   * @public
   * @override
   */
  dispose: function() {
    this.disposeStopwatchNode();
    Node.prototype.dispose.call( this );
  }
} );