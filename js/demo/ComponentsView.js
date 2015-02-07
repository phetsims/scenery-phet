// Copyright 2002-2014, University of Colorado Boulder

/**
 * Demonstration of misc scenery-phet UI components
 *
 * @author Sam Reid
 * @author Chris Malley
 */
define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var CheckBox = require( 'SUN/CheckBox' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var EyeDropperNode = require( 'SCENERY_PHET/EyeDropperNode' );
  var FaucetNode = require( 'SCENERY_PHET/FaucetNode' );
  var HSlider = require( 'SUN/HSlider' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MeasuringTape = require( 'SCENERY_PHET/MeasuringTape' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Property = require( 'AXON/Property' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var StarNode = require( 'SCENERY_PHET/StarNode' );
  var Text = require( 'SCENERY/nodes/Text' );
  var ThermometerNode = require( 'SCENERY_PHET/ThermometerNode' );
  var Vector2 = require( 'DOT/Vector2' );

  function ComponentsView() {

    ScreenView.call( this, { renderer: 'svg', layoutBounds: new Bounds2( 0, 0, 768, 504 ) } );

    // thermometer
    var temperatureProperty = new Property( 50 );
    var thermometer = new ThermometerNode( 0, 100, temperatureProperty, {
      fluidBulbSpacing: 6,
      fluidTubeSpacing: 6,
      backgroundFill: 'yellow',
      right:  this.layoutBounds.right - 100,
      bottom: this.layoutBounds.bottom - 20
    } );
    this.addChild( thermometer );
    var temperatureSlider = new HSlider( temperatureProperty, { min: 0, max: 100 }, {
      thumbSize: new Dimension2( 15, 30 ),
      thumbFillHighlighted: 'red',
      thumbFillEnabled: 'rgb(158,35,32)'
    } );
    temperatureSlider.rotation = -Math.PI / 2;
    temperatureSlider.right = thermometer.left - 10;
    temperatureSlider.centerY = thermometer.centerY;
    this.addChild( temperatureSlider );

    // measuring tape
    var measuringTapeScaleProperty = new Property( 0.5 );
    var measuringTapeUnitsProperty = new Property( { name: 'meters', multiplier: 1 } );
    var measuringTape = new MeasuringTape( measuringTapeUnitsProperty, new Property( true ), {
      textColor: 'black',
      unrolledTapeDistance: 100,
      dragBounds: this.layoutBounds,
      scaleProperty: measuringTapeScaleProperty,
      basePositionProperty: new Property( new Vector2( 100, 100 ) )
    } );
    this.addChild( measuringTape );
    var measuringTapeScaleSlider = new HSlider( measuringTapeScaleProperty, { min: 0.5, max: 2 }, {
      thumbSize: new Dimension2( 15, 30 ),
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
      children: [ new StarNode() ],
      top: 20,
      right: this.layoutBounds.right - 20
    } );
    this.addChild( starNodeContainer );
    var starValueProperty = new Property( 1 );
    var starSlider = new HSlider( starValueProperty, { min: 0, max: 1 }, {
      thumbSize: new Dimension2( 15, 30 ),
      thumbFillHighlighted: 'yellow',
      thumbFillEnabled: 'rgb(220,220,0)',
      thumbCenterLineStroke: 'black',
      right: starNodeContainer.right,
      top: starNodeContainer.bottom + 5
    } );
    this.addChild( starSlider );
    starValueProperty.link( function( value ) {
      starNodeContainer.children = [ new StarNode( { value: value } ) ];
    } );

    // faucet
    var fluidRateProperty = new Property( 0 );
    var faucetEnabledProperty = new Property( true );
    var faucetNode = new FaucetNode( 10, fluidRateProperty, faucetEnabledProperty, {
      left: 10,
      bottom: this.layoutBounds.bottom - 10
    } );
    this.addChild( faucetNode );
    var faucetEnabledCheckBox = new CheckBox( new Text( 'faucet enabled' ), faucetEnabledProperty, {
      left: faucetNode.left,
      bottom: faucetNode.top + 15
    } );
    this.addChild( faucetEnabledCheckBox );

    // eye dropper
    var dropperNode = new EyeDropperNode( {
      fluidColor: 'purple',
      scale: 0.75,
      centerX: this.layoutBounds.centerX,
      top: 10
    } );
    this.addChild( dropperNode );
    dropperNode.onProperty.lazyLink( function( on ) {
      console.log( 'dropper ' + ( on ? 'on' : 'off' ) );
    } );

    // Reset All button
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        temperatureProperty.reset();
        measuringTapeScaleProperty.reset();
        measuringTape.reset();
        starValueProperty.reset();
        fluidRateProperty.reset();
      },
      radius: 22,
      right:  this.layoutBounds.right - 10,
      bottom: this.layoutBounds.bottom - 10
    } );
    this.addChild( resetAllButton );
  }

  return inherit( ScreenView, ComponentsView );
} );