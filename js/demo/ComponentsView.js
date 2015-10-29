// Copyright 2002-2014, University of Colorado Boulder

/**
 * Demonstration of misc scenery-phet UI components.
 * Demos are selected from a combo box, and are instantiated on demand.
 * Use the 'component' query parameter to set the initial selection of the combo box.
 *
 * @author Sam Reid
 * @author Chris Malley
 */
define( function( require ) {
  'use strict';

  // modules
  var BracketNode = require( 'SCENERY_PHET/BracketNode' );
  var CheckBox = require( 'SUN/CheckBox' );
  var Color = require( 'SCENERY/util/Color' );
  var ConductivityTesterNode = require( 'SCENERY_PHET/ConductivityTesterNode' );
  var DemosView = require( 'SUN/demo/DemosView' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var EyeDropperNode = require( 'SCENERY_PHET/EyeDropperNode' );
  var FaucetNode = require( 'SCENERY_PHET/FaucetNode' );
  var HSlider = require( 'SUN/HSlider' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ProbeNode = require( 'SCENERY_PHET/ProbeNode' );
  var MeasuringTape = require( 'SCENERY_PHET/MeasuringTape' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var MovableDragHandler = require( 'SCENERY_PHET/input/MovableDragHandler' );
  var Node = require( 'SCENERY/nodes/Node' );
  var NumberControl = require( 'SCENERY_PHET/NumberControl' );
  var NumberPicker = require( 'SCENERY_PHET/NumberPicker' );
  var Panel = require( 'SUN/Panel' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Range = require( 'DOT/Range' );
  var RulerNode = require( 'SCENERY_PHET/RulerNode' );
  var Shape = require( 'KITE/Shape' );
  var StarNode = require( 'SCENERY_PHET/StarNode' );
  var Text = require( 'SCENERY/nodes/Text' );
  var ThermometerNode = require( 'SCENERY_PHET/ThermometerNode' );
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var Vector2 = require( 'DOT/Vector2' );
  var RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );

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

  // Creates a demo for ArrowNode
  var demoArrowNode = function( layoutBounds ) {

    var arrowNode = new ArrowNode( 0, 0, 200, 200, {
      headWidth: 30,
      headHeight: 30,
      center: layoutBounds.center
    } );

    var checkedProperty = new Property( false );
    checkedProperty.link( function( checked ) {
      arrowNode.setDoubleHead( checked );
    } );

    var checkbox = CheckBox.createTextCheckBox( 'Double head', { font: new PhetFont( 20 ) }, checkedProperty, {
      centerX: layoutBounds.centerX,
      top: arrowNode.bottom + 50
    } );
    return new Node( {
      children: [
        checkbox,
        arrowNode
      ]
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

  // Creates a demo for ProbeNode
  var demoProbeNode = function( layoutBounds ) {

    var demoParent = new Node();

    // Layer for the light sensor node.  The node will be destroyed and re-created when its parameters change
    var probeNodeLayer = new Node();
    demoParent.addChild( probeNodeLayer );

    // Model properties that describe the sensor
    var propertySet = new PropertySet( ProbeNode.DEFAULT_OPTIONS );
    propertySet.addProperty( 'sensorType', ProbeNode.glass() );

    // RGB color components, for setting the sensor color
    var color = Color.toColor( propertySet.color );
    var redProperty = new Property( color.red );
    var greenProperty = new Property( color.green );
    var blueProperty = new Property( color.blue );
    Property.multilink( [ redProperty, greenProperty, blueProperty ], function( r, g, b ) {
      propertySet.color = new Color( r, g, b );
    } );

    // Controls for the sensor type (glass/crosshairs/empty/etc)
    var radioButtons = new RadioButtonGroup( propertySet.sensorTypeProperty, [
      { value: null, node: new Text( 'null' ) },
      { value: propertySet.sensorTypeProperty.get(), node: new Text( 'default glass' ) },
      { value: ProbeNode.crosshairs(), node: new Text( 'default crosshairs' ) },
      {
        value: ProbeNode.glass( {
          centerColor: 'red',
          middleColor: 'green',
          edgeColor: 'blue'
        } ), node: new Text( 'custom glass' )
      }
    ], {
      right: layoutBounds.maxX - 5,
      top: layoutBounds.minY + 5,
      orientation: 'horizontal',
      baseColor: 'white',
      spacing: 5
    } );
    demoParent.addChild( radioButtons );

    // When the model properties change, update the sensor node
    Property.multilink( [
        propertySet.colorProperty,
        propertySet.radiusProperty,
        propertySet.innerRadiusProperty,
        propertySet.handleWidthProperty,
        propertySet.handleHeightProperty,
        propertySet.handleCornerRadiusProperty,
        propertySet.lightAngleProperty,
        propertySet.sensorTypeProperty
      ],
      function() {
        probeNodeLayer.removeAllChildren();
        probeNodeLayer.addChild( new ProbeNode( {

          // ProbeNode options
          color: propertySet.color,
          radius: propertySet.radius,
          innerRadius: propertySet.innerRadius,
          handleWidth: propertySet.handleWidth,
          handleHeight: propertySet.handleHeight,
          handleCornerRadius: propertySet.handleCornerRadius,
          lightAngle: propertySet.lightAngle,
          sensorType: propertySet.sensorType,
          rotation: propertySet.rotation,

          // layout options
          x: layoutBounds.centerX,
          y: layoutBounds.centerY
        } ) );
      } );

    // Show a cross hairs in the middle of the screen so that we can verify that the sensor's origin is correct.
    var crossHairsRadius = 150;
    demoParent.addChild( new Path( new Shape()
      .moveTo( layoutBounds.centerX - crossHairsRadius, layoutBounds.centerY )
      .lineTo( layoutBounds.centerX + crossHairsRadius, layoutBounds.centerY )
      .moveTo( layoutBounds.centerX, layoutBounds.centerY - crossHairsRadius )
      .lineTo( layoutBounds.centerX, layoutBounds.centerY + crossHairsRadius ), {
      stroke: 'black',
      lineWidth: 0.5
    } ) );

    // Geometry controls
    var numberControlOptions = {
      titleFont: new PhetFont( 14 ),
      valueFont: new PhetFont( 14 ),
      trackSize: new Dimension2( 150, 3 )
    };
    demoParent.addChild( new VBox( {
      resize: false, // Don't readjust the size when the slider knob moves all the way to the right
      spacing: 15,
      children: [
        NumberControl.withMinMaxTicks( 'Radius:', propertySet.radiusProperty,
          new Range( 1, ProbeNode.DEFAULT_OPTIONS.radius * 2 ), numberControlOptions ),
        NumberControl.withMinMaxTicks( 'Inner Radius:', propertySet.innerRadiusProperty,
          new Range( 1, ProbeNode.DEFAULT_OPTIONS.innerRadius * 2 ), numberControlOptions ),
        NumberControl.withMinMaxTicks( 'Handle Width:', propertySet.handleWidthProperty,
          new Range( 1, ProbeNode.DEFAULT_OPTIONS.handleWidth * 2 ), numberControlOptions ),
        NumberControl.withMinMaxTicks( 'Handle Height:', propertySet.handleHeightProperty,
          new Range( 1, ProbeNode.DEFAULT_OPTIONS.handleHeight * 2 ), numberControlOptions ),
        NumberControl.withMinMaxTicks( 'Handle Corner Radius:', propertySet.handleCornerRadiusProperty,
          new Range( 1, ProbeNode.DEFAULT_OPTIONS.handleCornerRadius * 2 ), numberControlOptions )
      ],
      left: layoutBounds.left + 50,
      centerY: layoutBounds.centerY
    } ) );

    // Color controls
    var colorComponentRange = new Range( 0, 255 );
    var colorPanel = new Panel( new VBox( {
      spacing: 15,
      children: [
        NumberControl.withMinMaxTicks( 'R:', redProperty, colorComponentRange, numberControlOptions ),
        NumberControl.withMinMaxTicks( 'G:', greenProperty, colorComponentRange, numberControlOptions ),
        NumberControl.withMinMaxTicks( 'B:', blueProperty, colorComponentRange, numberControlOptions )
      ]
    } ) );

    // Light angle control
    var tickLabelOptions = { font: new PhetFont( 14 ) };
    var lightAngleControl = new NumberControl( 'Light Angle', propertySet.lightAngleProperty, new Range( 0, Math.PI * 2 ),
      _.extend( {
        decimalPlaces: 2,
        delta: 0.05,
        majorTicks: [
          { value: 0, label: new Text( '0', tickLabelOptions ) },
          { value: Math.PI, label: new Text( '\u03c0', tickLabelOptions ) },
          { value: 2 * Math.PI, label: new Text( '2\u03c0', tickLabelOptions ) }
        ]
      }, numberControlOptions ) );

    // Control at right side of play area
    demoParent.addChild( new VBox( {
      resize: false, // Don't readjust the size when the slider knob moves all the way to the right
      spacing: 15,
      children: [
        colorPanel,
        lightAngleControl
      ],
      right: layoutBounds.right - 50,
      centerY: layoutBounds.centerY
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

  function ComponentsView() {
    DemosView.call( this, 'component', [

      // To add a demo, create an entry here.
      // label is a {string} that will appear in the combo box.
      // getNode is a {function} that takes a {Bounds2} layoutBounds and returns a {Node}.
      { label: 'ArrowNode', getNode: demoArrowNode },
      { label: 'BracketNode', getNode: demoBracketNode },
      { label: 'ConductivityTesterNode', getNode: demoConductivityTesterNode },
      { label: 'EyeDropperNode', getNode: demoEyeDropperNode },
      { label: 'FaucetNode', getNode: demoFaucetNode },
      { label: 'MeasuringTape', getNode: demoMeasuringTape },
      { label: 'NumberPicker', getNode: demoNumberPicker },
      { label: 'ProbeNode', getNode: demoProbeNode },
      { label: 'RulerNode', getNode: demoRulerNode },
      { label: 'StarNode', getNode: demoStarNode },
      { label: 'ThermometerNode', getNode: demoTemperatureNode }
    ] );
  }

  return inherit( DemosView, ComponentsView );
} );