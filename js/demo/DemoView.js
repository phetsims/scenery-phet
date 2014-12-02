// Copyright 2002-2014, University of Colorado Boulder

/**
 * Main ScreenView container for Buttons portion of the UI component demo.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var ThermometerNode = require( 'SCENERY_PHET/ThermometerNode' );
  var Property = require( 'AXON/Property' );
  var StarNode = require( 'SCENERY_PHET/StarNode' );
  var HSlider = require( 'SUN/HSlider' );
  var Node = require( 'SCENERY/nodes/Node' );
  var WavelengthSlider = require( 'SCENERY_PHET/WavelengthSlider' );
  var MeasuringTape = require( 'SCENERY_PHET/MeasuringTapeDeprecated' );
  var RefreshButton = require( 'SCENERY_PHET/buttons/RefreshButton' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var StarButton = require( 'SCENERY_PHET/buttons/StarButton' );
  var SoundToggleButton = require( 'SCENERY_PHET/buttons/SoundToggleButton' );
  var TimerToggleButton = require( 'SCENERY_PHET/buttons/TimerToggleButton' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );

  // constants
  var BUTTON_CAPTION_FONT = new PhetFont( 12 );
  var BUTTON_CAPTION_SPACING = 10; // space between buttons and their captions

  function DemoView() {
    ScreenView.call( this, { renderer: 'svg' } );

    // Text area for outputting test information
    var outputText = new Text( '(output text)', { font: new PhetFont( 16 ), bottom: this.layoutBounds.height - 5, left: this.layoutBounds.minX + 10  } );
    this.addChild( outputText );

    // thermometer
    var tempProperty = new Property( 50 );
    var thermometer = new ThermometerNode( 0, 100, tempProperty, { centerX: this.layoutBounds.centerX, centerY: this.layoutBounds.centerY } );
    thermometer.centerX = this.layoutBounds.centerX;
    thermometer.centerY = this.layoutBounds.centerY;
    this.addChild( thermometer );

    // slider for controlling thermometer
    var tempSlider = new HSlider( tempProperty, { min: 0, max: 100 } );
    tempSlider.rotation = -Math.PI / 2;
    tempSlider.left = thermometer.right + 10;
    tempSlider.centerY = thermometer.centerY;
    this.addChild( tempSlider );

    // measuring tape
    var mtScaleProperty = new Property( 1 );
    var mtUnitsProperty = new Property( { name: 'meters', multiplier: 1 } );
    var measuringTape = new MeasuringTape( this.layoutBounds, mtScaleProperty, mtUnitsProperty,
      {
        x: 500,
        y: 400,
        tipColor: 'black',
        tipRadius: 8,
        initialValue: 10
      } );
    this.addChild( measuringTape );

    //Test for showing the star filling up.  Note this just creates new stars dynamically.  Shouldn't be a problem for sims since stars are relatively static.
    //Stars should be rewritten if they need to support smooth dynamic filling (may require mutable kite paths)
    var starNodeContainer = new Node( {children: [new StarNode()], top: 20, left: 20} );
    this.addChild( starNodeContainer );

    var starValueProperty = new Property( 1 );
    this.addChild( new HSlider( starValueProperty, {min: 0, max: 1} ).mutate( {left: starNodeContainer.left, top: starNodeContainer.bottom + 5 } ) );
    starValueProperty.link( function( value ) {
      starNodeContainer.children = [new StarNode( {
        value: value
      } )];
    } );

    // wavelength slider
    var wavelengthProperty = new Property( 500 );
    var wavelengthSlider = new WavelengthSlider( wavelengthProperty,
      { left: 10, centerY: this.layoutBounds.centerY, tweakersVisible: false, valueVisible: false } );
    this.addChild( wavelengthSlider );

    // Refresh button and caption
    var refreshButton = new RefreshButton(
      {
        listener: function() { outputText.text = 'Refresh pressed'; },
        right: this.layoutBounds.width - 20,
        top: 10
      } );
    this.addChild( refreshButton );
    var refreshButtonLabel = new Text( 'Refresh Button: ', { font: BUTTON_CAPTION_FONT, right: refreshButton.left - 5, centerY: refreshButton.centerY } );
    this.addChild( refreshButtonLabel );

    // Return-to-level-select button and caption
    var returnToLevelSelectButton = new StarButton(
      {
        listener: function() { outputText.text = 'Return to level select pressed'; },
        centerX: refreshButton.centerX,
        top: refreshButton.bottom + BUTTON_CAPTION_SPACING
      } );
    this.addChild( returnToLevelSelectButton );
    var returnToLevelSelectButtonLabel = new Text( 'Return to Level Selection Button: ', { font: BUTTON_CAPTION_FONT, right: returnToLevelSelectButton.left - 5, centerY: returnToLevelSelectButton.centerY } );
    this.addChild( returnToLevelSelectButtonLabel );

    // sound toggle button
    var soundEnabled = new Property( true );
    var soundToggleButton = new SoundToggleButton( soundEnabled, { centerX: refreshButton.centerX, top: returnToLevelSelectButton.bottom + BUTTON_CAPTION_SPACING * 5 } );
    this.addChild( soundToggleButton );
    var soundToggleButtonLabel = new Text( 'Sound Toggle Button: ', { font: BUTTON_CAPTION_FONT, right: soundToggleButton.left - 5, centerY: soundToggleButton.centerY } );
    this.addChild( soundToggleButtonLabel );

    // timer toggle button
    var timerEnabled = new Property( true );
    var timerToggleButton = new TimerToggleButton( timerEnabled, { centerX: refreshButton.centerX, y: soundToggleButton.bottom + 5 } );
    this.addChild( timerToggleButton );
    var timerToggleButtonLabel = new Text( 'Timer Toggle Button: ', { font: BUTTON_CAPTION_FONT, right: timerToggleButton.left - 5, centerY: timerToggleButton.centerY } );
    this.addChild( timerToggleButtonLabel );

    // Reset function
    function resetAll() {
      outputText.text = 'Reset All pressed';
      starValueProperty.reset();
      mtScaleProperty.reset();
      mtUnitsProperty.reset();
      wavelengthProperty.reset();
      soundEnabled.reset();
      timerEnabled.reset();
    }
    var resetAllButton = new ResetAllButton( { listener: resetAll, radius: 22, right: this.layoutBounds.right - 10, bottom: this.layoutBounds.bottom - 10 } );
    this.addChild( resetAllButton );
  }

  return inherit( ScreenView, DemoView, {
    step: function( timeElapsed ) {
      // Does nothing for now.
    }
  } );
} );