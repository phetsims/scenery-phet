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
  var Dimension2 = require( 'DOT/Dimension2' );
  var FaucetNode = require( 'SCENERY_PHET/FaucetNode' );
  var HSlider = require( 'SUN/HSlider' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MeasuringTape = require( 'SCENERY_PHET/MeasuringTape' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Property = require( 'AXON/Property' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var StarNode = require( 'SCENERY_PHET/StarNode' );
  var ThermometerNode = require( 'SCENERY_PHET/ThermometerNode' );

  function ComponentsView() {

    ScreenView.call( this, {renderer: 'svg'} );

    // thermometer
    var temperatureProperty = new Property( 50 );
    var thermometer = new ThermometerNode( 0, 100, temperatureProperty, {
      right: this.layoutBounds.right - 100,
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
    var measuringTape = new MeasuringTape( ModelViewTransform2.createIdentity(), measuringTapeUnitsProperty, new Property( true ), {
      textColor: 'black',
      unrolledTapeDistance: 100,
      dragBounds: this.layoutBounds,
      scaleProperty: measuringTapeScaleProperty
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
      children: [new StarNode()],
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

  return inherit( ScreenView, ComponentsView );
} );