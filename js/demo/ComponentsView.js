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
  var BracketNode = require( 'SCENERY_PHET/BracketNode' );
  var CheckBox = require( 'SUN/CheckBox' );
  var ConductivityTesterNode = require( 'SCENERY_PHET/ConductivityTesterNode' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var EyeDropperNode = require( 'SCENERY_PHET/EyeDropperNode' );
  var FaucetNode = require( 'SCENERY_PHET/FaucetNode' );
  var HSlider = require( 'SUN/HSlider' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MeasuringTape = require( 'SCENERY_PHET/MeasuringTape' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var MovableDragHandler = require( 'SCENERY_PHET/input/MovableDragHandler' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var RulerNode = require( 'SCENERY_PHET/RulerNode' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var StarNode = require( 'SCENERY_PHET/StarNode' );
  var Text = require( 'SCENERY/nodes/Text' );
  var ThermometerNode = require( 'SCENERY_PHET/ThermometerNode' );
  var Vector2 = require( 'DOT/Vector2' );

  function ComponentsView() {

    ScreenView.call( this, { layoutBounds: new Bounds2( 0, 0, 768, 504 ) } );

    // thermometer
    var temperatureProperty = new Property( 50 );
    var thermometer = new ThermometerNode( 0, 100, temperatureProperty, {
      glassThickness: 6,
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
    var measuringTapeUnitsProperty = new Property( { name: 'meters', multiplier: 1 } );
    var measuringTape = new MeasuringTape( measuringTapeUnitsProperty, new Property( true ), {
      textColor: 'black',
      dragBounds: this.layoutBounds,
      basePositionProperty: new Property( new Vector2( 100, 100 ) ),
      tipPositionProperty: new Property( new Vector2( 200, 100 ) )
    } );
    this.addChild( measuringTape );

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
      scale: 0.5,
      left: 10,
      bottom: this.layoutBounds.bottom - 10
    } );
    this.addChild( faucetNode );
    var faucetEnabledCheckBox = new CheckBox( new Text( 'faucet enabled' ), faucetEnabledProperty, {
      left: faucetNode.left,
      bottom: faucetNode.top
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
    dropperNode.dispensingProperty.lazyLink( function( dispensing ) {
      console.log( 'dropper ' + ( dispensing ? 'dispensing' : 'not dispensing' ) );
    } );

    // conductivity tester
    var brightnessProperty = new Property( 0 ); // 0-1
    var testerLocationProperty = new Property( new Vector2( 0, 0 ) );
    var positiveProbeLocationProperty = new Property( new Vector2( testerLocationProperty.get().x + 140, testerLocationProperty.get().y + 100 ) );
    var negativeProbeLocationProperty = new Property( new Vector2( testerLocationProperty.get().x - 40, testerLocationProperty.get().y + 100 ) );
    var conductivityTesterNode = new ConductivityTesterNode( brightnessProperty,
      testerLocationProperty, positiveProbeLocationProperty, negativeProbeLocationProperty, {
        modelViewTransform: ModelViewTransform2.createOffsetScaleMapping( this.layoutBounds.center, 1 ), // move model origin to screen's center
        positiveProbeFill: 'orange',
        cursor: 'pointer'
      }
    );
    conductivityTesterNode.addInputListener( new MovableDragHandler( testerLocationProperty ) );
    this.addChild( conductivityTesterNode );

    // brightness slider
    var brightnessSlider = new HSlider( brightnessProperty, { min: 0, max: 1 }, {
      thumbSize: new Dimension2( 15, 30 ),
      thumbFillEnabled: 'orange',
      thumbFillHighlighted: 'rgb( 255, 210, 0 )',
      thumbCenterLineStroke: 'black',
      left: this.layoutBounds.centerX,
      centerY: this.layoutBounds.centerY + 50
    } );
    this.addChild( brightnessSlider );

    // short-circuit check box
    var shortCircuitProperty = new Property( 0 );
    shortCircuitProperty.link( function( shortCircuit ) {
      conductivityTesterNode.shortCircuit = shortCircuit;
    } );
    var shortCircuitCheckBox = new CheckBox( new Text( 'short circuit' ), shortCircuitProperty, {
      left: brightnessSlider.left,
      top: brightnessSlider.bottom + 5
    } );
    this.addChild( shortCircuitCheckBox );

    // ruler
    var rulerLength = 300;
    var majorTickWidth = 50;
    var majorTickLabels = [];
    var numberOfTicks = Math.floor( rulerLength / majorTickWidth ) + 1;
    for ( var i = 0; i < numberOfTicks; i++ ) {
      majorTickLabels[ i ] = '' + ( i * majorTickWidth );
    }
    var rulerNode = new RulerNode( rulerLength, 30, majorTickWidth, majorTickLabels, 'm', {
      insetsWidth: 25,
      minorTicksPerMajorTick: 4,
      centerX: this.layoutBounds.centerX,
      bottom: this.layoutBounds.bottom - 5
    } );
    this.addChild( rulerNode );

    // bracket
    var bracketNode = new BracketNode( {
      orientation: 'right',
      labelNode: new Text( 'bracket', { font: new PhetFont() } ),
      left: this.layoutBounds.left + 10,
      centerY: this.layoutBounds.centerY
    } );
    this.addChild( bracketNode );

    // Reset All button
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        temperatureProperty.reset();
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