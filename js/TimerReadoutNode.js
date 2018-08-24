// Copyright 2018, University of Colorado Boulder

/**
 * Shows an elapsed time--can be displayed in a TimerNode.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Node = require( 'SCENERY/nodes/Node' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Util = require( 'DOT/Util' );
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );

  class TimerReadoutNode extends Rectangle {

    /**
     * @param {Property.<Number>} secondsProperty
     * @param {Object} options
     */
    constructor( secondsProperty, options ) {

      options = _.extend( {

        // The maximum value that can be shown by the TimerNode, so it can set up the size to accommodate
        // the largest string
        maxValue: 99.99,

        // {null|Node} - optional node to show for the units.  Note that showing units changes the mode
        // from mm:ss.mm to ss.mm units and changes from center aligned to right aligned.  Initialize the TimerNode with
        // the largest possible unitsNode to make sure the text panel is large enough. When the unitsNode bounds change,
        // the layout will update.
        unitsNode: null
      }, options );

      const unitsNode = options.unitsNode;

      /*---------------------------------------------------------------------------*
       * Readout text
       *----------------------------------------------------------------------------*/
      const largeNumberText = new PhetFont( 20 );
      const bigReadoutText = new Text( timeToBigString( 0, !!unitsNode ), { font: largeNumberText } );
      const smallFont = new PhetFont( 15 );
      const smallReadoutText = new Text( timeToSmallString( 0 ), { font: smallFont } );

      // aligns the baselines of the big and small text
      smallReadoutText.bottom = smallReadoutText.bounds.maxY - bigReadoutText.bounds.minY;
      bigReadoutText.top = 0;
      const children = [ bigReadoutText, smallReadoutText ];

      if ( unitsNode ) {
        unitsNode.bottom = smallReadoutText.bottom - 1;
        children.push( unitsNode );
      }

      const readoutLayer = new Node( {
        children: children,
        pickable: false
      } );

      /*---------------------------------------------------------------------------*
       * Control logic and initial layout
       *----------------------------------------------------------------------------*/
      const updateText = value => {

        // Update readouts
        bigReadoutText.text = timeToBigString( value, !!unitsNode );
        smallReadoutText.text = timeToSmallString( value );

        // Update layout - when unitsNode is shown, the text is right aligned.  Otherwise it is centered.
        if ( unitsNode ) {
          smallReadoutText.right = unitsNode.left - 3;
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

      const updateTextLocation = () => {
        if ( unitsNode ) {
          const RIGHT_MARGIN = 4;
          readoutLayer.right = parentBounds.right - RIGHT_MARGIN;
        }
        else {
          readoutLayer.center = parentBounds.center;
        }
      };

      // Set initial values and layout
      secondsProperty.link( updateText );
      secondsProperty.link( updateTextLocation );

      let unitsNodeBoundsListener = null;

      // If the unitsNode changes size, update the layout to accommodate the new size
      if ( unitsNode ) {
        unitsNodeBoundsListener = function() {
          updateText( secondsProperty.value );
          updateTextLocation();
        };
        unitsNode.on( 'bounds', unitsNodeBoundsListener );
      }

      this.disposeTimerReadoutNode = () => {
        secondsProperty.unlink( updateText );
        secondsProperty.unlink( updateTextLocation );
        unitsNode && unitsNode.off( unitsNodeBoundsListener );
      };
    }

    dispose() {
      this.disposeTimerReadoutNode();
    }
  }


  // the full-sized minutes and seconds string
  const timeToBigString = ( timeInSeconds, showUnits ) => {

    // Round to the nearest centisecond (compatible with timeToSmallString).
    // see https://github.com/phetsims/masses-and-springs/issues/156
    timeInSeconds = Util.roundSymmetric( timeInSeconds * 100 ) / 100;

    // When showing units, don't show the "00:" prefix, see https://github.com/phetsims/scenery-phet/issues/378
    if ( showUnits ) {
      return Math.floor( timeInSeconds ) + '';
    }
    else {

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
  const timeToSmallString = timeInSeconds => {

    // Round to the nearest centisecond (compatible with timeToSmallString).
    // see https://github.com/phetsims/masses-and-springs/issues/156
    timeInSeconds = Util.roundSymmetric( timeInSeconds * 100 ) / 100;

    // Rounding after mod, in case there is floating-point error
    let centiseconds = Util.roundSymmetric( timeInSeconds % 1 * 100 );
    if ( centiseconds < 10 ) {
      centiseconds = '0' + centiseconds;
    }
    return '.' + centiseconds;
  };

  return sceneryPhet.register( 'TimerReadoutNode', TimerReadoutNode );
} );