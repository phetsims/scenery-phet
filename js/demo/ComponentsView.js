// Copyright 2002-2014, University of Colorado Boulder

/**
 * Demonstration of scenery-phet UI components
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var FaucetNode = require( 'SCENERY_PHET/FaucetNode' );
  var HSlider = require( 'SUN/HSlider' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MeasuringTape = require( 'SCENERY_PHET/MeasuringTape' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var RefreshButton = require( 'SCENERY_PHET/buttons/RefreshButton' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var SoundToggleButton = require( 'SCENERY_PHET/buttons/SoundToggleButton' );
  var StarButton = require( 'SCENERY_PHET/buttons/StarButton' );
  var StarNode = require( 'SCENERY_PHET/StarNode' );
  var Text = require( 'SCENERY/nodes/Text' );
  var ThermometerNode = require( 'SCENERY_PHET/ThermometerNode' );
  var TimerToggleButton = require( 'SCENERY_PHET/buttons/TimerToggleButton' );
  var WavelengthSlider = require( 'SCENERY_PHET/WavelengthSlider' );

  // constants
  var BUTTON_CAPTION_FONT = new PhetFont( 12 );
  var BUTTON_CAPTION_SPACING = 10; // space between buttons and their captions

  function ButtonsView() {
    ScreenView.call( this, {renderer: 'svg'} );

    // thermometer
    var temperatureProperty = new Property( 50 );
    var thermometer = new ThermometerNode( 0, 100, temperatureProperty, {
      right: this.layoutBounds.right - 100,
      bottom: this.layoutBounds.bottom - 20
    } );
    this.addChild( thermometer );

    // slider for controlling thermometer
    var tempSlider = new HSlider( temperatureProperty, {min: 0, max: 100} );
    tempSlider.rotation = -Math.PI / 2;
    tempSlider.right = thermometer.left - 10;
    tempSlider.centerY = thermometer.centerY;
    this.addChild( tempSlider );

    // measuring tape
    var measuringTapeScaleProperty = new Property( 0.5 );
    var measuringTapeUnitsProperty = new Property( { name: 'meters', multiplier: 1 } );
    var measuringTape = new MeasuringTape( new ModelViewTransform2.createIdentity(), measuringTapeUnitsProperty, new Property( true ), {
      textColor: 'black',
      unrolledTapeDistance: 100,
      dragBounds: this.layoutBounds,
      scaleProperty: measuringTapeScaleProperty
    } );
    this.addChild( measuringTape );
    var measuringTapeScaleSlider = new HSlider( measuringTapeScaleProperty, {min: 0.5, max: 2} ).mutate( {
      left: 50,
      top: measuringTape.bottom + 20
    } );
    this.addChild( measuringTapeScaleSlider );

    /*
     * Fill up a star by creating new StarNodes dynamically.
     * Shouldn't be a problem for sims since stars are relatively static.
     * Stars should be rewritten if they need to support smooth dynamic filling (may require mutable kite paths).
     */
    var starNodeContainer = new Node( {
      children: [new StarNode()],
      top: 20,
      right: this.layoutBounds.right - 20
    } );
    this.addChild( starNodeContainer );
    var starValueProperty = new Property( 1 );
    this.addChild( new HSlider( starValueProperty, { min: 0, max: 1 } ).mutate( {
      right: starNodeContainer.right,
      top: starNodeContainer.bottom + 5
    } ) );
    starValueProperty.link( function( value ) {
      starNodeContainer.children = [new StarNode( {
        value: value
      } )];
    } );

    // faucet
    var fluidRateProperty = new Property( 5 );
    var faucetNode = new FaucetNode( 10, fluidRateProperty, new Property( true ), {
      left: 10,
      bottom: this.layoutBounds.bottom - 10
    } );
    this.addChild( faucetNode );

    // Reset All button
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        temperatureProperty.reset();
        measuringTapeScaleProperty.reset();
        starValueProperty.reset();
        fluidRateProperty.reset();
      },
      radius: 22,
      right: this.layoutBounds.right - 10,
      bottom: this.layoutBounds.bottom - 10
    } );
    this.addChild( resetAllButton );
  }

  return inherit( ScreenView, ButtonsView, {
    step: function( timeElapsed ) {
      // Does nothing for now.
    }
  } );
} );