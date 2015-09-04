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
  var BracketNode = require( 'SCENERY_PHET/BracketNode' );
  var CheckBox = require( 'SUN/CheckBox' );
  var ComboBox = require( 'SUN/ComboBox' );
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
  var NumberPicker = require( 'SCENERY_PHET/NumberPicker' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var Range = require( 'DOT/Range' );
  var RulerNode = require( 'SCENERY_PHET/RulerNode' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var StarNode = require( 'SCENERY_PHET/StarNode' );
  var Text = require( 'SCENERY/nodes/Text' );
  var ThermometerNode = require( 'SCENERY_PHET/ThermometerNode' );
  var Vector2 = require( 'DOT/Vector2' );

  function ComponentsView() {

    var thisView = this;
    ScreenView.call( this );

    // To add a demo, create an entry here.
    var demos = [
      { label: 'BracketNode', node: demoBracketNode() },
      { label: 'ConductivityTesterNode', node: demoConductivityTesterNode( this.layoutBounds ) },
      { label: 'EyeDropperNode', node: demoEyeDropperNode() },
      { label: 'FaucetNode', node: demoFaucetNode() },
      { label: 'MeasuringTape', node: demoMeasuringTape( this.layoutBounds ) },
      { label: 'NumberPicker', node: demoNumberPicker() },
      { label: 'RulerNode', node: demoRulerNode() },
      { label: 'StarNode', node: demoStarNode() },
      { label: 'ThermometerNode', node: demoTemperatureNode() }
    ];

    var comboBoxItems = [];

    demos.forEach( function( demo ) {

      // add demo to the combo box
      comboBoxItems.push( ComboBox.createItem( new Text( demo.label, { font: new PhetFont( 20 ) } ), demo.node ) );

      // add demo to the scenegraph
      thisView.addChild( demo.node );

      // demo is invisible until selected via the combo box
      demo.node.visible = false;

      // demo is centered on the screen
      demo.node.center = thisView.layoutBounds.center;
    } );

    // Combo box for selecting which component to view
    var listParent = new Node();
    this.addChild( listParent );
    var selectedDemoProperty = new Property( demos[ 0 ].node );
    selectedDemoProperty.link( function( demo, oldDemo ) {
      if ( oldDemo ) { oldDemo.visible = false; }
      demo.visible = true;
    } );
    var comboBox = new ComboBox( comboBoxItems, selectedDemoProperty, listParent, {
      top: 20,
      left: 20
    } );
    this.addChild( comboBox );
  }

  // Creates a demo for BracketNode
  var demoBracketNode = function() {
    return new BracketNode( {
      orientation: 'left',
      bracketTipLocation: 0.75,
      labelNode: new Text( 'bracket', { font: new PhetFont( 20 ) } ),
      spacing: 10
    } );
  };

  // Creates a demo for ConductivityTesterNode
  var demoConductivityTesterNode = function( layoutBounds ) {

    var brightnessProperty = new Property( 0 ); // 0-1
    var testerLocationProperty = new Property( new Vector2( 0, 0 ) );
    var positiveProbeLocationProperty = new Property( new Vector2( testerLocationProperty.get().x + 140, testerLocationProperty.get().y + 100 ) );
    var negativeProbeLocationProperty = new Property( new Vector2( testerLocationProperty.get().x - 40, testerLocationProperty.get().y + 100 ) );

    var conductivityTesterNode = new ConductivityTesterNode( brightnessProperty,
      testerLocationProperty, positiveProbeLocationProperty, negativeProbeLocationProperty, {
        modelViewTransform: ModelViewTransform2.createOffsetScaleMapping( layoutBounds.center, 1 ), // move model origin to screen's center
        positiveProbeFill: 'orange',
        cursor: 'pointer'
      }
    );
    conductivityTesterNode.addInputListener( new MovableDragHandler( testerLocationProperty ) );

    // brightness slider
    var brightnessSlider = new HSlider( brightnessProperty, { min: 0, max: 1 }, {
      thumbSize: new Dimension2( 15, 30 ),
      thumbFillEnabled: 'orange',
      thumbFillHighlighted: 'rgb( 255, 210, 0 )',
      thumbCenterLineStroke: 'black',
      left: layoutBounds.centerX,
      bottom: conductivityTesterNode.top - 50
    } );

    // short-circuit check box
    var shortCircuitProperty = new Property( false );
    shortCircuitProperty.link( function( shortCircuit ) {
      conductivityTesterNode.shortCircuit = shortCircuit;
    } );
    var shortCircuitCheckBox = new CheckBox( new Text( 'short circuit', { font: new PhetFont() } ), shortCircuitProperty, {
      left: brightnessSlider.left,
      bottom: brightnessSlider.top - 50
    } );

    return new Node( {
      children: [ conductivityTesterNode, brightnessSlider, shortCircuitCheckBox ]
    } );
  };

  // Creates a demo for EyeDropperNode
  var demoEyeDropperNode = function() {

    var dropperNode = new EyeDropperNode( {
      fluidColor: 'purple',
      visible: false
    } );

    dropperNode.dispensingProperty.lazyLink( function( dispensing ) {
      console.log( 'dropper ' + ( dispensing ? 'dispensing' : 'not dispensing' ) );
    } );

    return dropperNode;
  };

  // Creates a demo for FaucetNode
  var demoFaucetNode = function() {

    var fluidRateProperty = new Property( 0 );
    var faucetEnabledProperty = new Property( true );

    var faucetNode = new FaucetNode( 10, fluidRateProperty, faucetEnabledProperty );

    var faucetEnabledCheckBox = new CheckBox( new Text( 'faucet enabled', { font: new PhetFont() } ), faucetEnabledProperty, {
      left: faucetNode.left,
      bottom: faucetNode.top
    } );

    return new Node( {
      children: [ faucetNode, faucetEnabledCheckBox ]
    } );
  };

  // Creates a demo for MeasuringTape
  var demoMeasuringTape = function( layoutBounds ) {

    var measuringTapeUnitsProperty = new Property( { name: 'meters', multiplier: 1 } );

    return new MeasuringTape( measuringTapeUnitsProperty, new Property( true ), {
      textColor: 'black',
      dragBounds: layoutBounds,
      basePositionProperty: new Property( new Vector2( 100, 100 ) ),
      tipPositionProperty: new Property( new Vector2( 200, 100 ) )
    } );
  };

  // Creates a demo for NumberPicker
  var demoNumberPicker = function() {
    return new NumberPicker( new Property( 0 ), new Property( new Range( -10, 10 ) ) );
  };

  // Creates a demo for RulerNode
  var demoRulerNode = function() {

    var rulerLength = 300;
    var majorTickWidth = 50;
    var majorTickLabels = [];
    var numberOfTicks = Math.floor( rulerLength / majorTickWidth ) + 1;
    for ( var i = 0; i < numberOfTicks; i++ ) {
      majorTickLabels[ i ] = '' + ( i * majorTickWidth );
    }

    return new RulerNode( rulerLength, 30, majorTickWidth, majorTickLabels, 'm', {
      insetsWidth: 25,
      minorTicksPerMajorTick: 4
    } );
  };

  // Creates a demo for StarNode
  var demoStarNode = function() {

    var starNodeContainer = new Node( {
      children: [ new StarNode() ]
    } );

    var starValueProperty = new Property( 1 );

    var starSlider = new HSlider( starValueProperty, { min: 0, max: 1 }, {
      thumbSize: new Dimension2( 15, 30 ),
      thumbFillHighlighted: 'yellow',
      thumbFillEnabled: 'rgb(220,220,0)',
      thumbCenterLineStroke: 'black',
      right: starNodeContainer.right,
      top: starNodeContainer.bottom + 10
    } );

    /*
     * Fill up a star by creating new StarNodes dynamically.
     * Shouldn't be a problem for sims since stars are relatively static.
     * Stars should be rewritten if they need to support smooth dynamic filling (may require mutable kite paths).
     */
    starValueProperty.link( function( value ) {
      starNodeContainer.children = [ new StarNode( { value: value } ) ];
    } );

    return new Node( {
      children: [ starNodeContainer, starSlider ]
    } );
  };

  // Creates a demo for ThermometerNode
  var demoTemperatureNode = function() {

    var temperatureProperty = new Property( 50 );

    var thermometer = new ThermometerNode( 0, 100, temperatureProperty, {
      glassThickness: 6,
      backgroundFill: 'yellow'
    } );

    var temperatureSlider = new HSlider( temperatureProperty, { min: 0, max: 100 }, {
      thumbSize: new Dimension2( 15, 30 ),
      thumbFillHighlighted: 'red',
      thumbFillEnabled: 'rgb(158,35,32)'
    } );
    temperatureSlider.rotation = -Math.PI / 2;
    temperatureSlider.right = thermometer.left - 40;
    temperatureSlider.centerY = thermometer.centerY;

    return new Node( {
      children: [ thermometer, temperatureSlider ]
    } );
  };

  return inherit( ScreenView, ComponentsView );
} );