// Copyright 2018-2020, University of Colorado Boulder

/**
 * Shows an elapsed time--can be displayed in a StopwatchNode.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Utils from '../../dot/js/Utils.js';
import merge from '../../phet-core/js/merge.js';
import Node from '../../scenery/js/nodes/Node.js';
import Rectangle from '../../scenery/js/nodes/Rectangle.js';
import Text from '../../scenery/js/nodes/Text.js';
import PhetFont from './PhetFont.js';
import sceneryPhet from './sceneryPhet.js';

// Try for a monospace font so that the numbers don't change alignment.  Fallback to Arial as determined in
// https://github.com/phetsims/wave-interference/issues/239
const FONT_FAMILY = '"Lucida Console", Arial';
const DEFAULT_LARGE_FONT = new PhetFont( {
  size: 20,
  family: FONT_FAMILY
} );
const DEFAULT_SMALL_FONT = new PhetFont( {
  size: 15,
  family: FONT_FAMILY
} );
const DEFAULT_MAX_VALUE = 3599.99;

class StopwatchReadoutNode extends Rectangle {

  /**
   * @param {Property.<Number>} timeProperty
   * @param {Object} [options]
   */
  constructor( timeProperty, options ) {

    options = merge( {
      unitsNode: null, // {Node|null} optional units, placed to the right of the time value
      largeFont: DEFAULT_LARGE_FONT, // {Font} for larger numbers in the time value
      smallFont: DEFAULT_SMALL_FONT, // {Font} for smaller numbers in the time value

      // {number} the maximum time value, in seconds. The timer will stop when this value is reached.
      // When set to display time in minutes and seconds (the default for StopwatchReadoutNode),
      // the largest quantity that StopwatchNode can display is minutes, and the smallest is 1/100 second.
      // So the default maxValue is 59 minutes, 59.99 seconds, which is 1/100 second short of 1 hour.
      // See https://github.com/phetsims/masses-and-springs-basics/issues/36
      maxValue: DEFAULT_MAX_VALUE
    }, options );

    assert && assert( options.maxValue > 0 && options.maxValue < 1E21, 'invalid maxValue: ' + options.maxValue );

    /*---------------------------------------------------------------------------*
     * Readout text
     *----------------------------------------------------------------------------*/

    const bigReadoutText = new Text( timeToBigString( 0, !!options.unitsNode ), { font: options.largeFont } );
    const smallReadoutText = new Text( timeToSmallString( 0 ), { font: options.smallFont } );

    // aligns the baselines of the big and small text
    smallReadoutText.bottom = smallReadoutText.bounds.maxY - bigReadoutText.bounds.minY;
    bigReadoutText.top = 0;
    const children = [ bigReadoutText, smallReadoutText ];

    if ( options.unitsNode ) {

      // Align the baseline of the text, see https://github.com/phetsims/scenery-phet/issues/425
      options.unitsNode.y = smallReadoutText.y;
      children.push( options.unitsNode );
    }

    const readoutLayer = new Node( {
      children: children,
      pickable: false
    } );

    /*---------------------------------------------------------------------------*
     * Control logic and initial layout
     *----------------------------------------------------------------------------*/
    const updateText = value => {

      // When the timer reaches the max value, it should get "stuck" at that value, like a real stopwatch,
      // see https://github.com/phetsims/wave-interference/issues/94
      value = Math.min( value, options.maxValue );

      // Update readouts
      bigReadoutText.text = timeToBigString( value, !!options.unitsNode );
      smallReadoutText.text = timeToSmallString( value );

      // Update layout - when unitsNode is shown, the text is right aligned.  Otherwise it is centered.
      if ( options.unitsNode ) {
        smallReadoutText.right = options.unitsNode.left - 3;
        bigReadoutText.right = smallReadoutText.left;
      }
      else {
        smallReadoutText.left = bigReadoutText.right;
      }
    };

    // Initialize with max value so the text panel will have the max needed size.
    updateText( options.maxValue );

    /*---------------------------------------------------------------------------*
     * Readout background
     *----------------------------------------------------------------------------*/
    const parentBounds = readoutLayer.bounds.dilatedXY( 5, 2 );
    super( parentBounds, 5, 5, {
      children: [ readoutLayer ],
      fill: '#fff',
      stroke: 'rgba(0,0,0,0.5)',
      pickable: false,
      centerX: 0
    } );

    const updateTextPosition = () => {
      if ( options.unitsNode ) {
        const RIGHT_MARGIN = 4;
        readoutLayer.right = parentBounds.right - RIGHT_MARGIN;
      }
      else {
        readoutLayer.center = parentBounds.center;
      }
    };

    // Set initial values and layout
    timeProperty.link( updateText );
    timeProperty.link( updateTextPosition );

    let unitsNodeBoundsListener = null;

    // If the unitsNode changes size, update the layout to accommodate the new size
    if ( options.unitsNode ) {
      unitsNodeBoundsListener = function() {
        updateText( timeProperty.value );
        updateTextPosition();
      };
      options.unitsNode.boundsProperty.lazyLink( unitsNodeBoundsListener );
    }

    this.disposeStopwatchReadoutNode = () => {
      timeProperty.unlink( updateText );
      timeProperty.unlink( updateTextPosition );
      options.unitsNode && options.unitsNode.boundsProperty.unlink( unitsNodeBoundsListener );
    };
  }

  dispose() {
    this.disposeStopwatchReadoutNode();
  }
}

//statics
// Make the default fonts public, to inform creation of optional unitsNode
StopwatchReadoutNode.DEFAULT_LARGE_FONT = DEFAULT_LARGE_FONT;
StopwatchReadoutNode.DEFAULT_SMALL_FONT = DEFAULT_SMALL_FONT;

// the full-sized minutes and seconds string
const timeToBigString = ( time, showUnits ) => {

  // Round to the nearest centi-part (if time is in seconds, this would be centiseconds), (compatible with timeToSmallString).
  // see https://github.com/phetsims/masses-and-springs/issues/156
  time = Utils.roundSymmetric( time * 100 ) / 100;

  // When showing units, don't show the "00:" prefix, see https://github.com/phetsims/scenery-phet/issues/378
  if ( showUnits ) {
    return Math.floor( time ) + '';
  }
  else {
    const timeInSeconds = time;

    // If no units are provided, then we assume the time is in seconds, and should be shown in mm:ss.cs
    let minutes = Math.floor( timeInSeconds / 60 ) % 60;
    let seconds = Math.floor( timeInSeconds ) % 60;

    if ( seconds < 10 ) {
      seconds = '0' + seconds;
    }
    if ( minutes < 10 ) {
      minutes = '0' + minutes;
    }
    return minutes + ':' + seconds;
  }
};

// the smaller hundredths-of-a-second string
const timeToSmallString = time => {

  // Round to the nearest centisecond (compatible with timeToSmallString).
  // see https://github.com/phetsims/masses-and-springs/issues/156
  time = Utils.roundSymmetric( time * 100 ) / 100;

  // Rounding after mod, in case there is floating-point error
  let centitime = Utils.roundSymmetric( time % 1 * 100 );
  if ( centitime < 10 ) {
    centitime = '0' + centitime;
  }
  return '.' + centitime;
};

// @public {number} - the default value for max time
StopwatchReadoutNode.DEFAULT_MAX_VALUE = DEFAULT_MAX_VALUE;

sceneryPhet.register( 'StopwatchReadoutNode', StopwatchReadoutNode );
export default StopwatchReadoutNode;