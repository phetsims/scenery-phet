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
import Utils from '../../dot/js/Utils.js';
import InstanceRegistry from '../../phet-core/js/documentation/InstanceRegistry.js';
import inherit from '../../phet-core/js/inherit.js';
import merge from '../../phet-core/js/merge.js';
import StringUtils from '../../phetcommon/js/util/StringUtils.js';
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
import NumberDisplay from './NumberDisplay.js';
import PauseIconShape from './PauseIconShape.js';
import PlayIconShape from './PlayIconShape.js';
import sceneryPhet from './sceneryPhet.js';
import sceneryPhetStrings from './sceneryPhetStrings.js';
import ShadedRectangle from './ShadedRectangle.js';
import Stopwatch from './Stopwatch.js';
import UTurnArrowShape from './UTurnArrowShape.js';


/**
 * @param {Stopwatch} stopwatch
 * @param {Object} [options]
 */
function StopwatchNode( stopwatch, options ) {
  assert && assert( stopwatch instanceof Stopwatch, `invalid stopwatch: ${stopwatch}` );

  options = merge( {

    cursor: 'pointer',
    iconHeight: 10,
    numberDisplayRange: Stopwatch.ZERO_TO_ALMOST_SIXTY, // Just for sizing the display, sized for 59:59.99 (mm:ss) or 3599.99 (decimal)
    iconFill: 'black',
    iconLineWidth: 1,
    backgroundBaseColor: 'rgb( 80, 130, 230 )',
    buttonBaseColor: '#DFE0E1',
    xSpacing: 6, // horizontal space between the buttons
    ySpacing: 6, // vertical space between readout and buttons
    xMargin: 8,
    yMargin: 8,

    // options propagated to the NumberDisplay
    numberDisplayOptions: {
      numberFormatter: StopwatchNode.richNumberFormatter,
      useRichText: true,
      align: 'right',
      cornerRadius: 4,
      xMargin: 4,
      yMargin: 2,
      pickable: false // allow dragging by the number display
    },

    visibleBoundsProperty: null, // {Property.<Bounds2>|null} if provided, the node is draggable within the bounds

    // Tandem is required to make sure the buttons are instrumented
    tandem: Tandem.REQUIRED,

    // options propagated to the DragListener.
    dragListenerOptions: null
  }, options );
  assert && assert( !options.hasOwnProperty( 'maxValue' ), 'options.maxValue no longer supported' );

  assert && assert( options.xSpacing >= 0, 'Buttons cannot overlap' );
  assert && assert( options.ySpacing >= 0, 'Buttons cannot overlap the readout' );

  // Create the StopwatchReadoutNode.
  this.numberDisplay = new NumberDisplay( stopwatch.timeProperty, options.numberDisplayRange, options.numberDisplayOptions );

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
      this.numberDisplay,
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

  // Disable the reset button when time is zero, and enable the play/pause button when not at the max time
  const timeListener = time => {
    resetButton.enabled = time > 0;
    playPauseButton.enabled = time < stopwatch.timeProperty.range.max;
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
    const dragListenerOptions = merge( {
      targetNode: this,
      positionProperty: stopwatch.positionProperty,
      dragBoundsProperty: dragBoundsProperty,
      tandem: options.tandem.createTandem( 'dragListener' )
    }, options.dragListenerOptions );

    // The StopwatchNode always calls moveToFront on drag start
    const startOption = dragListenerOptions.start;
    dragListenerOptions.start = () => {
      this.moveToFront();
      startOption && startOption();
    };

    this.dragListener = new DragListener( dragListenerOptions );
    this.dragTarget.addInputListener( this.dragListener );
  }

  this.addLinkedElement( stopwatch, {
    tandem: options.tandem.createTandem( 'stopwatch' )
  } );

  // @private
  this.disposeStopwatchNode = function() {
    stopwatch.isVisibleProperty.unlink( stopwatchVisibleListener );
    stopwatch.timeProperty.unlink( timeListener );
    stopwatch.positionProperty.unlink( stopwatchPositionListener );

    this.numberDisplay.dispose();
    resetButton.dispose();
    playPauseButton.dispose();

    if ( this.dragListener ) {
      this.dragTarget.removeInputListener( this.dragListener );
      this.dragListener.dispose();
    }

    dragBoundsProperty && dragBoundsProperty.dispose();
  };

  // support for binder documentation, stripped out in builds and only runs when ?binder is specified
  assert && phet.chipper.queryParameters.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'StopwatchNode', this );
}

sceneryPhet.register( 'StopwatchNode', StopwatchNode );

inherit( Node, StopwatchNode, {

  /**
   * @param {function<number,string>} numberFormatter
   * @public
   */
  setNumberFormatter( numberFormatter ) {
    this.numberDisplay.setNumberFormatter( numberFormatter );
  },

  // @public - redraw the text when something other than the numberProperty changes (such as units, formatter, etc).
  redrawNumberDisplay() {
    this.numberDisplay.recomputeText();
  },

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

// the full-sized minutes and seconds string
const toMinutesAndSeconds = time => {

  // Round to the nearest centi-part (if time is in seconds, this would be centiseconds), (compatible with timeToSmallString).
  // see https://github.com/phetsims/masses-and-springs/issues/156
  time = Utils.roundSymmetric( time * 100 ) / 100;

  // When showing units, don't show the "00:" prefix, see https://github.com/phetsims/scenery-phet/issues/378
  const timeInSeconds = time;

  // If no units are provided, then we assume the time is in seconds, and should be shown in mm:ss.cs
  let minutes = Math.floor( timeInSeconds / 60 );
  let seconds = Math.floor( timeInSeconds ) % 60;

  if ( seconds < 10 ) {
    seconds = '0' + seconds;
  }
  if ( minutes < 10 ) {
    minutes = '0' + minutes;
  }
  return minutes + ':' + seconds;
};

// the smaller hundredths-of-a-second string
const getDecimalPlaces = ( time, numberDecimalPlaces ) => {

  const max = Math.pow( 10, numberDecimalPlaces );

  // Round to the nearest centisecond (compatible with timeToSmallString).
  // see https://github.com/phetsims/masses-and-springs/issues/156
  time = Utils.roundSymmetric( time * max ) / max;

  // Rounding after mod, in case there is floating-point error
  let decimalValue = Utils.roundSymmetric( time % 1 * max ) + '';
  while ( decimalValue.length < numberDecimalPlaces ) {
    decimalValue = '0' + decimalValue;
  }
  return '.' + decimalValue;
};

// @public (read-only, unit-tests)
StopwatchNode.getDecimalPlaces = getDecimalPlaces;

// @public - for NumberDisplay, shows 12:34.56
StopwatchNode.numberFormatter = x => {
  const minutesAndSeconds = toMinutesAndSeconds( x );
  const centiseconds = getDecimalPlaces( x, 2 );
  return minutesAndSeconds + centiseconds;
};

// @public - We used to use Lucida Console, Arial, but Arial has smaller number width for "11" and hence was causing
// jitter. Neither Trebuchet MS and Lucida Grande is a monospace font, but the digits all appear to be monospace.
// Use Trebuchet first, since it has broader cross-platform support.
// Another advantage of using a non-monospace font (that has monospace digits) is that the : and . symbols aren't as
// wide as the numerals.  @ariel-phet and @samreid tested this combination of families on Mac/Chrome and Windows/Chrome
// and it seemed to work nicely, with no jitter.
StopwatchNode.NUMBER_FONT_FAMILY = '"Trebuchet MS", "Lucida Grande", monospace';

// @public - for NumberDisplay, shows 12:34.56, but the ".56" is smaller
StopwatchNode.richNumberFormatter = x => {
  const minutesAndSeconds = toMinutesAndSeconds( x );
  const centiseconds = getDecimalPlaces( x, 2 );

  // Single quotes around CSS style so the double-quotes in the CSS font family work. Himalaya doesn't like &quot;
  // See https://github.com/phetsims/collision-lab/issues/140.
  return `<span style='font-size: 20px; font-family:${StopwatchNode.NUMBER_FONT_FAMILY};'>${minutesAndSeconds}</span><span style='font-size: 14px;font-family:${StopwatchNode.NUMBER_FONT_FAMILY};'>${centiseconds}</span>`;
};

// @public - for NumberDisplay, more customizable
StopwatchNode.getRichNumberFormatter = options => {
  options = merge( {
    showAsDecimal: false, // 123.45 (decimal) vs 59:59.00 (non-decimal)
    bigNumberFont: 20,
    smallNumberFont: 14,
    unitsFont: 14,
    units: '',
    numberOfDecimalPlaces: 2,

    // Units cannot be baked into the i18n string because they can change independently
    valueUnitsPattern: sceneryPhetStrings.stopwatchValueUnitsPattern
  }, options );

  return x => {
    const minutesAndSeconds = options.showAsDecimal ? Math.floor( x ) : toMinutesAndSeconds( x );
    const centiseconds = getDecimalPlaces( x, options.numberOfDecimalPlaces );

    // Single quotes around CSS style so the double-quotes in the CSS font family work. Himalaya doesn't like &quot;
    // See https://github.com/phetsims/collision-lab/issues/140.
    return StringUtils.fillIn( options.valueUnitsPattern, {
      value: `<span style='font-size: ${options.bigNumberFont}px; font-family:${StopwatchNode.NUMBER_FONT_FAMILY};'>${minutesAndSeconds}</span><span style='font-size: ${options.smallNumberFont}px;font-family:${StopwatchNode.NUMBER_FONT_FAMILY};'>${centiseconds}</span>`,
      units: `<span style='font-size: ${options.unitsFont}px; font-family:${StopwatchNode.NUMBER_FONT_FAMILY};'>${options.units}</span>`
    } );
  };
};

export default StopwatchNode;