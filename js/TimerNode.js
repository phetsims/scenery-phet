// Copyright 2014-2016, University of Colorado Boulder

/**
 * Copyright 2002-2013, University of Colorado
 * Timer Node.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 * @author Anton Ulyanov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Shape = require( 'KITE/Shape' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Color = require( 'SCENERY/util/Color' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var UTurnArrowShape = require( 'SCENERY_PHET/UTurnArrowShape' );
  var ShadedRectangle = require( 'SCENERY_PHET/ShadedRectangle' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var BooleanRectangularToggleButton = require( 'SUN/buttons/BooleanRectangularToggleButton' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var Tandem = require( 'TANDEM/Tandem' );

  /**
   *
   * @param {Property.<number>} secondsProperty
   * @param {Property.<boolean>} runningProperty
   * @param {Object} [options]
   * @constructor
   */
  function TimerNode( secondsProperty, runningProperty, options ) {
    Tandem.indicateUninstrumentedCode();
    options = _.extend( {
      iconColor: '#333',
      buttonBaseColor: '#DFE0E1',
      touchAreaDilation: 10,
      //tandem: Tandem.required()
    }, options );

    Node.call( this, _.extend( { cursor: 'pointer' }, options ) );

    /*---------------------------------------------------------------------------*
     * Readout text
     *----------------------------------------------------------------------------*/
    var bigReadoutText = new Text( timeToBigString( 0 ), {
      font: new PhetFont( 20 )
    } );
    var smallReadoutText = new Text( timeToSmallString( 0 ), {
      font: new PhetFont( 15 ),
      left: bigReadoutText.right
    } );
    // aligns the baselines of the big and small text
    smallReadoutText.bottom = smallReadoutText.bounds.maxY - bigReadoutText.bounds.minY;
    bigReadoutText.top = 0;
    var readoutText = new Node( {
      children: [
        bigReadoutText,
        smallReadoutText
      ],
      pickable: false
    } );
    readoutText.centerX = 0;

    /*---------------------------------------------------------------------------*
     * Readout background
     *----------------------------------------------------------------------------*/
    var textBackground = Rectangle.roundedBounds( readoutText.bounds.dilatedXY( 5, 2 ), 5, 5, {
      fill: '#fff',
      stroke: 'rgba(0,0,0,0.5)',
      pickable: false
    } );

    var paddingBetweenItems = 6;
    var minimumButtonWidth = ( textBackground.width - paddingBetweenItems ) / 2 - 1; // -1 due to the stroke making it look mis-aligned

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
    var container = new Node();
    container.addChild( resetButton );
    container.addChild( playPauseButton );
    container.addChild( textBackground );
    container.addChild( readoutText );

    resetButton.right = -paddingBetweenItems / 2;
    playPauseButton.left = paddingBetweenItems / 2;
    resetButton.top = textBackground.bottom + paddingBetweenItems;
    playPauseButton.top = textBackground.bottom + paddingBetweenItems;

    var panelPad = 8;
    container.left = panelPad;
    container.top = panelPad;

    /*---------------------------------------------------------------------------*
     * Panel background
     *----------------------------------------------------------------------------*/
    var roundedRectangle = new ShadedRectangle( container.bounds.dilated( panelPad ), {
      baseColor: new Color( 80, 130, 230 ),
      cornerRadius: 10
    } );
    roundedRectangle.touchArea = roundedRectangle.localBounds.dilated( options.touchAreaDilation );
    this.addChild( roundedRectangle );
    this.addChild( container );

    /*---------------------------------------------------------------------------*
     * Control logic
     *----------------------------------------------------------------------------*/
    var updateTime = function updateTime( value ) {
      bigReadoutText.text = timeToBigString( value );
      smallReadoutText.text = timeToSmallString( value );
      resetButton.enabled = value > 0;
    };
    secondsProperty.link( updateTime );

    /*---------------------------------------------------------------------------*
     * Target for drag listeners
     *----------------------------------------------------------------------------*/
    this.dragTarget = roundedRectangle;

    this.disposeTimerNode = function() {
      secondsProperty.unlink( updateTime );
      resetButton.dispose();
      playPauseButton.dispose();
    };
  }

  sceneryPhet.register( 'TimerNode', TimerNode );

  // the full-sized minutes and seconds string
  function timeToBigString( timeInSeconds ) {
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

  // the smaller hundredths-of-a-second string
  function timeToSmallString( timeInSeconds ) {
    var centiseconds = Math.floor( timeInSeconds % 1 * 100 );
    if ( centiseconds < 10 ) {
      centiseconds = '0' + centiseconds;
    }
    return '.' + centiseconds;
  }

  return inherit( Node, TimerNode, {
    // @public - Provide dispose() on the prototype for ease of subclassing.
    dispose: function() {
      this.disposeTimerNode();
    }
  } );
} );
