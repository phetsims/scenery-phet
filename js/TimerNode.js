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
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var ShadedRectangle = require( 'SCENERY_PHET/ShadedRectangle' );
  var TimerReadoutNode = require( 'SCENERY_PHET/TimerReadoutNode' );
  var Shape = require( 'KITE/Shape' );
  var Tandem = require( 'TANDEM/Tandem' );
  var UTurnArrowShape = require( 'SCENERY_PHET/UTurnArrowShape' );

  /**
   * @param {Property.<number>} secondsProperty
   * @param {Property.<boolean>} runningProperty
   * @param {Object} [options]
   * @constructor
   */
  function TimerNode( secondsProperty, runningProperty, options ) {
    Tandem.indicateUninstrumentedCode();

    options = _.extend( {
      touchAreaDilation: 10,
      cursor: 'pointer',
      iconColor: '#333',
      buttonBaseColor: '#DFE0E1'
      // See also options that pass through to TimerReadoutNode
    }, options );

    Node.call( this );

    // Create the TimerReadoutNode.  If we need more flexibility for this part, consider inversion of control
    var timerReadoutNode = new TimerReadoutNode( secondsProperty, options );
    timerReadoutNode.centerX = 0;

    var paddingBetweenItems = 6;
    var minimumButtonWidth = ( timerReadoutNode.width - paddingBetweenItems ) / 2 - 1; // -1 due to the stroke making it look mis-aligned

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
    contents.addChild( timerReadoutNode );

    resetButton.right = -paddingBetweenItems / 2;
    playPauseButton.left = paddingBetweenItems / 2;
    resetButton.top = timerReadoutNode.bottom + paddingBetweenItems;
    playPauseButton.top = timerReadoutNode.bottom + paddingBetweenItems;

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
      timerReadoutNode.dispose();
      secondsProperty.unlink( updateResetButtonEnabled );
      resetButton.dispose();
      playPauseButton.dispose();
    };

    this.mutate( options );
  }

  sceneryPhet.register( 'TimerNode', TimerNode );

  return inherit( Node, TimerNode, {

    /**
     * Release resources when no longer be used.
     * @public
     */
    dispose: function() {
      this.disposeTimerNode();
    }
  } );
} );