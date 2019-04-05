// Copyright 2014-2019, University of Colorado Boulder

/**
 * Demonstration of misc scenery-phet UI components.
 * Demos are selected from a combo box, and are instantiated on demand.
 * Use the 'component' query parameter to set the initial selection of the combo box.
 *
 * @author Sam Reid
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var ArrowKeyNode = require( 'SCENERY_PHET/keyboard/ArrowKeyNode' );
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var BracketNode = require( 'SCENERY_PHET/BracketNode' );
  var CapsLockKeyNode = require( 'SCENERY_PHET/keyboard/CapsLockKeyNode' );
  var Checkbox = require( 'SUN/Checkbox' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var Color = require( 'SCENERY/util/Color' );
  var ComboBoxDisplay = require( 'SCENERY_PHET/ComboBoxDisplay' );
  var ConductivityTesterNode = require( 'SCENERY_PHET/ConductivityTesterNode' );
  var DemosScreenView = require( 'SUN/demo/DemosScreenView' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var DragListener = require( 'SCENERY/listeners/DragListener' );
  var Drawer = require( 'SCENERY_PHET/Drawer' );
  var Emitter = require( 'AXON/Emitter' );
  var EnterKeyNode = require( 'SCENERY_PHET/keyboard/EnterKeyNode' );
  var Enumeration = require( 'PHET_CORE/Enumeration' );
  var EyeDropperNode = require( 'SCENERY_PHET/EyeDropperNode' );
  var FaucetNode = require( 'SCENERY_PHET/FaucetNode' );
  var FineCoarseSpinner = require( 'SCENERY_PHET/FineCoarseSpinner' );
  var FormulaNode = require( 'SCENERY_PHET/FormulaNode' );
  var GaugeNode = require( 'SCENERY_PHET/GaugeNode' );
  var GeneralKeyboardHelpSection = require( 'SCENERY_PHET/keyboard/help/GeneralKeyboardHelpSection' );
  var HandleNode = require( 'SCENERY_PHET/HandleNode' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var HeaterCoolerNode = require( 'SCENERY_PHET/HeaterCoolerNode' );
  var KeyboardHelpSection = require( 'SCENERY_PHET/keyboard/help/KeyboardHelpSection' );
  var HSlider = require( 'SUN/HSlider' );
  var HStrut = require( 'SCENERY/nodes/HStrut' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Keypad = require( 'SCENERY_PHET/keypad/Keypad' );
  var KitSelectionNode = require( 'SCENERY_PHET/KitSelectionNode' );
  var LaserPointerNode = require( 'SCENERY_PHET/LaserPointerNode' );
  var LetterKeyNode = require( 'SCENERY_PHET/keyboard/LetterKeyNode' );
  var MeasuringTapeNode = require( 'SCENERY_PHET/MeasuringTapeNode' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var MovableDragHandler = require( 'SCENERY_PHET/input/MovableDragHandler' );
  var Node = require( 'SCENERY/nodes/Node' );
  var NodeProperty = require( 'SCENERY/util/NodeProperty' );
  var NumberControl = require( 'SCENERY_PHET/NumberControl' );
  var NumberDisplay = require( 'SCENERY_PHET/NumberDisplay' );
  var NumberKeypad = require( 'SCENERY_PHET/NumberKeypad' );
  var NumberPicker = require( 'SCENERY_PHET/NumberPicker' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var Panel = require( 'SUN/Panel' );
  var PaperAirplaneNode = require( 'SCENERY_PHET/PaperAirplaneNode' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var ProbeNode = require( 'SCENERY_PHET/ProbeNode' );
  var Property = require( 'AXON/Property' );
  var RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
  var Range = require( 'DOT/Range' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var RichText = require( 'SCENERY/nodes/RichText' );
  var RulerNode = require( 'SCENERY_PHET/RulerNode' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var sceneryPhetQueryParameters = require( 'SCENERY_PHET/sceneryPhetQueryParameters' );
  var ScientificNotationNode = require( 'SCENERY_PHET/ScientificNotationNode' );
  var Shape = require( 'KITE/Shape' );
  var ShiftKeyNode = require( 'SCENERY_PHET/keyboard/ShiftKeyNode' );
  var SliderKeyboardHelpSection = require( 'SCENERY_PHET/keyboard/help/SliderKeyboardHelpSection' );
  var StarNode = require( 'SCENERY_PHET/StarNode' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var TabKeyNode = require( 'SCENERY_PHET/keyboard/TabKeyNode' );
  var Tandem = require( 'TANDEM/Tandem' );
  var Text = require( 'SCENERY/nodes/Text' );
  var TextKeyNode = require( 'SCENERY_PHET/keyboard/TextKeyNode' );
  var ThermometerNode = require( 'SCENERY_PHET/ThermometerNode' );
  var TimerNode = require( 'SCENERY_PHET/TimerNode' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var Vector2 = require( 'DOT/Vector2' );
  var Vector2Property = require( 'DOT/Vector2Property' );
  var VSlider = require( 'SUN/VSlider' );
  var WireNode = require( 'SCENERY_PHET/WireNode' );

  // constants
  var emitter = new Emitter( { validationEnabled: false } ); // allow tests to wire up to step function // TODO: move to DemosScreenView

  /**
   * @param {Object} [options]
   * @constructor
   */
  function ComponentsScreenView( options ) {
    DemosScreenView.call( this, [

      /**
       * To add a demo, add an object literal here. Each object has these properties:
       *
       * {string} label - label in the combo box
       * {function(Bounds2): Node} createNode - creates the scene graph for the demo
       */
      { label: 'ArrowNode', createNode: demoArrowNode },
      { label: 'BracketNode', createNode: demoBracketNode },
      { label: 'ComboBoxDisplay', createNode: demoComboBoxDisplay },
      { label: 'ConductivityTesterNode', createNode: demoConductivityTesterNode },
      { label: 'Drawer', createNode: demoDrawer },
      { label: 'EyeDropperNode', createNode: demoEyeDropperNode },
      { label: 'FaucetNode', createNode: demoFaucetNode },
      { label: 'FineCoarseSpinner', createNode: demoFineCoarseSpinner },
      { label: 'FormulaNode', createNode: demoFormulaNode },
      { label: 'GaugeNode', createNode: demoGaugeNode },
      { label: 'HandleNode', createNode: demoHandleNode },
      { label: 'HeaterCoolerNode', createNode: demoHeaterCoolerNode },
      { label: 'KeyNode', createNode: demoKeyNode },
      { label: 'KitSelectionNode', createNode: demoKitSelectionNode },
      { label: 'KeyboardHelpContent', createNode: demoHelpContent },
      { label: 'Keypad', createNode: demoKeypad },
      { label: 'LaserPointerNode', createNode: demoLaserPointerNode },
      { label: 'MeasuringTapeNode', createNode: demoMeasuringTapeNode },
      { label: 'NumberDisplay', createNode: demoNumberDisplay },
      { label: 'NumberKeypad', createNode: demoNumberKeypad },
      { label: 'NumberPicker', createNode: demoNumberPicker },
      { label: 'PaperAirplaneNode', createNode: demoPaperAirplaneNode },
      { label: 'ProbeNode', createNode: demoProbeNode },
      { label: 'RichText', createNode: demoRichText },
      { label: 'RulerNode', createNode: demoRulerNode },
      { label: 'ScientificNotationNode', createNode: demoScientificNotationNode },
      { label: 'StarNode', createNode: demoStarNode },
      { label: 'TimerNode', createNode: demoTimerNode },
      { label: 'ThermometerNode', createNode: demoTemperatureNode },
      { label: 'WireNode', createNode: demoWireNode }
    ], _.extend( {
      comboBoxItemFont: new PhetFont( 12 ),
      comboBoxItemYMargin: 3,
      selectedDemoLabel: sceneryPhetQueryParameters.component,
      tandem: Tandem.required
    }, options ) );
  }

  sceneryPhet.register( 'ComponentsScreenView', ComponentsScreenView );

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

    var checkbox = new Checkbox( new Text( 'Double head', { font: new PhetFont( 20 ) } ), checkedProperty, {
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

  // Creates a demo for ComboBoxDisplay
  var demoComboBoxDisplay = function( layoutBounds ) {

    // range of temperature in Kelvin
    var kelvinRange = new Range( 0, 100 );

    // temperature in Kelvin
    var kelvinProperty = new NumberProperty( 0, {
      range: kelvinRange
    } );

    /**
     * Converts Kelvin to degrees Celsius
     * @param {number} kelvin
     * @returns {number}
     */
    function kelvinToCelsius( kelvin ) { return kelvin - 273.15; }

    // temperature in degrees Celsius
    var celsiusProperty = new DerivedProperty( [ kelvinProperty ], kelvin => kelvinToCelsius( kelvin ) );

    // compute Celsius range, since celsiusProperty is derived
    var celsiusRange = new Range( kelvinToCelsius( kelvinRange.min ), kelvinToCelsius( kelvinRange.max ) );

    // font used by all UI components
    var font = new PhetFont( 20 );

    // temperature units
    var kelvinUnitsString = 'K';
    var celsiusUnitsString = '\u00b0C';

    // slider to control temperature in Kelvin
    var kSlider = new VSlider( kelvinProperty, kelvinRange );

    // ticks on at ends of the slider
    var tickPattern = '{{value}} {{units}}';
    var maxTickString = StringUtils.fillIn( tickPattern, {
      value: kelvinRange.max,
      units: kelvinUnitsString
    } );
    var minTickString = StringUtils.fillIn( tickPattern, {
      value: kelvinRange.min,
      units: kelvinUnitsString
    } );
    kSlider.addMajorTick( kelvinRange.max, new Text( maxTickString, { font: font } ) );
    kSlider.addMajorTick( kelvinRange.min, new Text( minTickString, { font: font } ) );

    // determines which units are shown by the ComboBoxDisplay
    var Units = new Enumeration( [ 'KELVIN', 'CELSIUS' ] );
    var unitsProperty = new Property( Units.KELVIN, {
      validValues: Units.VALUES
    } );

    // items in the ComboBoxDisplay
    var items = [
      { choice: Units.KELVIN, numberProperty: kelvinProperty, units: kelvinUnitsString },
      { choice: Units.CELSIUS, numberProperty: celsiusProperty, range: celsiusRange, units: celsiusUnitsString }
    ];

    // parent for the ComboBoxDisplay's popup list
    var listParent = new Node();

    var display = new ComboBoxDisplay( items, unitsProperty, listParent, {
      xMargin: 10,
      yMargin: 8,
      numberDisplayOptions: { font: font }
    } );

    // VSlider to left of ComboBoxDisplay
    var hBox = new HBox( {
      spacing: 25,
      children: [ kSlider, display ],
      center: layoutBounds.center
    } );

    return new Node( {
      children: [ hBox, listParent ]
    } );
  };

  // Creates a demo for ConductivityTesterNode
  var demoConductivityTesterNode = function( layoutBounds ) {

    var brightnessProperty = new Property( 0 ); // 0-1
    var testerLocationProperty = new Vector2Property( new Vector2( 0, 0 ) );
    var positiveProbeLocationProperty = new Vector2Property( new Vector2( testerLocationProperty.get().x + 140, testerLocationProperty.get().y + 100 ) );
    var negativeProbeLocationProperty = new Vector2Property( new Vector2( testerLocationProperty.get().x - 40, testerLocationProperty.get().y + 100 ) );

    var conductivityTesterNode = new ConductivityTesterNode( brightnessProperty,
      testerLocationProperty, positiveProbeLocationProperty, negativeProbeLocationProperty, {
        modelViewTransform: ModelViewTransform2.createOffsetScaleMapping( layoutBounds.center, 1 ), // move model origin to screen's center
        positiveProbeFill: 'orange',
        cursor: 'pointer'
      }
    );
    conductivityTesterNode.addInputListener( new MovableDragHandler( testerLocationProperty ) );

    // brightness slider
    var brightnessSlider = new HSlider( brightnessProperty, new Range( 0, 1 ), {
      trackSize: new Dimension2( 200, 5 ),
      thumbSize: new Dimension2( 25, 45 ),
      thumbFill: 'orange',
      thumbFillHighlighted: 'rgb( 255, 210, 0 )',
      thumbCenterLineStroke: 'black',
      centerX: conductivityTesterNode.centerX,
      bottom: conductivityTesterNode.bottom + 100
    } );

    // short-circuit checkbox
    var shortCircuitProperty = new Property( false );
    shortCircuitProperty.link( function( shortCircuit ) {
      conductivityTesterNode.shortCircuit = shortCircuit;
    } );
    var shortCircuitCheckbox = new Checkbox( new Text( 'short circuit', { font: new PhetFont( 20 ) } ), shortCircuitProperty, {
      centerX: brightnessSlider.centerX,
      bottom: brightnessSlider.bottom + 50
    } );

    return new Node( {
      children: [ conductivityTesterNode, brightnessSlider, shortCircuitCheckbox ],
      center: layoutBounds.center
    } );
  };

  // Creates a demo for Drawer
  var demoDrawer = function( layoutBounds ) {

    var rectangle = new Rectangle( 0, 0, 400, 50, {
      fill: 'gray',
      stroke: 'black',
      cornerRadius: 10
    } );

    var textNode = new Text( 'Hello Drawer!', {
      font: new PhetFont( 40 ),
      fill: 'red'
    } );

    var drawer = new Drawer( textNode, {
      handleLocation: 'bottom',
      open: false,
      xMargin: 30,
      yMargin: 20,
      centerX: rectangle.centerX,
      top: rectangle.bottom - 1
    } );

    return new Node( {
      children: [ drawer, rectangle ],
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

    var faucetEnabledCheckbox = new Checkbox( new Text( 'faucet enabled', { font: new PhetFont( 20 ) } ), faucetEnabledProperty, {
      left: faucetNode.left,
      bottom: faucetNode.top - 20
    } );

    return new Node( {
      children: [ faucetNode, faucetEnabledCheckbox ],
      center: layoutBounds.center
    } );
  };

  // Creates a demo for FineCoarseSpinner
  const demoFineCoarseSpinner = function( layoutBounds, options ) {

    const numberProperty = new NumberProperty( 0, {
      range: new Range( 0, 100 ),
      tandem: options.tandem.createTandem( 'numberProperty' )
    } );

    const enabledProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'enabledProperty' )
    } );

    const spinner = new FineCoarseSpinner( numberProperty, {
      enabledProperty: enabledProperty,
      tandem: options.tandem.createTandem( 'spinner' )
    } );

    const checkbox = new Checkbox( new Text( 'enabled', {
      font: new PhetFont( 20 ),
      tandem: options.tandem.createTandem( 'checkbox' )
    } ), enabledProperty );

    return new VBox( {
      spacing: 60,
      children: [ spinner, checkbox ],
      center: layoutBounds.center
    } );
  };

  // Creates a demo for FormulaNode
  var demoFormulaNode = function( layoutBounds ) {
    var conditional = '\\forall \\mathbf{p}\\in\\mathbb{R}^2';
    var leftVert = '\\left\\lVert';
    var rightVert = '\\right\\rVert';
    var matrix = '\\begin{bmatrix} \\cos\\theta & \\sin\\theta \\\\ -\\sin\\theta & \\cos\\theta \\end{bmatrix}^{k+1}';
    var sumExpr = leftVert + '\\sum_{k=1}^{\\infty}kx^{k-1}' + matrix + rightVert;
    var integral = '\\int_{0}^{2\\pi}\\overline{f(\\theta)}\\cos\\theta\\,\\mathrm{d}\\theta';
    var invCos = '\\cos^{-1}\\left( \\frac{\\sqrt{\\varphi_2}}{\\sqrt{x_2^2+x_3^2}} \\right)';

    var formulaNode = new FormulaNode( conditional + '\\quad ' + sumExpr + ' = ' + invCos + ' + ' + integral, {
      center: layoutBounds.center,
      scale: 1.3,
      displayMode: true
    } );
    var bounds = Rectangle.bounds( formulaNode.bounds, {
      fill: 'rgba(0,0,0,0.1)'
    } );
    return new Node( {
      children: [ bounds, formulaNode ]
    } );
  };

  // Creates a demo for GaugeNode
  var demoGaugeNode = function( layoutBounds ) {
    var valueProperty = new Property( 0 );
    var gaugeValueRange = new Range( -100, 100 );
    var sliderValueRange = new Range( gaugeValueRange.min - 20, gaugeValueRange.max + 20 );

    var gaugeNode = new GaugeNode( valueProperty, 'GaugeNode', gaugeValueRange );

    return new VBox( {
      spacing: 15,
      children: [
        gaugeNode,
        NumberControl.withMinMaxTicks( 'Value:', valueProperty, sliderValueRange )
      ],
      center: layoutBounds.center
    } );
  };

  // Creates a demo for HandleNode
  var demoHandleNode = function( layoutBounds ) {
    var handleNode = new HandleNode( { scale: 4.0 } );

    return new Node( {
      children: [ handleNode ],
      center: layoutBounds.center
    } );
  };

  // Creates a demo for HeaterCoolerNode
  var demoHeaterCoolerNode = function( layoutBounds ) {
    return new HeaterCoolerNode( new NumberProperty( 0, {
      range: new Range( -1, 1 ) // +1 for max heating, -1 for max cooling
    } ), { center: layoutBounds.center } );
  };

  // Creates a demo for KitSelectionNode
  var demoKitSelectionNode = function( layoutBounds ) {
    var selectedKitProperty = new Property( 0 );
    var kits = [
      { title: new Text( 'kit 0', { font: new PhetFont( 24 ) } ), content: new HStrut( 200 ) },
      { title: new Text( 'kit 1', { font: new PhetFont( 24 ) } ), content: new HStrut( 200 ) }
    ];
    return new KitSelectionNode( selectedKitProperty, kits, { center: layoutBounds.center } );
  };

  // Creates a demo for ProbeNode
  var demoProbeNode = function( layoutBounds ) {

    var demoParent = new Node();

    // Layer for the light sensor node.  The node will be destroyed and re-created when its parameters change
    var probeNodeLayer = new Node();
    demoParent.addChild( probeNodeLayer );

    // Properties that describe the probe's options
    var colorProperty = new Property( ProbeNode.DEFAULT_OPTIONS.color );
    var radiusProperty = new Property( ProbeNode.DEFAULT_OPTIONS.radius );
    var innerRadiusProperty = new Property( ProbeNode.DEFAULT_OPTIONS.innerRadius );
    var handleWidthProperty = new Property( ProbeNode.DEFAULT_OPTIONS.handleWidth );
    var handleHeightProperty = new Property( ProbeNode.DEFAULT_OPTIONS.handleHeight );
    var handleCornerRadiusProperty = new Property( ProbeNode.DEFAULT_OPTIONS.handleCornerRadius );
    var lightAngleProperty = new Property( ProbeNode.DEFAULT_OPTIONS.lightAngle );
    var sensorTypeFunctionProperty = new Property( ProbeNode.DEFAULT_OPTIONS.sensorTypeFunction );

    // RGB color components, for setting the sensor color
    var color = Color.toColor( colorProperty.value );
    var redProperty = new Property( color.red );
    var greenProperty = new Property( color.green );
    var blueProperty = new Property( color.blue );
    Property.multilink( [ redProperty, greenProperty, blueProperty ], function( r, g, b ) {
      colorProperty.value = new Color( r, g, b );
    } );

    // Controls for the sensor type (glass/crosshairs/empty/etc)
    var radioButtons = new RadioButtonGroup( sensorTypeFunctionProperty, [
      { value: null, node: new Text( 'null' ) },
      { value: sensorTypeFunctionProperty.value, node: new Text( 'default glass' ) },
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
        colorProperty,
        radiusProperty,
        innerRadiusProperty,
        handleWidthProperty,
        handleHeightProperty,
        handleCornerRadiusProperty,
        lightAngleProperty,
        sensorTypeFunctionProperty
      ],
      function() {
        probeNodeLayer.removeAllChildren();
        probeNodeLayer.addChild( new ProbeNode( {

          // ProbeNode options
          color: colorProperty.value,
          radius: radiusProperty.value,
          innerRadius: innerRadiusProperty.value,
          handleWidth: handleWidthProperty.value,
          handleHeight: handleHeightProperty.value,
          handleCornerRadius: handleCornerRadiusProperty.value,
          lightAngle: lightAngleProperty.value,
          sensorTypeFunction: sensorTypeFunctionProperty.value,

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
      titleNodeOptions: {
        font: new PhetFont( 14 )
      },
      numberDisplayOptions: {
        font: new PhetFont( 14 )
      },
      sliderOptions: {
        trackSize: new Dimension2( 150, 3 )
      }
    };
    demoParent.addChild( new VBox( {
      resize: false, // Don't readjust the size when the slider knob moves all the way to the right
      spacing: 15,
      children: [
        NumberControl.withMinMaxTicks( 'Radius:', radiusProperty,
          new Range( 1, ProbeNode.DEFAULT_OPTIONS.radius * 2 ), numberControlOptions ),
        NumberControl.withMinMaxTicks( 'Inner Radius:', innerRadiusProperty,
          new Range( 1, ProbeNode.DEFAULT_OPTIONS.innerRadius * 2 ), numberControlOptions ),
        NumberControl.withMinMaxTicks( 'Handle Width:', handleWidthProperty,
          new Range( 1, ProbeNode.DEFAULT_OPTIONS.handleWidth * 2 ), numberControlOptions ),
        NumberControl.withMinMaxTicks( 'Handle Height:', handleHeightProperty,
          new Range( 1, ProbeNode.DEFAULT_OPTIONS.handleHeight * 2 ), numberControlOptions ),
        NumberControl.withMinMaxTicks( 'Handle Corner Radius:', handleCornerRadiusProperty,
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

    // Light angle control, sets the multiplier for Math.PI
    var tickLabelOptions = { font: new PhetFont( 14 ) };
    var multiplierProperty = new Property( 0 );
    multiplierProperty.link( function( multiplier ) {
      lightAngleProperty.value = ( multiplier * Math.PI );
    } );

    // construct nested options object from base numberControlsOptions
    var lightAngleNumberControlOptions = _.extend( {
      delta: 0.05
    }, numberControlOptions );

    lightAngleNumberControlOptions.numberDisplayOptions = _.extend( {
      valuePattern: '{0} \u03c0',
      decimalPlaces: 2
    }, numberControlOptions.numberDisplayOptions );

    lightAngleNumberControlOptions.sliderOptions = _.extend( {
      majorTicks: [
        { value: 0, label: new Text( '0', tickLabelOptions ) },
        { value: 1, label: new Text( '\u03c0', tickLabelOptions ) },
        { value: 2, label: new Text( '2\u03c0', tickLabelOptions ) }
      ]
    }, numberControlOptions.sliderOptions );

    var lightAngleControl = new NumberControl( 'Light Angle:', multiplierProperty, new Range( 0, 2 ), lightAngleNumberControlOptions );

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

  // Creates a demo for RichText
  var demoRichText = function( layoutBounds ) {
    return new VBox( {
      spacing: 15,
      children: [
        new RichText( 'RichText can have <b>bold</b> and <i>italic</i> text.' ),
        new RichText( 'Can do H<sub>2</sub>O (A<sub>sub</sub> and A<sup>sup</sup>), or nesting: x<sup>2<sup>2</sup></sup>' ),
        new RichText( 'Additionally: <span style="color: blue;">color</span>, <span style="font-size: 30px;">sizes</span>, <span style="font-family: serif;">faces</span>, <s>strikethrough</s>, and <u>underline</u>' ),
        new RichText( 'These <b><em>can</em> <u><span style="color: red;">be</span> mixed<sup>1</sup></u></b>.' ),
        new RichText( '\u202aHandles bidirectional text: \u202b<span style="color: #0a0;">مقابض</span> النص ثنائي <b>الاتجاه</b><sub>2</sub>\u202c\u202c' ),
        new RichText( '\u202b\u062a\u0633\u062a (\u0632\u0628\u0627\u0646)\u202c' ),
        new RichText( 'HTML entities need to be escaped, like &amp; and &lt;.' ),
        new RichText( 'Supports <a href="{{phetWebsite}}"><em>links</em> with <b>markup</b></a>, and <a href="{{callback}}">links that call functions</a>.', {
          links: {
            phetWebsite: 'https://phet.colorado.edu',
            callback: function() {
              console.log( 'Link was clicked' );
            }
          }
        } ),
        new RichText( 'Or also <a href="https://phet.colorado.edu">links directly in the string</a>.', {
          links: true
        } ),
        new RichText( 'Links not found <a href="{{bogus}}">are ignored</a> for security.' ),
        new HBox( {
          spacing: 30,
          children: [
            new RichText( 'Multi-line text with the<br>separator &lt;br&gt; and <a href="https://phet.colorado.edu">handles<br>links</a> and other <b>tags<br>across lines</b>', {
              links: true
            } ),
            new RichText( 'Supposedly RichText supports line wrapping. Here is a lineWrap of 300, which should probably wrap multiple times here', { lineWrap: 300 } )
          ]
        } )
      ],
      center: layoutBounds.center
    } );
  };

  // Creates a demo for LaserPointerNode
  var demoLaserPointerNode = function( layoutBounds ) {

    var leftOnProperty = new Property( false );
    var rightOnProperty = new Property( false );
    var enabledProperty = new Property( true );

    // Demonstrate how to adjust lighting
    var leftLaserNode = new LaserPointerNode( leftOnProperty, {

      enabledProperty: enabledProperty,

      // these options adjust the lighting
      topColor: LaserPointerNode.DEFAULT_OPTIONS.bottomColor,
      bottomColor: LaserPointerNode.DEFAULT_OPTIONS.topColor,
      highlightColorStop: 1 - LaserPointerNode.DEFAULT_OPTIONS.highlightColorStop,
      buttonRotation: Math.PI,

      rotation: Math.PI,
      right: layoutBounds.centerX - 20,
      centerY: layoutBounds.centerY
    } );

    var rightLaserNode = new LaserPointerNode( rightOnProperty, {
      enabledProperty: enabledProperty,
      left: layoutBounds.centerX + 20,
      centerY: layoutBounds.centerY,
      hasGlass: true
    } );

    var leftBeamNode = new Rectangle( 0, 0, 1000, 40, {
      fill: 'yellow',
      right: leftLaserNode.left + 1,
      centerY: leftLaserNode.centerY
    } );

    var rightBeamNode = new Rectangle( 0, 0, 1000, 40, {
      fill: 'yellow',
      left: rightLaserNode.right - 1,
      centerY: rightLaserNode.centerY
    } );

    leftOnProperty.link( function( on ) {
      leftBeamNode.visible = on;
    } );
    rightOnProperty.link( function( on ) {
      rightBeamNode.visible = on;
    } );

    // enabled checkbox
    var enabledCheckbox = new Checkbox( new Text( 'enabled', { font: new PhetFont( 20 ) } ), enabledProperty, {
      centerX: layoutBounds.centerX,
      top: leftLaserNode.bottom + 40
    } );

    return new Node( { children: [ leftBeamNode, leftLaserNode, rightBeamNode, rightLaserNode, enabledCheckbox ] } );
  };

  // Creates a demo for MeasuringTapeNode
  var demoMeasuringTapeNode = function( layoutBounds ) {

    var measuringTapeUnitsProperty = new Property( { name: 'meters', multiplier: 1 } );

    return new MeasuringTapeNode( measuringTapeUnitsProperty, new Property( true ), {
      textColor: 'black',
      textBackgroundColor: 'rgba( 255, 0, 0, 0.1 )', // translucent red
      textBackgroundXMargin: 10,
      textBackgroundYMargin: 3,
      textBackgroundCornerRadius: 5,
      dragBounds: layoutBounds,
      basePositionProperty: new Vector2Property( new Vector2( layoutBounds.centerX, layoutBounds.centerY ) ),
      tipPositionProperty: new Vector2Property( new Vector2( layoutBounds.centerX + 100, layoutBounds.centerY ) )
    } );
  };

  // Creates a demo for MeterBodyNode - two circles connected by a wire.
  var demoWireNode = function( layoutBounds ) {

    var greenCircle = new Circle( 20, {
      fill: 'green',
      cursor: 'pointer'
    } );
    greenCircle.addInputListener( new DragListener( { translateNode: true } ) );

    var redCircle = new Circle( 20, {
      fill: 'red',
      cursor: 'pointer',
      center: greenCircle.center.plusXY( 200, 200 )
    } );
    redCircle.addInputListener( new DragListener( { translateNode: true } ) );

    // Distance the wires stick out from the objects
    var NORMAL_DISTANCE = 100;

    // Add the wire behind the probe.
    var wireNode = new WireNode(
      // Connect to the greenCircle at the center bottom
      new NodeProperty( greenCircle, 'bounds', 'centerBottom' ),
      new Vector2Property( new Vector2( 0, NORMAL_DISTANCE ) ),

      // Connect to node2 at the left center
      new NodeProperty( redCircle, 'bounds', 'leftCenter' ),
      new Vector2Property( new Vector2( -NORMAL_DISTANCE, 0 ) ), {
        lineWidth: 3
      }
    );

    return new Node( {
      children: [ greenCircle, redCircle, wireNode ], // wireNode on top, so we can see it fully
      center: layoutBounds.center
    } );
  };

  // Creates a demo for NumberDisplay
  const demoNumberDisplay = function( layoutBounds ) {

    const range = new Range( 0, 1000 );

    // Options for both NumberDisplay instances
    const numberDisplayOptions = {
      valuePattern: '{{value}} K',
      align: 'right'
    };

    // To demonstrate 'no value' options
    const noValueDisplay = new NumberDisplay( new Property( null ), range, _.extend( {}, numberDisplayOptions, {
      noValueAlign: 'center',
      noValuePattern: '{{value}}'
    } ) );

    // To demonstrate numeric value display
    const property = new NumberProperty( 1 );
    const numberDisplay = new NumberDisplay( property, range, numberDisplayOptions );
    const slider = new HSlider( property, range );

    return new VBox( {
      spacing: 40,
      children: [ noValueDisplay, numberDisplay, slider ],
      center: layoutBounds.center
    } );
  };

  // Creates a demo for NumberKeypad
  var demoNumberKeypad = function( layoutBounds ) {

    var integerKeypad = new NumberKeypad( {
      validateKey: NumberKeypad.validateMaxDigits( { maxDigits: 4 } )
    } );

    // value of integerKeypad is displayed here
    var integerText = new Text( '', { font: new PhetFont( 24 ) } );
    integerKeypad.valueStringProperty.link( function( valueString ) {
      integerText.text = valueString;
    } );

    // For testing NumberKeypad's clearOnNextKeyPress feature
    var clearOnNextKeyPressProperty = new Property( false );
    var clearOnNextKeyPressCheckbox = new Checkbox( new Text( 'clearOnNextKeyPress', { font: new PhetFont( 16 ) } ), clearOnNextKeyPressProperty );

    clearOnNextKeyPressProperty.link( function( clearOnNextKeyPress ) {
      integerKeypad.clearOnNextKeyPress = clearOnNextKeyPress;
    } );
    integerKeypad.valueStringProperty.link( function() {
      clearOnNextKeyPressProperty.value = integerKeypad.clearOnNextKeyPress;
    } );

    var decimalKeypad = new NumberKeypad( {
      decimalPointKey: true
    } );

    // value of decimalKeypad is displayed here
    var decimalText = new Text( '', { font: new PhetFont( 24 ) } );
    decimalKeypad.valueStringProperty.link( function( valueString ) {
      decimalText.text = valueString;
    } );

    return new HBox( {
      spacing: 100,
      align: 'top',
      children: [

        // integer keypad and display
        new VBox( {
          spacing: 40,
          children: [ integerText, integerKeypad, clearOnNextKeyPressCheckbox ]
        } ),

        // decimal keypad and display
        new VBox( {
          spacing: 40,
          children: [ decimalText, decimalKeypad ]
        } )
      ],
      center: layoutBounds.center
    } );
  };

  // creates a demo for KeyNode and its subtypes
  var demoKeyNode = function( layoutBounds ) {

    // example letter keys, portion of a typical keyboard
    var topRowKeyStrings = [ 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\' ];
    var middleRowKeyStrings = [ 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', '\:', '\"' ];
    var bottomRowKeyStrings = [ 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '\'', '.', '\/' ];

    // arrays that hold key nodes for each row of a keyboard - each row starts with an additional multi-character key
    var topKeyNodes = [ new TabKeyNode() ];
    var middleKeyNodes = [ new CapsLockKeyNode() ];
    var bottomKeyNodes = [ new ShiftKeyNode() ];
    var topArrowKeyNode;
    var bottomArrowKeyNodes;

    var i;
    for ( i = 0; i < topRowKeyStrings.length; i++ ) {
      topKeyNodes.push( new LetterKeyNode( topRowKeyStrings[ i ], { forceSquareKey: true } ) );
    }
    for ( i = 0; i < middleRowKeyStrings.length; i++ ) {
      middleKeyNodes.push( new LetterKeyNode( middleRowKeyStrings[ i ], { forceSquareKey: true } ) );
    }
    for ( i = 0; i < bottomRowKeyStrings.length; i++ ) {
      bottomKeyNodes.push( new LetterKeyNode( bottomRowKeyStrings[ i ], { forceSquareKey: true } ) );
    }
    topArrowKeyNode = new ArrowKeyNode( 'up' );
    bottomArrowKeyNodes = [ new ArrowKeyNode( 'left' ), new ArrowKeyNode( 'down' ), new ArrowKeyNode( 'right' ) ];
    var bottomArrowKeyBox = new HBox( { children: bottomArrowKeyNodes, spacing: 2 } );

    // add the enter and shift keys to the middle and bottom rows, shift key has extra width for alignment
    middleKeyNodes.push( new EnterKeyNode() );
    bottomKeyNodes.push( new ShiftKeyNode( { xAlign: 'right', xMargin: 4, minKeyWidth: 70 } ) );

    var topHBox = new HBox( { children: topKeyNodes, spacing: 5 } );
    var midddleHBox = new HBox( { children: middleKeyNodes, spacing: 5 } );
    var bottomHBox = new HBox( { children: bottomKeyNodes, spacing: 5 } );
    var arrowKeysVBox = new VBox( {
      children: [ topArrowKeyNode, bottomArrowKeyBox ],
      spacing: 1
    } );

    return new VBox( {
      children: [ topHBox, midddleHBox, bottomHBox, arrowKeysVBox ],
      center: layoutBounds.center,
      align: 'right',
      spacing: 3,
      scale: 2
    } );
  };


  // creates a demo for KeyNode
  var demoHelpContent = function( layoutBounds ) {

    var labelWithIcon = KeyboardHelpSection.labelWithIcon( 'Label With Icon:', new TextKeyNode( 'Hi' ), 'Label With Icon Hi' );
    var labelWithIconList = KeyboardHelpSection.labelWithIconList( 'Label With Icon List:', [
      new TextKeyNode( 'Hi' ),
      new TextKeyNode( 'Hello' ),
      new TextKeyNode( 'Ahoy\' Manatee' )
    ], 'Label with icon list of hi, hello, Ahoy Manatee.' );

    var labelWithArrowKeysRowIcon = KeyboardHelpSection.labelWithIcon( 'Label with arrows:', KeyboardHelpSection.arrowKeysRowIcon(), 'Label with arrows, up, left, down, right' );
    var labelWithUpDownArrowKeysRowIcon = KeyboardHelpSection.labelWithIcon( 'Label with up down arrows:', KeyboardHelpSection.upDownArrowKeysRowIcon(), 'Label with up down arrows' );
    var labelWithLeftRightArrowKeysRowIcon = KeyboardHelpSection.labelWithIcon( 'Label with left right arrows:', KeyboardHelpSection.leftRightArrowKeysRowIcon(), 'Label with left right arrows' );

    // Display all of the Help Contents. A custom one for the above components, and KeyboardHelpSection subtypes as well, each
    // in their own panel
    return new HBox( {

      children: [

        // Custom Help Content Panel
        new Panel( new KeyboardHelpSection( 'Custom Help Content',
          [
            labelWithIcon,
            labelWithIconList,
            labelWithArrowKeysRowIcon,
            labelWithUpDownArrowKeysRowIcon,
            labelWithLeftRightArrowKeysRowIcon
          ]
        ) ),

        // Individual help content subtypes
        new Panel( new SliderKeyboardHelpSection() ),
        new VBox( {
          children: [
            new Panel( new GeneralKeyboardHelpSection() ),
            new Panel( new GeneralKeyboardHelpSection( { withGroupContent: true } ) )
          ],
          spacing: 10
        } )
      ],
      left: 200,
      top: 100,
      spacing: 10
    } );
  };

  // creates a demo for Keypad
  var demoKeypad = function( layoutBounds ) {

    var integerKeyPad = new Keypad( Keypad.PositiveAndNegativeIntegerLayout, {
      buttonWidth: 35,
      buttonHeight: 35,
      maxDigits: 5
    } );

    var integerStringRepresentation = new Text( '', { font: new PhetFont( 24 ) } );
    var integerValueRepresentation = new Text( '', { font: new PhetFont( 24 ) } );

    integerKeyPad.stringProperty.link( function( value ) {
      integerStringRepresentation.text = 'string: ' + value;
    } );

    integerKeyPad.valueProperty.link( function( value ) {
      integerValueRepresentation.text = 'number: ' + value;
    } );

    var integerClearButton = new RectangularPushButton( {
      content: new Text( 'Clear Keypad' ),
      listener: function() {
        integerKeyPad.clear();
      }
    } );

    // For testing clearOnNextKeyPress feature
    var integerClearOnNextKeyPressProperty = new Property( integerKeyPad.getClearOnNextKeyPress() );
    var integerClearOnNextKeyPressCheckbox = new Checkbox(
      new Text( 'Clear On Next Key Press' ),
      integerClearOnNextKeyPressProperty
    );
    integerClearOnNextKeyPressProperty.link( function( clearOnNextKeyPress ) {
      integerKeyPad.setClearOnNextKeyPress( clearOnNextKeyPress );
    } );

    integerKeyPad.valueProperty.link( function( value ) {
      integerClearOnNextKeyPressProperty.value = integerKeyPad.getClearOnNextKeyPress();
    } );

    var integerVBox = new VBox( {
      spacing: 30,
      resize: false,
      align: 'left',
      children: [
        integerValueRepresentation,
        integerStringRepresentation,
        integerKeyPad,
        integerClearButton,
        integerClearOnNextKeyPressCheckbox
      ]
    } );

    var floatingPointKeyPad = new Keypad( Keypad.PositiveFloatingPointLayout, {
      buttonWidth: 35,
      buttonHeight: 35,
      maxDigits: 4,
      maxDigitsRightOfMantissa: 2
    } );

    var floatingPointStringRepresentation = new Text( '', { font: new PhetFont( 24 ) } );
    var floatingPointValueRepresentation = new Text( '', { font: new PhetFont( 24 ) } );

    floatingPointKeyPad.stringProperty.link( function( value ) {
      floatingPointStringRepresentation.text = 'string: ' + value;
    } );

    floatingPointKeyPad.valueProperty.link( function( value ) {
      floatingPointValueRepresentation.text = 'number: ' + value;
    } );

    var floatingPointClearButton = new RectangularPushButton( {
      content: new Text( 'Clear Keypad' ),
      listener: function() {
        floatingPointKeyPad.clear();
      }
    } );

    // For testing clearOnNextKeyPress feature
    var floatingPointClearOnNextKeyPressProperty = new Property( floatingPointKeyPad.getClearOnNextKeyPress() );
    var floatingPointClearOnNextKeyPressButton = new Checkbox(
      new Text( 'Clear On Next Key Press' ),
      floatingPointClearOnNextKeyPressProperty
    );
    floatingPointClearOnNextKeyPressProperty.link( function( clearOnNextKeyPress ) {
      floatingPointKeyPad.setClearOnNextKeyPress( clearOnNextKeyPress );
    } );

    floatingPointKeyPad.valueProperty.link( function() {
      floatingPointClearOnNextKeyPressProperty.value = floatingPointKeyPad.getClearOnNextKeyPress();
    } );

    var floatingPointVBox = new VBox( {
      spacing: 30,
      resize: false,
      align: 'left',
      children: [
        floatingPointValueRepresentation,
        floatingPointStringRepresentation,
        floatingPointKeyPad,
        floatingPointClearButton,
        floatingPointClearOnNextKeyPressButton
      ]
    } );

    var positiveAndNegativeFloatingPointKeyPad = new Keypad( Keypad.PositiveAndNegativeFloatingPointLayout, {
      buttonWidth: 35,
      buttonHeight: 35,
      maxDigits: 4,
      maxDigitsRightOfMantissa: 2
    } );

    var positiveAndNegativeFloatingPointStringRepresentation = new Text( '', { font: new PhetFont( 24 ) } );
    var positiveAndNegativeFloatingPointValueRepresentation = new Text( '', { font: new PhetFont( 24 ) } );

    positiveAndNegativeFloatingPointKeyPad.stringProperty.link( function( value ) {
      positiveAndNegativeFloatingPointStringRepresentation.text = 'string: ' + value;
    } );

    positiveAndNegativeFloatingPointKeyPad.valueProperty.link( function( value ) {
      positiveAndNegativeFloatingPointValueRepresentation.text = 'number: ' + value;
    } );

    var positiveAndNegativeFloatingPointClearButton = new RectangularPushButton( {
      content: new Text( 'Clear Keypad' ),
      listener: function() {
        positiveAndNegativeFloatingPointKeyPad.clear();
      }
    } );

    // For testing clearOnNextKeyPress feature
    var positiveAndNegativeFloatingPointClearOnNextKeyPressProperty = new Property(
      positiveAndNegativeFloatingPointKeyPad.getClearOnNextKeyPress()
    );
    var positiveAndNegativeFloatingPointClearOnNextKeyPressCheckbox = new Checkbox(
      new Text( 'Clear On Next Key Press' ),
      positiveAndNegativeFloatingPointClearOnNextKeyPressProperty
    );

    function handlePositiveAndNegativeFloatingPointClearOnNextKeyPressChanged( clearOnNextKeyPress ) {
      positiveAndNegativeFloatingPointKeyPad.setClearOnNextKeyPress( clearOnNextKeyPress );
    }

    positiveAndNegativeFloatingPointClearOnNextKeyPressProperty.link(
      handlePositiveAndNegativeFloatingPointClearOnNextKeyPressChanged
    );

    positiveAndNegativeFloatingPointKeyPad.valueProperty.link( function( value ) {
      positiveAndNegativeFloatingPointClearOnNextKeyPressProperty.value =
        positiveAndNegativeFloatingPointKeyPad.getClearOnNextKeyPress();
    } );

    // create and add a button that will remove the keypad from the screen - this exists to test dispose
    var removeKeypadFromScreenButton = new RectangularPushButton( {
      content: new Text( 'Remove Keypad (tests dispose)' ),
      baseColor: '#73DC69',
      listener: function() {
        positiveAndNegativeFloatingPointKeyPad.clear();
        positiveAndNegativeFloatingPointVBox.removeChild( positiveAndNegativeFloatingPointKeyPad );
        positiveAndNegativeFloatingPointKeyPad.dispose();
        positiveAndNegativeFloatingPointKeyPad = null;
        positiveAndNegativeFloatingPointVBox.removeChild( positiveAndNegativeFloatingPointClearButton );
        positiveAndNegativeFloatingPointClearButton.dispose();
        positiveAndNegativeFloatingPointVBox.removeChild( positiveAndNegativeFloatingPointClearOnNextKeyPressCheckbox );
        positiveAndNegativeFloatingPointClearOnNextKeyPressCheckbox.dispose();
        positiveAndNegativeFloatingPointVBox.removeChild( removeKeypadFromScreenButton );
        removeKeypadFromScreenButton.dispose();
      }
    } );

    var positiveAndNegativeFloatingPointVBox = new VBox( {
      spacing: 30,
      resize: false,
      align: 'left',
      children: [
        positiveAndNegativeFloatingPointValueRepresentation,
        positiveAndNegativeFloatingPointStringRepresentation,
        positiveAndNegativeFloatingPointKeyPad,
        positiveAndNegativeFloatingPointClearButton,
        positiveAndNegativeFloatingPointClearOnNextKeyPressCheckbox,
        removeKeypadFromScreenButton
      ]
    } );

    return new HBox( {
      spacing: 50,
      resize: false,
      children: [
        integerVBox,
        floatingPointVBox,
        positiveAndNegativeFloatingPointVBox
      ],
      center: layoutBounds.center
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

    var starSlider = new HSlider( starValueProperty, new Range( 0, 1 ), {
      thumbSize: new Dimension2( 25, 50 ),
      thumbFillHighlighted: 'yellow',
      thumbFill: 'rgb(220,220,0)',
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

  // Creates a sample ScientificNotationNode
  var demoScientificNotationNode = function( layoutBounds ) {
    var numberProperty = new Property( 1 );

    var numberSlider = new HSlider( numberProperty, new Range( 0, 100 ) );

    var scientificNotationNode = new ScientificNotationNode( numberProperty );

    return new VBox( {
      spacing: 20,
      center: layoutBounds.center,
      children: [ numberSlider, scientificNotationNode ]
    } );
  };

  // Creates a sample TimerNode
  var demoTimerNode = function( layoutBounds, options ) {

    // Create a TimerNode that doesn't show units (assumed to be seconds)
    var isRunningProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'isRunningProperty' )
    } );
    var timeProperty = new NumberProperty( 12.34, {
      tandem: options.tandem.createTandem( 'timeProperty' ),
      phetioHighFrequency: true
    } );
    var timerNode = new TimerNode( timeProperty, isRunningProperty, {
      tandem: options.tandem.createTandem( 'noUnitsTimerNode' )
    } );
    var timerNodeListener = function( dt ) {
      if ( isRunningProperty.value ) {
        timeProperty.value += dt;
      }
    };
    emitter.addListener( timerNodeListener );

    // Create a TimerNode that can show from a selection of units.
    var unitsProperty = new Property( 'ps' );

    // Initialize with longest possible string
    var unitsNode = new Text( 'ms', { font: new PhetFont( 15 ) } );
    var mutableUnitsTimerNode = new TimerNode( new Property( 12.34 ), new Property( true ), {
      unitsNode: unitsNode,
      scale: 2,
      tandem: options.tandem.createTandem( 'mutableUnitsTimerNode' )
    } );
    unitsProperty.link( function( units ) {
      unitsNode.text = units;
    } );
    var unitsRadioButtonGroup = new RadioButtonGroup( unitsProperty, [
      { value: 'ps', node: new Text( 'picoseconds' ), tandemName: 'picoseconds' },
      { value: 'ms', node: new Text( 'milliseconds' ), tandemName: 'milliseconds' },
      { value: 'fs', node: new Text( 'femtoseconds' ), tandemName: 'femtoseconds' }
    ], {
      spacing: 5,
      tandem: options.tandem.createTandem( 'unitsRadioButtonGroup' )
    } );

    // Layout
    var vBox = new VBox( {
      align: 'left',
      spacing: 20,
      center: layoutBounds.center,
      children: [
        timerNode,
        new HBox( {
          spacing: 20,
          children: [
            mutableUnitsTimerNode,
            unitsRadioButtonGroup
          ]
        } )
      ]
    } );

    // Swap out the dispose function for one that also removes the Emitter listener
    var demoDispose = vBox.dispose.bind( vBox );
    vBox.dispose = function() {
      emitter.removeListener( timerNodeListener );
      demoDispose();
    };
    return vBox;
  };

  // Creates a demo for PaperAirplaneNode
  var demoPaperAirplaneNode = function( layoutBounds ) {
    var paperAirplaneNode = new PaperAirplaneNode( {
      center: layoutBounds.center,
      scale: 5
    } );
    return paperAirplaneNode;
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

    var temperatureSlider = new HSlider( temperatureProperty, new Range( 0, 100 ), {
      trackSize: new Dimension2( 200, 5 ),
      thumbSize: new Dimension2( 25, 50 ),
      thumbFillHighlighted: 'red',
      thumbFill: 'rgb(158,35,32)'
    } );
    temperatureSlider.rotation = -Math.PI / 2;
    temperatureSlider.right = thermometer.left - 50;
    temperatureSlider.centerY = thermometer.centerY;

    return new Node( {
      children: [ thermometer, temperatureSlider ],
      center: layoutBounds.center
    } );
  };

  return inherit( DemosScreenView, ComponentsScreenView, {
    step: function( dt ) {
      emitter.emit( dt );
    }
  } );
} );
