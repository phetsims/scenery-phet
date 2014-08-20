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
  var OutsideBackgroundNode = require( 'SCENERY_PHET/OutsideBackgroundNode' );
  var ThermometerNode = require( 'SCENERY_PHET/ThermometerNode' );
  var Property = require( 'AXON/Property' );
  var StarNode = require( 'SCENERY_PHET/StarNode' );
  var HSlider = require( 'SUN/HSlider' );
  var Vector2 = require( 'DOT/Vector2' );
  var Node = require( 'SCENERY/nodes/Node' );
  var WavelengthSlider = require( 'SCENERY_PHET/WavelengthSlider' );
  var MeasuringTape = require( 'SCENERY_PHET/MeasuringTape' );

  function SceneryPhetScreenView() {
    ScreenView.call( this, { renderer: 'svg' } );

    // background
    this.addChild( new OutsideBackgroundNode( this.layoutBounds.centerX, this.layoutBounds.centerY + 20, this.layoutBounds.width * 3, this.layoutBounds.height, this.layoutBounds.height ) );

    //Test for thermometer node
    var tempProperty = new Property( 50 );
    var tempSlider = new HSlider( tempProperty, { min: 0, max: 100 } );
    tempSlider.rotation = -Math.PI / 2;
    tempSlider.centerX = this.layoutBounds.centerX + 75;
    tempSlider.centerY = this.layoutBounds.centerY;
    this.addChild( tempSlider );

    var thermometer = new ThermometerNode( 0, 100, tempProperty, { centerX: this.layoutBounds.centerX, centerY: this.layoutBounds.centerY } );
    thermometer.centerX = this.layoutBounds.centerX;
    thermometer.centerY = this.layoutBounds.centerY;
    this.addChild( thermometer );

    //test for measuring tape
    var mtScaleProperty = new Property( 1 );
    var mtUnitsProperty = new Property( 'metric' );
    var measuringTape = new MeasuringTape( this.layoutBounds, mtScaleProperty, mtUnitsProperty,
      {
        initialMeasuringTapePosition: new Vector2( 500, 400 )
      } );
    this.addChild( measuringTape );

    //Test for showing the star filling up.  Note this just creates new stars dynamically.  Shouldn't be a problem for sims since stars are relatively static.
    //Stars should be rewritten if they need to support smooth dynamic filling (may require mutable kite paths)
    var starNodeContainer = new Node( {children: [new StarNode()], top: 20, left: 20} );
    this.addChild( starNodeContainer );

    var starValueProperty = new Property( 1 );
    this.addChild( new HSlider( starValueProperty, {min: 0, max: 1} ).mutate( {left: 20, top: 80} ) );
    starValueProperty.link( function( value ) {
      starNodeContainer.children = [new StarNode( {
        value: value
      } )];
    } );

    //Test for wavelength slider
    var wavelengthProperty = new Property( 500 );
    var wavelengthSlider = new WavelengthSlider( wavelengthProperty, { centerY: this.layoutBounds.centerY, tweakersVisible: false, valueVisible: false } );

    this.addChild( wavelengthSlider );
  }

  return inherit( ScreenView, SceneryPhetScreenView, {
    step: function( timeElapsed ) {
      // Does nothing for now.
    }
  } );
} );