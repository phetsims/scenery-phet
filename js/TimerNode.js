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
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PauseIconShape = require( 'SCENERY_PHET/PauseIconShape' );
  var PlayIconShape = require( 'SCENERY_PHET/PlayIconShape' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var ShadedRectangle = require( 'SCENERY_PHET/ShadedRectangle' );
  var Tandem = require( 'TANDEM/Tandem' );
  var TimerReadoutNode = require( 'SCENERY_PHET/TimerReadoutNode' );
  var UTurnArrowShape = require( 'SCENERY_PHET/UTurnArrowShape' );
  
  // constants
  var ICON_HEIGHT = 10;

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
      iconFill: 'black',
      iconStroke: null,
      iconLineWidth: 1,
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

    // Buttons ----------------------------------------------------------------------------

    var resetPath = new Path( new UTurnArrowShape( ICON_HEIGHT ), {
      fill: options.iconFill
    } );

    var playIconHeight = resetPath.height;
    var playIconWidth = 0.8 * playIconHeight;
    var playPath = new Path( new PlayIconShape( playIconWidth, playIconHeight ), {
      stroke: options.iconStroke,
      fill: options.iconFill
    } );

    var pausePath = new Path( new PauseIconShape( 0.75 * playIconWidth, playIconHeight ), {
      stroke: options.iconStroke,
      fill: options.iconFill
    } );

    var playPauseButton = new BooleanRectangularToggleButton( pausePath, playPath, runningProperty, {
      baseColor: options.buttonBaseColor,
      tandem: options.tandem.createTandem( 'playPauseButton' )
    } );

    var resetButton = new RectangularPushButton( {
      listener: function resetTimer() {
        runningProperty.set( false );
        timeProperty.set( 0 );
      },
      content: resetPath,
      baseColor: options.buttonBaseColor,
      tandem: options.tandem.createTandem( 'resetButton' )
    } );

    // Layout ----------------------------------------------------------------------------

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

    // Panel background
    var roundedRectangle = new ShadedRectangle( contents.bounds.dilated( panelPad ) );
    roundedRectangle.touchArea = roundedRectangle.localBounds.dilated( options.touchAreaDilation );
    this.addChild( roundedRectangle );

    this.addChild( contents );

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
      Node.prototype.dispose.call( this );
    }
  } );
} );