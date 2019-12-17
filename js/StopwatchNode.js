// Copyright 2014-2019, University of Colorado Boulder

/**
 * Shows a readout of the elapsed time, with play and pause buttons.  By default there are no units (which could be used
 * if all of a simulations time units are in 'seconds'), or you can specify a selection of units to choose from.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Anton Ulyanov (Mlearner)
 */
define( require => {
  'use strict';

  // modules
  const BooleanRectangularToggleButton = require( 'SUN/buttons/BooleanRectangularToggleButton' );
  const Bounds2 = require( 'DOT/Bounds2' );
  const Circle = require( 'SCENERY/nodes/Circle' );
  const DragBoundsProperty = require( 'SCENERY_PHET/DragBoundsProperty' );
  const DragListener = require( 'SCENERY/listeners/DragListener' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const inherit = require( 'PHET_CORE/inherit' );
  const InstanceRegistry = require( 'PHET_CORE/documentation/InstanceRegistry' );
  const merge = require( 'PHET_CORE/merge' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );
  const PauseIconShape = require( 'SCENERY_PHET/PauseIconShape' );
  const PlayIconShape = require( 'SCENERY_PHET/PlayIconShape' );
  const RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  const ShadedRectangle = require( 'SCENERY_PHET/ShadedRectangle' );
  const Stopwatch = require( 'SCENERY_PHET/Stopwatch' );
  const Tandem = require( 'TANDEM/Tandem' );
  const StopwatchReadoutNode = require( 'SCENERY_PHET/StopwatchReadoutNode' );
  const UTurnArrowShape = require( 'SCENERY_PHET/UTurnArrowShape' );
  const VBox = require( 'SCENERY/nodes/VBox' );

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

      dragEndListener: () => {} // TODO: Use nested options pattern here, see https://github.com/phetsims/gas-properties/issues/170
    }, options );

    assert && assert( options.xSpacing >= 0, 'Buttons cannot overlap' );
    assert && assert( options.ySpacing >= 0, 'Buttons cannot overlap the readout' );

    // fill in stopwatchReadoutNodeOptions defaults
    assert && assert( !options.stopwatchReadoutNodeOptions || options.stopwatchReadoutNodeOptions.maxValue === undefined,
      'StopwatchNode sets maxValue' );
    options.stopwatchReadoutNodeOptions = options.stopwatchReadoutNodeOptions || {};
    options.stopwatchReadoutNodeOptions.maxValue = options.maxValue;

    // Create the StopwatchReadoutNode.
    // NOTE: If we need more flexibility for this part, consider inversion of control (i.e. client passing in a
    // StopwatchReadoutNode)
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

    // @private
    this.disposeStopwatchNode = function() {
      stopwatchReadoutNode.dispose();
      stopwatch.timeProperty.unlink( timeListener );
      resetButton.dispose();
      playPauseButton.dispose();
    };

    // Put a red dot at the origin, for debugging layout.
    if ( phet.chipper.queryParameters.dev ) {
      this.addChild( new Circle( 3, { fill: 'red' } ) );
    }

    // visibility
    stopwatch.isVisibleProperty.link( visible => {

      this.visible = visible;
      if ( visible ) {
        this.moveToFront();
      }
      else {

        // TODO: https://github.com/phetsims/gas-properties/issues/170 interrupting input was incompatible with dragging out of a toolbox
        // in wave interference, but not in Energy Skate Park: Basics, but I can't figure out why.
        this.interruptSubtreeInput(); // interrupt user interactions
      }
    } );

    // Move to the stopwatch's location
    stopwatch.positionProperty.link( location => this.setTranslation( location ) );

    this.dragListener = null; // may be reassigned below, if draggable

    if ( options.visibleBoundsProperty ) {

      // drag bounds, adjusted to keep this entire Node inside visible bounds
      const dragBoundsProperty = new DragBoundsProperty( this, options.visibleBoundsProperty );

      // If the stopwatch is outside the drag bounds, move it inside.
      dragBoundsProperty.link( dragBounds => {
        this.interruptSubtreeInput(); // interrupt user interactions
        if ( !dragBounds.containsPoint( stopwatch.positionProperty ) ) {
          stopwatch.positionProperty.value = dragBounds.closestPointTo( stopwatch.positionProperty.value );
        }
      } );

      // dragging, added to background so that other UI components get input events on touch devices
      this.dragListener = new DragListener( {
        targetNode: this,
        locationProperty: stopwatch.positionProperty,
        dragBoundsProperty: dragBoundsProperty,
        end: options.dragEndListener
      } );
      this.dragTarget.addInputListener( this.dragListener );

      // Move to front on pointer down, anywhere on this Node, including interactive subcomponents.
      // This needs to be a DragListener so that touchSnag works.
      this.addInputListener( new DragListener( {
        attach: false, // so that this DragListener won't be ignored
        start: () => this.moveToFront()
      } ) );

      // TODO: This is from masses and springs, is it necessary in common code, or should it be specified via an option?
      // TODO: If so, how should the option be named or structured? See https://github.com/phetsims/gas-properties/issues/170
      this.touchArea = this.localBounds.dilated( 10 );
    }

    // support for binder documentation, stripped out in builds and only runs when ?binder is specified
    assert && phet.chipper.queryParameters.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'StopwatchNode', this );
  }

  sceneryPhet.register( 'StopwatchNode', StopwatchNode );

  return inherit( Node, StopwatchNode, {

    /**
     * Release resources when no longer be used.
     * @public
     */
    dispose: function() {
      this.disposeStopwatchNode();
      Node.prototype.dispose.call( this );
    }
  } );
} );