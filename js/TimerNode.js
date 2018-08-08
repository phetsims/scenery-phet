// Copyright 2014-2018, University of Colorado Boulder

/**
 * Shows a readout of the elapsed time, with play and pause buttons.  By default there are no units (which could be used
 * if all of a simulations time units are in 'seconds'), or you can specify a selection of units to choose from.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Anton Ulyanov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var BooleanRectangularToggleButton = require( 'SUN/buttons/BooleanRectangularToggleButton' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var ShadedRectangle = require( 'SCENERY_PHET/ShadedRectangle' );
  var Shape = require( 'KITE/Shape' );
  var Tandem = require( 'TANDEM/Tandem' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );
  var UTurnArrowShape = require( 'SCENERY_PHET/UTurnArrowShape' );

  /**
   * @param {Property.<number>} secondsProperty
   * @param {Property.<boolean>} runningProperty
   * @param {Object} [options]
   * @constructor
   */
  function TimerNode( secondsProperty, runningProperty, options ) {
    Tandem.indicateUninstrumentedCode();
    var self = this;
    var timerNodeOptionDefaults = {
      iconColor: '#333',
      buttonBaseColor: '#DFE0E1',

      // The maximum value that can be shown by the TimerNode, so it can set up the size to accommodate
      // the largest string
      maxValue: 99.99,

      // {null|Node} - optional node to show for the units.  Note that showing units changes the mode
      // from mm:ss.mm to ss.mm units.  A ToggleNode works well here because it allocates the size of the
      // largest child node
      unitsNode: null
    };
    var supertypeOptionDefaults = {
      touchAreaDilation: 10,
      cursor: 'pointer'
    };
    options = _.extend( {}, supertypeOptionDefaults, timerNodeOptionDefaults, options );

    var unitsNode = options.unitsNode;

    // @private {Node|null}
    this.unitsNode = unitsNode;
    Node.call( this );

    /*---------------------------------------------------------------------------*
     * Readout text
     *----------------------------------------------------------------------------*/
    var largeNumberText = new PhetFont( 20 );
    var bigReadoutText = new Text( this.timeToBigString( 0 ), { font: largeNumberText } );
    var smallFont = new PhetFont( 15 );
    var smallReadoutText = new Text( this.timeToSmallString( 0 ), { font: smallFont } );

    // aligns the baselines of the big and small text
    smallReadoutText.bottom = smallReadoutText.bounds.maxY - bigReadoutText.bounds.minY;
    bigReadoutText.top = 0;
    if ( unitsNode ) {
      unitsNode.bottom = smallReadoutText.bottom - 1;
    }
    var children = [
      bigReadoutText,
      smallReadoutText
    ];
    if ( unitsNode ) {
      children.push( unitsNode );
    }

    var readoutContainerNode = new Node( {
      children: children,
      pickable: false
    } );
    readoutContainerNode.centerX = 0;

    /*---------------------------------------------------------------------------*
     * Control logic and initial layout
     *----------------------------------------------------------------------------*/
    var update = function( value ) {

      // Update readouts
      bigReadoutText.text = self.timeToBigString( value );
      smallReadoutText.text = self.timeToSmallString( value );

      // Update layout
      smallReadoutText.left = bigReadoutText.right;
      if ( unitsNode ) {
        unitsNode.left = smallReadoutText.right + 3;
      }
      if ( textContainer ) {
        textContainer.centerX = 0;
      }
      readoutContainerNode.centerX = 0;
    };

    // Initialize with max value so nothing needs to resize
    update( options.maxValue );

    /*---------------------------------------------------------------------------*
     * Readout background
     *----------------------------------------------------------------------------*/
    var textContainer = Rectangle.roundedBounds( readoutContainerNode.bounds.dilatedXY( 5, 2 ), 5, 5, {
      fill: '#fff',
      stroke: 'rgba(0,0,0,0.5)',
      pickable: false,
      children: [ readoutContainerNode ],
      centerX: 0
    } );

    // Set initial values and layout
    secondsProperty.link( update );

    var paddingBetweenItems = 6;
    var minimumButtonWidth = ( textContainer.width - paddingBetweenItems ) / 2 - 1; // -1 due to the stroke making it look mis-aligned

    /*---------------------------------------------------------------------------*
     * Buttons
     *----------------------------------------------------------------------------*/
    var resetAllShape = new UTurnArrowShape( 10 );
    var playPauseHeight = resetAllShape.bounds.height;
    var playPauseWidth = playPauseHeight;
    var halfPlayStroke = 0.05 * playPauseWidth;
    var playOffset = 0.15 * playPauseWidth;
    var playShape = new Shape().moveTo( playPauseWidth - halfPlayStroke * 0.5 - playOffset, 0 )
      .lineTo( halfPlayStroke * 1.5 + playOffset, playPauseHeight / 2 - halfPlayStroke - playOffset )
      .lineTo( halfPlayStroke * 1.5 + playOffset, -playPauseHeight / 2 + halfPlayStroke + playOffset )
      .close().getOffsetShape( -playOffset );

    // a stop symbol (square)
    var pauseShape = Shape.bounds( new Bounds2( 0, -playPauseHeight / 2, playPauseWidth, playPauseHeight / 2 ).eroded( playPauseWidth * 0.1 ) );

    var resetButton = new RectangularPushButton( {
      listener: function resetTimer() {
        runningProperty.set( false );
        secondsProperty.set( 0 );
      },
      content: new Path( resetAllShape, {
        fill: options.iconColor
      } ),
      baseColor: options.buttonBaseColor,
      minWidth: minimumButtonWidth
    } );

    var playPauseButton = new BooleanRectangularToggleButton(
      new Path( pauseShape, { fill: options.iconColor } ),
      new Path( playShape, {
        stroke: options.iconColor,
        fill: '#eef',
        lineWidth: halfPlayStroke * 2
      } ), runningProperty, {
        baseColor: options.buttonBaseColor,
        minWidth: minimumButtonWidth
      } );

    /*---------------------------------------------------------------------------*
     * Layout
     *----------------------------------------------------------------------------*/
    var contents = new Node();
    contents.addChild( resetButton );
    contents.addChild( playPauseButton );
    contents.addChild( textContainer );

    resetButton.right = -paddingBetweenItems / 2;
    playPauseButton.left = paddingBetweenItems / 2;
    resetButton.top = textContainer.bottom + paddingBetweenItems;
    playPauseButton.top = textContainer.bottom + paddingBetweenItems;

    var panelPad = 8;
    contents.left = panelPad;
    contents.top = panelPad;

    /*---------------------------------------------------------------------------*
     * Panel background
     *----------------------------------------------------------------------------*/
    var roundedRectangle = new ShadedRectangle( contents.bounds.dilated( panelPad ) );
    roundedRectangle.touchArea = roundedRectangle.localBounds.dilated( options.touchAreaDilation );
    this.addChild( roundedRectangle );
    this.addChild( contents );

    /*---------------------------------------------------------------------------*
     * Target for drag listeners
     *----------------------------------------------------------------------------*/
    // @public (read-only) - Target for drag listeners
    this.dragTarget = roundedRectangle;

    var updateResetButtonEnabled = function( value ) {
      resetButton.enabled = value > 0;
    };
    secondsProperty.link( updateResetButtonEnabled );

    // @private
    this.disposeTimerNode = function() {
      secondsProperty.unlink( update );
      secondsProperty.unlink( updateResetButtonEnabled );
      resetButton.dispose();
      playPauseButton.dispose();
    };

    // Omit TimerNode specific options before passing along to parent.  See https://github.com/phetsims/tasks/issues/934
    // for discussion of other ways to filter the options
    this.mutate( _.omit( options, _.keys( timerNodeOptionDefaults ) ) );
  }

  sceneryPhet.register( 'TimerNode', TimerNode );

  return inherit( Node, TimerNode, {

    /**
     * Release resources when no longer be used.
     * @public
     */
    dispose: function() {
      this.disposeTimerNode();
    },

    // the full-sized minutes and seconds string
    timeToBigString: function( timeInSeconds ) {
      // Round to the nearest centisecond (compatible with timeToSmallString).
      // see https://github.com/phetsims/masses-and-springs/issues/156
      timeInSeconds = Util.roundSymmetric( timeInSeconds * 100 ) / 100;

      // When showing units, don't show the "00:" prefix, see https://github.com/phetsims/scenery-phet/issues/378
      if ( this.unitsNode ) {
        return Math.floor( timeInSeconds ) + '';
      }
      else {

        var minutes = Math.floor( timeInSeconds / 60 ) % 60;
        var seconds = Math.floor( timeInSeconds ) % 60;

        if ( seconds < 10 ) {
          seconds = '0' + seconds;
        }
        if ( minutes < 10 ) {
          minutes = '0' + minutes;
        }
        return minutes + ':' + seconds;
      }
    },

    // the smaller hundredths-of-a-second string
    timeToSmallString: function( timeInSeconds ) {
      // Round to the nearest centisecond (compatible with timeToSmallString).
      // see https://github.com/phetsims/masses-and-springs/issues/156
      timeInSeconds = Util.roundSymmetric( timeInSeconds * 100 ) / 100;

      // Rounding after mod, in case there is floating-point error
      var centiseconds = Util.roundSymmetric( timeInSeconds % 1 * 100 );
      if ( centiseconds < 10 ) {
        centiseconds = '0' + centiseconds;
      }
      return '.' + centiseconds;
    }
  } );
} );