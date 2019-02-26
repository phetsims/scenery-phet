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
  var Bounds2 = require( 'DOT/Bounds2' );
  var BooleanRectangularToggleButton = require( 'SUN/buttons/BooleanRectangularToggleButton' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PauseIconShape = require( 'SCENERY_PHET/PauseIconShape' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var PlayIconShape = require( 'SCENERY_PHET/PlayIconShape' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var ShadedRectangle = require( 'SCENERY_PHET/ShadedRectangle' );
  var Tandem = require( 'TANDEM/Tandem' );
  var TimerReadoutNode = require( 'SCENERY_PHET/TimerReadoutNode' );
  var UTurnArrowShape = require( 'SCENERY_PHET/UTurnArrowShape' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // Try for a monospace font so that the numbers don't change alignment.  Fallback to Arial as determined in
  // https://github.com/phetsims/wave-interference/issues/239
  var FONT_FAMILY = '"Lucida Console", Arial';
  var DEFAULT_LARGE_FONT = new PhetFont( {
    size: 20,
    family: FONT_FAMILY
  } );
  var DEFAULT_SMALL_FONT = new PhetFont( {
    size: 15,
    family: FONT_FAMILY
  } );

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
      iconHeight: 10,
      iconFill: 'black',
      iconLineWidth: 1,
      buttonBaseColor: '#DFE0E1',
      xSpacing: 6, // horizontal space between the buttons
      ySpacing: 6, // vertical space between readout and buttons
      xMargin: 8,
      yMargin: 8,

      // options passed through to TimerReadoutNode
      timerReadoutNodeOptions: null,

      // The maximum value, that can be shown by the TimerNode, so it can set up the size to accommodate the largest
      // string. Default value is set to 59 minutes and 59 seconds.
      maxValue: 3599.99,

      // Tandem is required to make sure the buttons are instrumented
      tandem: Tandem.required
    }, options );

    assert && assert( options.xSpacing >= 0, 'Buttons cannot overlap' );
    assert && assert( options.ySpacing >= 0, 'Buttons cannot overlap the readout' );

    options.timerReadoutNodeOptions = _.extend( {

      // {null|Node} - optional node to show for the units, most likely to be a Text or RichText.  Note that showing
      // units changes the mode from mm:ss.mm to ss.mm units and changes from center aligned to right aligned.
      // Initialize the TimerNode with the largest possible unitsNode to make sure the text panel is large enough.
      // When the unitsNode bounds change, the layout will update.
      unitsNode: null,

      // {Font} - shown for the numbers before the decimal
      largeFont: DEFAULT_LARGE_FONT,

      // {Font} - shown for the numbers after the decimal
      smallFont: DEFAULT_SMALL_FONT,
      maxValue: options.maxValue,
    }, options.timerReadoutNodeOptions );

    // Create the TimerReadoutNode.  If we need more flexibility for this part, consider inversion of control
    var timerReadoutNode = new TimerReadoutNode( timeProperty, options.timerReadoutNodeOptions );

    // Buttons ----------------------------------------------------------------------------

    var resetPath = new Path( new UTurnArrowShape( options.iconHeight ), {
      fill: options.iconFill
    } );

    var playIconHeight = resetPath.height;
    var playIconWidth = 0.8 * playIconHeight;
    var playPath = new Path( new PlayIconShape( playIconWidth, playIconHeight ), {
      fill: options.iconFill
    } );

    var pausePath = new Path( new PauseIconShape( 0.75 * playIconWidth, playIconHeight ), {
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

    var contents = new VBox( {
      spacing: options.ySpacing,
      children: [
        timerReadoutNode,
        new HBox( {
          spacing: options.xSpacing,
          children: [ resetButton, playPauseButton ]
        } )
      ]
    } );

    // Background panel ----------------------------------------------------------------------------

    var backgroundNode = new ShadedRectangle( new Bounds2( 0, 0,
      contents.width + 2 * options.xMargin, contents.height + 2 * options.yMargin ) );
    backgroundNode.touchArea = backgroundNode.localBounds.dilated( options.touchAreaDilation );
    contents.center = backgroundNode.center;

    assert && assert( !options.children, 'TimerNode sets children' );
    options.children = [ backgroundNode, contents ];

    Node.call( this, options );

    // @public (read-only) - Target for drag listeners
    this.dragTarget = backgroundNode;

    // Disable the reset button when time is zero.
    var timeListener = function( time ) {
      resetButton.enabled = time > 0;
      playPauseButton.enabled = time < options.maxValue;
      if ( time >= options.maxValue ) {
        runningProperty.value = false;
      }
    };
    timeProperty.link( timeListener );

    // @private
    this.disposeTimerNode = function() {
      timerReadoutNode.dispose();
      timeProperty.unlink( timeListener );
      resetButton.dispose();
      playPauseButton.dispose();
    };
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
  }, {
    //statics
    // Make the default fonts public, to inform creation of optional unitsNode
    DEFAULT_LARGE_FONT: DEFAULT_LARGE_FONT,
    DEFAULT_SMALL_FONT: DEFAULT_SMALL_FONT
  } );
} );