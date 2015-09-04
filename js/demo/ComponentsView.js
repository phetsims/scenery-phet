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
  var LightSensorNode = require( 'SCENERY_PHET/LightSensorNode' );
  var MeasuringTape = require( 'SCENERY_PHET/MeasuringTape' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var MovableDragHandler = require( 'SCENERY_PHET/input/MovableDragHandler' );
  var Node = require( 'SCENERY/nodes/Node' );
  var NumberPicker = require( 'SCENERY_PHET/NumberPicker' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Range = require( 'DOT/Range' );
  var RulerNode = require( 'SCENERY_PHET/RulerNode' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var Shape = require( 'KITE/Shape' );
  var StarNode = require( 'SCENERY_PHET/StarNode' );
  var Text = require( 'SCENERY/nodes/Text' );
  var ThermometerNode = require( 'SCENERY_PHET/ThermometerNode' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var Vector2 = require( 'DOT/Vector2' );

  function ComponentsView() {

    var thisView = this;
    ScreenView.call( this );

    // To add a demo, create an entry here.
    var demos = [
      { label: 'BracketNode', node: demoBracketNode( this.layoutBounds ) },
      { label: 'ConductivityTesterNode', node: demoConductivityTesterNode( this.layoutBounds ) },
      { label: 'EyeDropperNode', node: demoEyeDropperNode( this.layoutBounds ) },
      { label: 'FaucetNode', node: demoFaucetNode( this.layoutBounds ) },
      { label: 'LightSensorNode', node: demoLightSensorNode( this.layoutBounds ) },
      { label: 'MeasuringTape', node: demoMeasuringTape( this.layoutBounds ) },
      { label: 'NumberPicker', node: demoNumberPicker( this.layoutBounds ) },
      { label: 'RulerNode', node: demoRulerNode( this.layoutBounds ) },
      { label: 'StarNode', node: demoStarNode( this.layoutBounds ) },
      { label: 'ThermometerNode', node: demoTemperatureNode( this.layoutBounds ) }
    ];

    var comboBoxItems = [];

    demos.forEach( function( demo ) {

      // add demo to the combo box
      comboBoxItems.push( ComboBox.createItem( new Text( demo.label, { font: new PhetFont( 20 ) } ), demo.node ) );

      // add demo to the scenegraph
      thisView.addChild( demo.node );

      // demo is invisible until selected via the combo box
      demo.node.visible = false;
    } );

    // Parent for the combo box popup list
    var listParent = new Node();
    this.addChild( listParent );

    // Combo box for selecting which component to view
    var selectedDemoProperty = new Property( demos[ 0 ].node );
    var comboBox = new ComboBox( comboBoxItems, selectedDemoProperty, listParent, {
      buttonFill: 'rgb( 218, 236, 255 )',
      top: 20,
      left: 20
    } );
    this.addChild( comboBox );

    // Make the selected demo visible
    selectedDemoProperty.link( function( demo, oldDemo ) {
      if ( oldDemo ) { oldDemo.visible = false; }
      demo.visible = true;
    } );
  }

  // Creates a demo for BracketNode
  var demoBracketNode = function( layoutBounds ) {
    return new BracketNode( {
      orientation: 'left',
      bracketTipLocation: 0.75,
      labelNode: new Text( 'bracket', { font: new PhetFont( 20 ) } ),
      spacing: 10,
      center: layoutBounds.center
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
      trackSize: new Dimension2( 200, 5 ),
      thumbSize: new Dimension2( 25, 45 ),
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
    var shortCircuitCheckBox = new CheckBox( new Text( 'short circuit', { font: new PhetFont( 20 ) } ), shortCircuitProperty, {
      left: brightnessSlider.left,
      bottom: brightnessSlider.top - 50
    } );

    return new Node( {
      children: [ conductivityTesterNode, brightnessSlider, shortCircuitCheckBox ],
      center: layoutBounds.center
    } );
  };

  // Creates a demo for EyeDropperNode
  var demoEyeDropperNode = function( layoutBounds ) {

    var dropperNode = new EyeDropperNode( {
      fluidColor: 'purple',
      center: layoutBounds.center
    } );

    dropperNode.dispensingProperty.lazyLink( function( dispensing ) {
      console.log( 'dropper ' + ( dispensing ? 'dispensing' : 'not dispensing' ) );
    } );

    return dropperNode;
  };

  // Creates a demo for FaucetNode
  var demoFaucetNode = function( layoutBounds ) {

    var fluidRateProperty = new Property( 0 );
    var faucetEnabledProperty = new Property( true );

    var faucetNode = new FaucetNode( 10, fluidRateProperty, faucetEnabledProperty );

    var faucetEnabledCheckBox = new CheckBox( new Text( 'faucet enabled', { font: new PhetFont( 20 ) } ), faucetEnabledProperty, {
      left: faucetNode.left,
      bottom: faucetNode.top - 20
    } );

    return new Node( {
      children: [ faucetNode, faucetEnabledCheckBox ],
      center: layoutBounds.center
    } );
  };

  // Creates a demo for LightSensorNode
  var demoLightSensorNode = function( layoutBounds ) {

    var demoParent = new Node();

    // Layer for the light sensor node.  The node will be destroyed and re-created when its parameters change
    var lightSensorNodeLayer = new Node();

    // Model properties that describe the sensor
    var propertySet = new PropertySet( {
      width: LightSensorNode.DEFAULTS.width,
      height: LightSensorNode.DEFAULTS.height
    } );

    // When the model properties change, update the sensor node
    var updateLightSensor = function() {
      lightSensorNodeLayer.removeAllChildren();
      lightSensorNodeLayer.addChild( new LightSensorNode( {
        width: propertySet.width,
        height: propertySet.height,
        x: layoutBounds.centerX,
        y: layoutBounds.centerY
      } ) );
    };
    propertySet.widthProperty.link( updateLightSensor );
    propertySet.heightProperty.link( updateLightSensor );
    demoParent.addChild( lightSensorNodeLayer );

    // Show a cross hairs in the middle of the screen so that we can verify that the sensor's origin is correct.
    demoParent.addChild( new Path( new Shape()
        .moveTo( layoutBounds.left, layoutBounds.centerY )
        .lineTo( layoutBounds.right, layoutBounds.centerY )
        .moveTo( layoutBounds.centerX, layoutBounds.top )
        .lineTo( layoutBounds.centerX, layoutBounds.bottom ), {
      stroke: 'black',
      lineWidth: 0.5
    } ) );

    // Controls
    demoParent.addChild( new VBox( {
      resize: false, // Don't readjust the size when the slider knob moves all the way to the right
      spacing: 15,
      children: [
        new Text( 'Width', { font: new PhetFont( 16 ) } ),
        new HSlider( propertySet.widthProperty, { min: 1, max: LightSensorNode.DEFAULTS.width * 2 } ),
        new Text( 'Height', { font: new PhetFont( 16 ) } ),
        new HSlider( propertySet.heightProperty, { min: 1, max: LightSensorNode.DEFAULTS.height * 2 } )
      ],
      left: 50,
      bottom: layoutBounds.maxY - 50
    } ) );

    return demoParent;
  };

  // Creates a demo for MeasuringTape
  var demoMeasuringTape = function( layoutBounds ) {

    var measuringTapeUnitsProperty = new Property( { name: 'meters', multiplier: 1 } );

    return new MeasuringTape( measuringTapeUnitsProperty, new Property( true ), {
      textColor: 'black',
      dragBounds: layoutBounds,
      basePositionProperty: new Property( new Vector2( layoutBounds.centerX, layoutBounds.centerY ) ),
      tipPositionProperty: new Property( new Vector2( layoutBounds.centerX + 100, layoutBounds.centerY ) )
    } );
  };

  // Creates a demo for NumberPicker
  var demoNumberPicker = function( layoutBounds ) {
    return new NumberPicker( new Property( 0 ), new Property( new Range( -10, 10 ) ), {
      font: new PhetFont( 40 ),
      center: layoutBounds.center
    } );
  };

  // Creates a demo for RulerNode
  var demoRulerNode = function( layoutBounds ) {

    var rulerLength = 500;
    var majorTickWidth = 50;
    var majorTickLabels = [];
    var numberOfTicks = Math.floor( rulerLength / majorTickWidth ) + 1;
    for ( var i = 0; i < numberOfTicks; i++ ) {
      majorTickLabels[ i ] = '' + ( i * majorTickWidth );
    }

    return new RulerNode( rulerLength, 0.15 * rulerLength, majorTickWidth, majorTickLabels, 'm', {
      insetsWidth: 25,
      minorTicksPerMajorTick: 4,
      center: layoutBounds.center
    } );
  };

  // Creates a demo for StarNode
  var demoStarNode = function( layoutBounds ) {

    var starValueProperty = new Property( 1 );

    var starSlider = new HSlider( starValueProperty, { min: 0, max: 1 }, {
      thumbSize: new Dimension2( 25, 50 ),
      thumbFillHighlighted: 'yellow',
      thumbFillEnabled: 'rgb(220,220,0)',
      thumbCenterLineStroke: 'black'
    } );

    var starNodeContainer = new Node( {
      children: [ new StarNode() ],
      top: starSlider.bottom + 30,
      right: starSlider.right
    } );

    /*
     * Fill up a star by creating new StarNodes dynamically.
     * Shouldn't be a problem for sims since stars are relatively static.
     * Stars should be rewritten if they need to support smooth dynamic filling (may require mutable kite paths).
     */
    starValueProperty.link( function( value ) {
      starNodeContainer.children = [
        new StarNode( {
          value: value,
          outerRadius: 30,
          innerRadius: 15
        } )
      ];
    } );

    return new Node( {
      children: [ starNodeContainer, starSlider ],
      center: layoutBounds.center
    } );
  };

  // Creates a demo for ThermometerNode
  var demoTemperatureNode = function( layoutBounds ) {

    var temperatureProperty = new Property( 50 );

    var thermometer = new ThermometerNode( 0, 100, temperatureProperty, {
      bulbDiameter: 100,
      tubeWidth: 60,
      tubeHeight: 200,
      glassThickness: 6,
      backgroundFill: 'yellow'
    } );

    var temperatureSlider = new HSlider( temperatureProperty, { min: 0, max: 100 }, {
      trackSize: new Dimension2( 200, 5 ),
      thumbSize: new Dimension2( 25, 50 ),
      thumbFillHighlighted: 'red',
      thumbFillEnabled: 'rgb(158,35,32)'
    } );
    temperatureSlider.rotation = -Math.PI / 2;
    temperatureSlider.right = thermometer.left - 50;
    temperatureSlider.centerY = thermometer.centerY;

    return new Node( {
      children: [ thermometer, temperatureSlider ],
      center: layoutBounds.center
    } );
  };

  return inherit( ScreenView, ComponentsView );
} );