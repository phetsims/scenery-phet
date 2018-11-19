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
  var Shape = require( 'KITE/Shape' );
  var Tandem = require( 'TANDEM/Tandem' );
  var TimerReadoutNode = require( 'SCENERY_PHET/TimerReadoutNode' );
  var UTurnArrowShape = require( 'SCENERY_PHET/UTurnArrowShape' );

  /**
   * @param {Property.<number>} timeProperty
   * @param {Property.<boolean>} runningProperty
   * @param {Object} [options]
   * @constructor
   */
  function TimerNode( timeProperty, runningProperty, options ) {

    options = _.extend( {

      // See also options that pass through to TimerReadoutNode
      touchAreaDilation: 10,
      cursor: 'pointer',
      iconColor: '#333',
      buttonBaseColor: '#DFE0E1',
      buttonSpacing: 6, // horizontal distance between the buttons
      buttonTopMargin: 6, // space between the bottom of the readout and the top of the buttons

      // Tandem is required to make sure the buttons are instrumented
      tandem: Tandem.required
    }, options );

    assert && assert( options.buttonSpacing >= 0, 'Buttons cannot overlap' );
    assert && assert( options.buttonTopMargin >= 0, 'Buttons cannot overlap the readout' );

    Node.call( this );

    // Create the TimerReadoutNode.  If we need more flexibility for this part, consider inversion of control
    var timerReadoutNode = new TimerReadoutNode( timeProperty, options );
    timerReadoutNode.centerX = 0;

    var minimumButtonWidth = ( timerReadoutNode.width - options.buttonSpacing ) / 2 - 1; // -1 due to the stroke making it look mis-aligned

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
      .close()
      .getOffsetShape( -playOffset );

    // a stop symbol (square)
    var pauseShape = Shape.bounds( new Bounds2( 0, -playPauseHeight / 2, playPauseWidth, playPauseHeight / 2 ).eroded( playPauseWidth * 0.1 ) );

    var resetButton = new RectangularPushButton( {
      tandem: options.tandem.createTandem( 'resetButton' ),
      listener: function resetTimer() {
        runningProperty.set( false );
        timeProperty.set( 0 );
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
        tandem: options.tandem.createTandem( 'playPauseButton' ),
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

    resetButton.right = -options.buttonSpacing / 2;
    playPauseButton.left = options.buttonSpacing / 2;
    resetButton.top = timerReadoutNode.bottom + options.buttonTopMargin;
    playPauseButton.top = timerReadoutNode.bottom + options.buttonTopMargin;

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
    timeProperty.link( updateResetButtonEnabled );

    // @private
    this.disposeTimerNode = function() {
      timerReadoutNode.dispose();
      timeProperty.unlink( updateResetButtonEnabled );
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