// Copyright 2014-2020, University of Colorado Boulder

/**
 * Demonstration of misc scenery-phet UI components.
 * Demos are selected from a combo box, and are instantiated on demand.
 * Use the 'component' query parameter to set the initial selection of the combo box.
 *
 * @author Sam Reid
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../axon/js/DerivedProperty.js';
import Emitter from '../../../axon/js/Emitter.js';
import NumberProperty from '../../../axon/js/NumberProperty.js';
import Property from '../../../axon/js/Property.js';
import StringProperty from '../../../axon/js/StringProperty.js';
import Bounds3 from '../../../dot/js/Bounds3.js';
import Dimension2 from '../../../dot/js/Dimension2.js';
import Range from '../../../dot/js/Range.js';
import Vector2 from '../../../dot/js/Vector2.js';
import Vector2Property from '../../../dot/js/Vector2Property.js';
import Shape from '../../../kite/js/Shape.js';
import inherit from '../../../phet-core/js/inherit.js';
import merge from '../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../phetcommon/js/view/ModelViewTransform2.js';
import DragListener from '../../../scenery/js/listeners/DragListener.js';
import KeyboardDragListener from '../../../scenery/js/listeners/KeyboardDragListener.js';
import Circle from '../../../scenery/js/nodes/Circle.js';
import HBox from '../../../scenery/js/nodes/HBox.js';
import Node from '../../../scenery/js/nodes/Node.js';
import Path from '../../../scenery/js/nodes/Path.js';
import Rectangle from '../../../scenery/js/nodes/Rectangle.js';
import RichText from '../../../scenery/js/nodes/RichText.js';
import Text from '../../../scenery/js/nodes/Text.js';
import VBox from '../../../scenery/js/nodes/VBox.js';
import Color from '../../../scenery/js/util/Color.js';
import NodeProperty from '../../../scenery/js/util/NodeProperty.js';
import RadioButtonGroup from '../../../sun/js/buttons/RadioButtonGroup.js';
import RectangularPushButton from '../../../sun/js/buttons/RectangularPushButton.js';
import Checkbox from '../../../sun/js/Checkbox.js';
import DemosScreenView from '../../../sun/js/demo/DemosScreenView.js';
import HSlider from '../../../sun/js/HSlider.js';
import Panel from '../../../sun/js/Panel.js';
import VSlider from '../../../sun/js/VSlider.js';
import Tandem from '../../../tandem/js/Tandem.js';
import GrabDragInteraction from '../accessibility/GrabDragInteraction.js';
import ArrowNode from '../ArrowNode.js';
import BicyclePumpNode from '../BicyclePumpNode.js';
import BracketNode from '../BracketNode.js';
import ResetButton from '../buttons/ResetButton.js';
import CapacitorConstants from '../capacitor/CapacitorConstants.js';
import CapacitorNode from '../capacitor/CapacitorNode.js';
import YawPitchModelViewTransform3 from '../capacitor/YawPitchModelViewTransform3.js';
import ComboBoxDisplay from '../ComboBoxDisplay.js';
import ConductivityTesterNode from '../ConductivityTesterNode.js';
import Drawer from '../Drawer.js';
import EyeDropperNode from '../EyeDropperNode.js';
import FaucetNode from '../FaucetNode.js';
import FineCoarseSpinner from '../FineCoarseSpinner.js';
import FormulaNode from '../FormulaNode.js';
import GaugeNode from '../GaugeNode.js';
import HandleNode from '../HandleNode.js';
import HeaterCoolerNode from '../HeaterCoolerNode.js';
import MovableDragHandler from '../input/MovableDragHandler.js';
import ArrowKeyNode from '../keyboard/ArrowKeyNode.js';
import CapsLockKeyNode from '../keyboard/CapsLockKeyNode.js';
import EnterKeyNode from '../keyboard/EnterKeyNode.js';
import GeneralKeyboardHelpSection from '../keyboard/help/GeneralKeyboardHelpSection.js';
import KeyboardHelpIconFactory from '../keyboard/help/KeyboardHelpIconFactory.js';
import KeyboardHelpSection from '../keyboard/help/KeyboardHelpSection.js';
import SliderKeyboardHelpSection from '../keyboard/help/SliderKeyboardHelpSection.js';
import LetterKeyNode from '../keyboard/LetterKeyNode.js';
import ShiftKeyNode from '../keyboard/ShiftKeyNode.js';
import TabKeyNode from '../keyboard/TabKeyNode.js';
import TextKeyNode from '../keyboard/TextKeyNode.js';
import Keypad from '../keypad/Keypad.js';
import LaserPointerNode from '../LaserPointerNode.js';
import MeasuringTapeNode from '../MeasuringTapeNode.js';
import NumberControl from '../NumberControl.js';
import NumberDisplay from '../NumberDisplay.js';
import NumberKeypad from '../NumberKeypad.js';
import NumberPicker from '../NumberPicker.js';
import PaperAirplaneNode from '../PaperAirplaneNode.js';
import PhetFont from '../PhetFont.js';
import ProbeNode from '../ProbeNode.js';
import RulerNode from '../RulerNode.js';
import sceneryPhet from '../sceneryPhet.js';
import sceneryPhetQueryParameters from '../sceneryPhetQueryParameters.js';
import ScientificNotationNode from '../ScientificNotationNode.js';
import SpectrumNode from '../SpectrumNode.js';
import StarNode from '../StarNode.js';
import Stopwatch from '../Stopwatch.js';
import StopwatchNode from '../StopwatchNode.js';
import ThermometerNode from '../ThermometerNode.js';
import TimeControlNode from '../TimeControlNode.js';
import TimeControlSpeed from '../TimeControlSpeed.js';
import WireNode from '../WireNode.js';

// constants
const emitter = new Emitter( { parameters: [ { valueType: 'number' } ] } ); // allow tests to wire up to step function // TODO: move to DemosScreenView

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
    { label: 'BicyclePumpNode', createNode: demoBicyclePumpNode },
    { label: 'BracketNode', createNode: demoBracketNode },
    { label: 'CapacitorNode', createNode: demoCapacitorNode },
    { label: 'ComboBoxDisplay', createNode: demoComboBoxDisplay },
    { label: 'ConductivityTesterNode', createNode: demoConductivityTesterNode },
    { label: 'Drawer', createNode: demoDrawer },
    { label: 'EyeDropperNode', createNode: demoEyeDropperNode },
    { label: 'FaucetNode', createNode: demoFaucetNode },
    { label: 'FineCoarseSpinner', createNode: demoFineCoarseSpinner },
    { label: 'FormulaNode', createNode: demoFormulaNode },
    { label: 'GaugeNode', createNode: demoGaugeNode },
    { label: 'GrabDragInteraction', createNode: getDemoGrabDragInteraction( options.tandem ) },
    { label: 'HandleNode', createNode: demoHandleNode },
    { label: 'HeaterCoolerNode', createNode: demoHeaterCoolerNode },
    { label: 'KeyNode', createNode: demoKeyNode },
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
    { label: 'SpectrumNode', createNode: demoSpectrumNode },
    { label: 'StarNode', createNode: demoStarNode },
    { label: 'StopwatchNode', createNode: demoStopwatchNode },
    { label: 'ThermometerNode', createNode: demoTemperatureNode },
    { label: 'TimeControlNode', createNode: demoTimeControlNode },
    { label: 'WireNode', createNode: demoWireNode }
  ], merge( {
    comboBoxItemFont: new PhetFont( 12 ),
    comboBoxItemYMargin: 3,
    selectedDemoLabel: sceneryPhetQueryParameters.component,
    tandem: Tandem.REQUIRED
  }, options ) );
}

sceneryPhet.register( 'ComponentsScreenView', ComponentsScreenView );

// Creates a demo for ArrowNode
const demoArrowNode = function( layoutBounds ) {

  const arrowNode = new ArrowNode( 0, 0, 200, 200, {
    headWidth: 30,
    headHeight: 30,
    center: layoutBounds.center
  } );

  const checkedProperty = new Property( false );
  checkedProperty.link( function( checked ) {
    arrowNode.setDoubleHead( checked );
  } );

  const checkbox = new Checkbox( new Text( 'Double head', { font: new PhetFont( 20 ) } ), checkedProperty, {
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

// Creates a demo for BicyclePumpNode
const demoBicyclePumpNode = function( layoutBounds ) {

  const numberOfParticlesProperty = new NumberProperty( 0, {
    numberType: 'Integer',
    range: new Range( 0, 100 )
  } );

  const rangeProperty = new Property( numberOfParticlesProperty.range );

  const bicyclePumpNode = new BicyclePumpNode( numberOfParticlesProperty, rangeProperty, {
    hoseAttachmentOffset: new Vector2( 100, -100 )
  } );

  // Displays the number of particles, positioned next to the hose output
  const displayNode = new Text( numberOfParticlesProperty.value, {
    font: new PhetFont( 24 ),
    left: bicyclePumpNode.x + bicyclePumpNode.hoseAttachmentOffset.x + 20,
    centerY: bicyclePumpNode.y + bicyclePumpNode.hoseAttachmentOffset.y
  } );

  numberOfParticlesProperty.link( numberOfParticles => {
    displayNode.text = numberOfParticles;
  } );

  const resetButton = new ResetButton( {
    listener: () => {
      numberOfParticlesProperty.reset();
      bicyclePumpNode.reset();
    },
    scale: 0.75,
    centerX: bicyclePumpNode.x,
    top: bicyclePumpNode.bottom + 20
  } );

  return new Node( {
    children: [ bicyclePumpNode, displayNode, resetButton ],
    center: layoutBounds.center
  } );
};

// Creates a demo for BracketNode
const demoBracketNode = function( layoutBounds ) {
  return new BracketNode( {
    orientation: 'left',
    bracketTipPosition: 0.75,
    labelNode: new Text( 'bracket', { font: new PhetFont( 20 ) } ),
    spacing: 10,
    center: layoutBounds.center
  } );
};

// Creates a demo for BracketNode
const demoCapacitorNode = function( layoutBounds ) {
  const plateBounds = new Bounds3( 0, 0, 0, 0.01414213562373095, CapacitorConstants.PLATE_HEIGHT, 0.01414213562373095 );

  // An object literal is fine in a demo like this, but we probably wouldn't do this in production code.
  const circuit = {
    maxPlateCharge: 2.6562e-12,
    capacitor: {
      plateSizeProperty: new Property( plateBounds ),
      plateSeparationProperty: new NumberProperty( 0.006 ),
      plateVoltageProperty: new NumberProperty( 1.5 ),
      plateChargeProperty: new NumberProperty( 4.426999999999999e-13 / 10 * 4 ),
      getEffectiveEField() {
        return 0;
      }
    }
  };
  const modelViewTransform = new YawPitchModelViewTransform3();
  const plateChargeVisibleProperty = new BooleanProperty( true );
  const electricFieldVisibleProperty = new BooleanProperty( true );

  const capacitorNode = new CapacitorNode( circuit, modelViewTransform, plateChargeVisibleProperty, electricFieldVisibleProperty, {
    tandem: Tandem.OPTIONAL
  } );

  const controls = new VBox( {
    children: [
      new NumberControl( 'separation', circuit.capacitor.plateSeparationProperty, new Range( 0, 0.01 ), {
        delta: 0.0001,
        numberDisplayOptions: {
          decimalPlaces: 5
        }
      } ),
      new NumberControl( 'charge', circuit.capacitor.plateChargeProperty, new Range( -( 4.426999999999999e-13 ) * 1.5, ( 4.426999999999999e-13 ) * 1.5 ), {
        delta: 4.426999999999999e-13 / 30,
        numberDisplayOptions: {
          decimalPlaces: 20
        }
      } )
    ]
  } );

  return new VBox( {
    spacing: 20,
    resize: false,
    children: [
      capacitorNode,
      controls
    ],
    center: layoutBounds.center
  } );
};

// Creates a demo for ComboBoxDisplay that exercises layout functionality.
// See https://github.com/phetsims/scenery-phet/issues/482
const demoComboBoxDisplay = function( layoutBounds ) {

  const numberOfDogsProperty = new NumberProperty( 0 ); // value to be displayed for dogs
  const numberOfCatsProperty = new DerivedProperty( [ numberOfDogsProperty ], () => numberOfDogsProperty.value * 20 );
  const choiceProperty = new StringProperty( 'cats' );  // selected choice in the combo box
  const displayRange = new Range( 0, 1000 );
  const sliderRange = new Range( 0, 1000 ); // larger than display range, to verify that display scales

  // items in the ComboBoxDisplay
  const items = [
    { choice: 'cats', numberProperty: numberOfCatsProperty, range: displayRange, units: 'cats' },
    { choice: 'dogs', numberProperty: numberOfDogsProperty, range: displayRange, units: 'dogs' }
  ];

  // parent for the ComboBoxDisplay's popup list
  const listParent = new Node();

  // ComboBoxDisplay
  const display = new ComboBoxDisplay( items, choiceProperty, listParent, {
    xMargin: 10,
    yMargin: 8,
    highlightFill: 'rgb( 255, 200, 200 )', // pink
    numberDisplayOptions: {
      textOptions: {
        font: new PhetFont( 20 )
      }
    }
  } );

  // Slider
  const slider = new VSlider( numberOfDogsProperty, sliderRange );

  // Slider to left of display
  const hBox = new HBox( {
    spacing: 25,
    children: [ slider, display ]
  } );

  return new Node( {
    children: [ new VBox( {
      children: [ new Text( 'There are twice as many cats as dogs in the world.' ), hBox ],
      spacing: 20,
      center: layoutBounds.center
    } ), listParent ]
  } );
};

// Creates a demo for ConductivityTesterNode
const demoConductivityTesterNode = function( layoutBounds ) {

  const brightnessProperty = new Property( 0 ); // 0-1
  const testerPositionProperty = new Vector2Property( new Vector2( 0, 0 ) );
  const positiveProbePositionProperty = new Vector2Property( new Vector2( testerPositionProperty.get().x + 140, testerPositionProperty.get().y + 100 ) );
  const negativeProbePositionProperty = new Vector2Property( new Vector2( testerPositionProperty.get().x - 40, testerPositionProperty.get().y + 100 ) );

  const conductivityTesterNode = new ConductivityTesterNode( brightnessProperty,
    testerPositionProperty, positiveProbePositionProperty, negativeProbePositionProperty, {
      modelViewTransform: ModelViewTransform2.createOffsetScaleMapping( layoutBounds.center, 1 ), // move model origin to screen's center
      positiveProbeFill: 'orange',
      cursor: 'pointer'
    }
  );
  conductivityTesterNode.addInputListener( new MovableDragHandler( testerPositionProperty ) );

  // brightness slider
  const brightnessSlider = new HSlider( brightnessProperty, new Range( 0, 1 ), {
    trackSize: new Dimension2( 200, 5 ),
    thumbSize: new Dimension2( 25, 45 ),
    thumbFill: 'orange',
    thumbFillHighlighted: 'rgb( 255, 210, 0 )',
    thumbCenterLineStroke: 'black',
    centerX: conductivityTesterNode.centerX,
    bottom: conductivityTesterNode.bottom + 100
  } );

  // short-circuit checkbox
  const shortCircuitProperty = new Property( false );
  shortCircuitProperty.link( function( shortCircuit ) {
    conductivityTesterNode.shortCircuit = shortCircuit;
  } );
  const shortCircuitCheckbox = new Checkbox( new Text( 'short circuit', { font: new PhetFont( 20 ) } ), shortCircuitProperty, {
    centerX: brightnessSlider.centerX,
    bottom: brightnessSlider.bottom + 50
  } );

  return new Node( {
    children: [ conductivityTesterNode, brightnessSlider, shortCircuitCheckbox ],
    center: layoutBounds.center
  } );
};

// Creates a demo for Drawer
const demoDrawer = function( layoutBounds ) {

  const rectangle = new Rectangle( 0, 0, 400, 50, {
    fill: 'gray',
    stroke: 'black',
    cornerRadius: 10
  } );

  const textNode = new Text( 'Hello Drawer!', {
    font: new PhetFont( 40 ),
    fill: 'red'
  } );

  const drawer = new Drawer( textNode, {
    handlePosition: 'bottom',
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
const demoEyeDropperNode = function( layoutBounds ) {

  const dropperNode = new EyeDropperNode( {
    fluidColor: 'purple',
    center: layoutBounds.center
  } );

  dropperNode.dispensingProperty.lazyLink( function( dispensing ) {
    console.log( 'dropper ' + ( dispensing ? 'dispensing' : 'not dispensing' ) );
  } );

  return dropperNode;
};

// Creates a demo for FaucetNode
const demoFaucetNode = function( layoutBounds ) {

  const fluidRateProperty = new Property( 0 );
  const faucetEnabledProperty = new Property( true );

  const faucetNode = new FaucetNode( 10, fluidRateProperty, faucetEnabledProperty, {
    shooterOptions: {
      touchAreaXDilation: 37,
      touchAreaYDilation: 60
    }
  } );

  const faucetEnabledCheckbox = new Checkbox( new Text( 'faucet enabled', { font: new PhetFont( 20 ) } ), faucetEnabledProperty, {
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
const demoFormulaNode = function( layoutBounds ) {
  const conditional = '\\forall \\mathbf{p}\\in\\mathbb{R}^2';
  const leftVert = '\\left\\lVert';
  const rightVert = '\\right\\rVert';
  const matrix = '\\begin{bmatrix} \\cos\\theta & \\sin\\theta \\\\ -\\sin\\theta & \\cos\\theta \\end{bmatrix}^{k+1}';
  const sumExpr = leftVert + '\\sum_{k=1}^{\\infty}kx^{k-1}' + matrix + rightVert;
  const integral = '\\int_{0}^{2\\pi}\\overline{f(\\theta)}\\cos\\theta\\,\\mathrm{d}\\theta';
  const invCos = '\\cos^{-1}\\left( \\frac{\\sqrt{\\varphi_2}}{\\sqrt{x_2^2+x_3^2}} \\right)';

  const formulaNode = new FormulaNode( conditional + '\\quad ' + sumExpr + ' = ' + invCos + ' + ' + integral, {
    center: layoutBounds.center,
    scale: 1.3,
    displayMode: true
  } );
  const bounds = Rectangle.bounds( formulaNode.bounds, {
    fill: 'rgba(0,0,0,0.1)'
  } );
  return new Node( {
    children: [ bounds, formulaNode ]
  } );
};

// Creates a demo for GaugeNode
const demoGaugeNode = function( layoutBounds ) {
  const valueProperty = new Property( 0 );
  const gaugeValueRange = new Range( -100, 100 );
  const sliderValueRange = new Range( gaugeValueRange.min - 20, gaugeValueRange.max + 20 );

  const gaugeNode = new GaugeNode( valueProperty, 'GaugeNode', gaugeValueRange );

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
const demoHandleNode = function( layoutBounds ) {
  const handleNode = new HandleNode( { scale: 4.0 } );

  return new Node( {
    children: [ handleNode ],
    center: layoutBounds.center
  } );
};

// Creates a demo for HeaterCoolerNode
const demoHeaterCoolerNode = function( layoutBounds ) {
  return new HeaterCoolerNode( new NumberProperty( 0, {
    range: new Range( -1, 1 ) // +1 for max heating, -1 for max cooling
  } ), { center: layoutBounds.center } );
};

// Creates a demo for ProbeNode
const demoProbeNode = function( layoutBounds ) {

  const demoParent = new Node();

  // Layer for the light sensor node.  The node will be destroyed and re-created when its parameters change
  const probeNodeLayer = new Node();
  demoParent.addChild( probeNodeLayer );

  // Properties that describe the probe's options
  const colorProperty = new Property( ProbeNode.DEFAULT_OPTIONS.color );
  const radiusProperty = new Property( ProbeNode.DEFAULT_OPTIONS.radius );
  const innerRadiusProperty = new Property( ProbeNode.DEFAULT_OPTIONS.innerRadius );
  const handleWidthProperty = new Property( ProbeNode.DEFAULT_OPTIONS.handleWidth );
  const handleHeightProperty = new Property( ProbeNode.DEFAULT_OPTIONS.handleHeight );
  const handleCornerRadiusProperty = new Property( ProbeNode.DEFAULT_OPTIONS.handleCornerRadius );
  const lightAngleProperty = new Property( ProbeNode.DEFAULT_OPTIONS.lightAngle );
  const sensorTypeFunctionProperty = new Property( ProbeNode.DEFAULT_OPTIONS.sensorTypeFunction );

  // RGB color components, for setting the sensor color
  const color = Color.toColor( colorProperty.value );
  const redProperty = new Property( color.red );
  const greenProperty = new Property( color.green );
  const blueProperty = new Property( color.blue );
  Property.multilink( [ redProperty, greenProperty, blueProperty ], function( r, g, b ) {
    colorProperty.value = new Color( r, g, b );
  } );

  // Controls for the sensor type (glass/crosshairs/empty/etc)
  const radioButtons = new RadioButtonGroup( sensorTypeFunctionProperty, [
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
  const crossHairsRadius = 150;
  demoParent.addChild( new Path( new Shape()
    .moveTo( layoutBounds.centerX - crossHairsRadius, layoutBounds.centerY )
    .lineTo( layoutBounds.centerX + crossHairsRadius, layoutBounds.centerY )
    .moveTo( layoutBounds.centerX, layoutBounds.centerY - crossHairsRadius )
    .lineTo( layoutBounds.centerX, layoutBounds.centerY + crossHairsRadius ), {
    stroke: 'black',
    lineWidth: 0.5
  } ) );

  // Geometry controls
  const numberControlOptions = {
    titleNodeOptions: {
      font: new PhetFont( 14 )
    },
    numberDisplayOptions: {
      textOptions: {
        font: new PhetFont( 14 )
      }
    },
    sliderOptions: {
      trackSize: new Dimension2( 150, 3 ),
      containerTagName: 'div'
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
  const colorComponentRange = new Range( 0, 255 );
  const colorPanel = new Panel( new VBox( {
    spacing: 15,
    children: [
      NumberControl.withMinMaxTicks( 'R:', redProperty, colorComponentRange, numberControlOptions ),
      NumberControl.withMinMaxTicks( 'G:', greenProperty, colorComponentRange, numberControlOptions ),
      NumberControl.withMinMaxTicks( 'B:', blueProperty, colorComponentRange, numberControlOptions )
    ]
  } ) );

  // Light angle control, sets the multiplier for Math.PI
  const tickLabelOptions = { font: new PhetFont( 14 ) };
  const multiplierProperty = new Property( 0 );
  multiplierProperty.link( function( multiplier ) {
    lightAngleProperty.value = ( multiplier * Math.PI );
  } );

  // construct nested options object from base numberControlsOptions
  const lightAngleNumberControlOptions = merge( {
    delta: 0.05
  }, numberControlOptions );

  lightAngleNumberControlOptions.numberDisplayOptions = merge( {
    valuePattern: '{0} \u03c0',
    decimalPlaces: 2
  }, numberControlOptions.numberDisplayOptions );

  lightAngleNumberControlOptions.sliderOptions = merge( {
    majorTicks: [
      { value: 0, label: new Text( '0', tickLabelOptions ) },
      { value: 1, label: new Text( '\u03c0', tickLabelOptions ) },
      { value: 2, label: new Text( '2\u03c0', tickLabelOptions ) }
    ]
  }, numberControlOptions.sliderOptions );

  const lightAngleControl = new NumberControl( 'Light Angle:', multiplierProperty, new Range( 0, 2 ), lightAngleNumberControlOptions );

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
const demoRichText = function( layoutBounds ) {
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
const demoLaserPointerNode = function( layoutBounds ) {

  const leftOnProperty = new Property( false );
  const rightOnProperty = new Property( false );
  const enabledProperty = new Property( true );

  // Demonstrate how to adjust lighting
  const leftLaserNode = new LaserPointerNode( leftOnProperty, {

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

  const rightLaserNode = new LaserPointerNode( rightOnProperty, {
    enabledProperty: enabledProperty,
    left: layoutBounds.centerX + 20,
    centerY: layoutBounds.centerY,
    hasGlass: true
  } );

  const leftBeamNode = new Rectangle( 0, 0, 1000, 40, {
    fill: 'yellow',
    right: leftLaserNode.left + 1,
    centerY: leftLaserNode.centerY
  } );

  const rightBeamNode = new Rectangle( 0, 0, 1000, 40, {
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
  const enabledCheckbox = new Checkbox( new Text( 'enabled', { font: new PhetFont( 20 ) } ), enabledProperty, {
    centerX: layoutBounds.centerX,
    top: leftLaserNode.bottom + 40
  } );

  return new Node( { children: [ leftBeamNode, leftLaserNode, rightBeamNode, rightLaserNode, enabledCheckbox ] } );
};

// Creates a demo for MeasuringTapeNode
const demoMeasuringTapeNode = function( layoutBounds ) {

  const measuringTapeUnitsProperty = new Property( { name: 'meters', multiplier: 1 } );

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
const demoWireNode = function( layoutBounds ) {

  const greenCircle = new Circle( 20, {
    fill: 'green',
    cursor: 'pointer'
  } );
  greenCircle.addInputListener( new DragListener( { translateNode: true } ) );

  const redCircle = new Circle( 20, {
    fill: 'red',
    cursor: 'pointer',
    center: greenCircle.center.plusXY( 200, 200 )
  } );
  redCircle.addInputListener( new DragListener( { translateNode: true } ) );

  // Distance the wires stick out from the objects
  const NORMAL_DISTANCE = 100;

  // Add the wire behind the probe.
  const wireNode = new WireNode(
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
  const noValueDisplay = new NumberDisplay( new Property( null ), range, merge( {}, numberDisplayOptions, {
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
const demoNumberKeypad = function( layoutBounds ) {

  const integerKeypad = new NumberKeypad( {
    validateKey: NumberKeypad.validateMaxDigits( { maxDigits: 4 } )
  } );

  // value of integerKeypad is displayed here
  const integerText = new Text( '', { font: new PhetFont( 24 ) } );
  integerKeypad.valueStringProperty.link( function( valueString ) {
    integerText.text = valueString;
  } );

  // For testing NumberKeypad's clearOnNextKeyPress feature
  const clearOnNextKeyPressProperty = new Property( false );
  const clearOnNextKeyPressCheckbox = new Checkbox( new Text( 'clearOnNextKeyPress', { font: new PhetFont( 16 ) } ), clearOnNextKeyPressProperty );

  clearOnNextKeyPressProperty.link( function( clearOnNextKeyPress ) {
    integerKeypad.clearOnNextKeyPress = clearOnNextKeyPress;
  } );
  integerKeypad.valueStringProperty.link( function() {
    clearOnNextKeyPressProperty.value = integerKeypad.clearOnNextKeyPress;
  } );

  const decimalKeypad = new NumberKeypad( {
    decimalPointKey: true
  } );

  // value of decimalKeypad is displayed here
  const decimalText = new Text( '', { font: new PhetFont( 24 ) } );
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
const demoKeyNode = function( layoutBounds ) {

  // example letter keys, portion of a typical keyboard
  const topRowKeyStrings = [ 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\' ];
  const middleRowKeyStrings = [ 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ':', '"' ];
  const bottomRowKeyStrings = [ 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '\'', '.', '/' ];

  // arrays that hold key nodes for each row of a keyboard - each row starts with an additional multi-character key
  const topKeyNodes = [ new TabKeyNode() ];
  const middleKeyNodes = [ new CapsLockKeyNode() ];
  const bottomKeyNodes = [ new ShiftKeyNode() ];

  let i;
  for ( i = 0; i < topRowKeyStrings.length; i++ ) {
    topKeyNodes.push( new LetterKeyNode( topRowKeyStrings[ i ], { forceSquareKey: true } ) );
  }
  for ( i = 0; i < middleRowKeyStrings.length; i++ ) {
    middleKeyNodes.push( new LetterKeyNode( middleRowKeyStrings[ i ], { forceSquareKey: true } ) );
  }
  for ( i = 0; i < bottomRowKeyStrings.length; i++ ) {
    bottomKeyNodes.push( new LetterKeyNode( bottomRowKeyStrings[ i ], { forceSquareKey: true } ) );
  }
  const topArrowKeyNode = new ArrowKeyNode( 'up' );
  const bottomArrowKeyNodes = [ new ArrowKeyNode( 'left' ), new ArrowKeyNode( 'down' ), new ArrowKeyNode( 'right' ) ];
  const bottomArrowKeyBox = new HBox( { children: bottomArrowKeyNodes, spacing: 2 } );

  // add the enter and shift keys to the middle and bottom rows, shift key has extra width for alignment
  middleKeyNodes.push( new EnterKeyNode() );
  bottomKeyNodes.push( new ShiftKeyNode( { xAlign: 'right', xMargin: 4, minKeyWidth: 70 } ) );

  const topHBox = new HBox( { children: topKeyNodes, spacing: 5 } );
  const midddleHBox = new HBox( { children: middleKeyNodes, spacing: 5 } );
  const bottomHBox = new HBox( { children: bottomKeyNodes, spacing: 5 } );
  const arrowKeysVBox = new VBox( {
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
const demoHelpContent = function( layoutBounds ) {

  const labelWithIcon = KeyboardHelpSection.labelWithIcon( 'Label With Icon:', new TextKeyNode( 'Hi' ), 'Label With Icon Hi' );
  const labelWithIconList = KeyboardHelpSection.labelWithIconList( 'Label With Icon List:', [
    new TextKeyNode( 'Hi' ),
    new TextKeyNode( 'Hello' ),
    new TextKeyNode( 'Ahoy\' Manatee' )
  ], 'Label with icon list of hi, hello, Ahoy Manatee.' );

  const labelWithArrowKeysRowIcon = KeyboardHelpSection.labelWithIcon( 'Label with arrows:', KeyboardHelpIconFactory.arrowKeysRowIcon(), 'Label with arrows, up, left, down, right' );
  const labelWithUpDownArrowKeysRowIcon = KeyboardHelpSection.labelWithIcon( 'Label with up down arrows:', KeyboardHelpIconFactory.upDownArrowKeysRowIcon(), 'Label with up down arrows' );
  const labelWithLeftRightArrowKeysRowIcon = KeyboardHelpSection.labelWithIcon( 'Label with left right arrows:', KeyboardHelpIconFactory.leftRightArrowKeysRowIcon(), 'Label with left right arrows' );

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
const demoKeypad = function( layoutBounds ) {

  const integerKeyPad = new Keypad( Keypad.PositiveAndNegativeIntegerLayout, {
    buttonWidth: 35,
    buttonHeight: 35,
    maxDigits: 5
  } );

  const integerStringRepresentation = new Text( '', { font: new PhetFont( 24 ) } );
  const integerValueRepresentation = new Text( '', { font: new PhetFont( 24 ) } );

  integerKeyPad.stringProperty.link( function( value ) {
    integerStringRepresentation.text = 'string: ' + value;
  } );

  integerKeyPad.valueProperty.link( function( value ) {
    integerValueRepresentation.text = 'number: ' + value;
  } );

  const integerClearButton = new RectangularPushButton( {
    content: new Text( 'Clear Keypad' ),
    listener: function() {
      integerKeyPad.clear();
    }
  } );

  // For testing clearOnNextKeyPress feature
  const integerClearOnNextKeyPressProperty = new Property( integerKeyPad.getClearOnNextKeyPress() );
  const integerClearOnNextKeyPressCheckbox = new Checkbox(
    new Text( 'Clear On Next Key Press' ),
    integerClearOnNextKeyPressProperty
  );
  integerClearOnNextKeyPressProperty.link( function( clearOnNextKeyPress ) {
    integerKeyPad.setClearOnNextKeyPress( clearOnNextKeyPress );
  } );

  integerKeyPad.valueProperty.link( function( value ) {
    integerClearOnNextKeyPressProperty.value = integerKeyPad.getClearOnNextKeyPress();
  } );

  const integerVBox = new VBox( {
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

  const floatingPointKeyPad = new Keypad( Keypad.PositiveFloatingPointLayout, {
    buttonWidth: 35,
    buttonHeight: 35,
    maxDigits: 4,
    maxDigitsRightOfMantissa: 2
  } );

  const floatingPointStringRepresentation = new Text( '', { font: new PhetFont( 24 ) } );
  const floatingPointValueRepresentation = new Text( '', { font: new PhetFont( 24 ) } );

  floatingPointKeyPad.stringProperty.link( function( value ) {
    floatingPointStringRepresentation.text = 'string: ' + value;
  } );

  floatingPointKeyPad.valueProperty.link( function( value ) {
    floatingPointValueRepresentation.text = 'number: ' + value;
  } );

  const floatingPointClearButton = new RectangularPushButton( {
    content: new Text( 'Clear Keypad' ),
    listener: function() {
      floatingPointKeyPad.clear();
    }
  } );

  // For testing clearOnNextKeyPress feature
  const floatingPointClearOnNextKeyPressProperty = new Property( floatingPointKeyPad.getClearOnNextKeyPress() );
  const floatingPointClearOnNextKeyPressButton = new Checkbox(
    new Text( 'Clear On Next Key Press' ),
    floatingPointClearOnNextKeyPressProperty
  );
  floatingPointClearOnNextKeyPressProperty.link( function( clearOnNextKeyPress ) {
    floatingPointKeyPad.setClearOnNextKeyPress( clearOnNextKeyPress );
  } );

  floatingPointKeyPad.valueProperty.link( function() {
    floatingPointClearOnNextKeyPressProperty.value = floatingPointKeyPad.getClearOnNextKeyPress();
  } );

  const floatingPointVBox = new VBox( {
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

  let positiveAndNegativeFloatingPointKeyPad = new Keypad( Keypad.PositiveAndNegativeFloatingPointLayout, {
    buttonWidth: 35,
    buttonHeight: 35,
    maxDigits: 4,
    maxDigitsRightOfMantissa: 2
  } );

  const positiveAndNegativeFloatingPointStringRepresentation = new Text( '', { font: new PhetFont( 24 ) } );
  const positiveAndNegativeFloatingPointValueRepresentation = new Text( '', { font: new PhetFont( 24 ) } );

  positiveAndNegativeFloatingPointKeyPad.stringProperty.link( function( value ) {
    positiveAndNegativeFloatingPointStringRepresentation.text = 'string: ' + value;
  } );

  positiveAndNegativeFloatingPointKeyPad.valueProperty.link( function( value ) {
    positiveAndNegativeFloatingPointValueRepresentation.text = 'number: ' + value;
  } );

  const positiveAndNegativeFloatingPointClearButton = new RectangularPushButton( {
    content: new Text( 'Clear Keypad' ),
    listener: function() {
      positiveAndNegativeFloatingPointKeyPad.clear();
    }
  } );

  // For testing clearOnNextKeyPress feature
  const positiveAndNegativeFloatingPointClearOnNextKeyPressProperty = new Property(
    positiveAndNegativeFloatingPointKeyPad.getClearOnNextKeyPress()
  );
  const positiveAndNegativeFloatingPointClearOnNextKeyPressCheckbox = new Checkbox(
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
  const removeKeypadFromScreenButton = new RectangularPushButton( {
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

  const positiveAndNegativeFloatingPointVBox = new VBox( {
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
const demoNumberPicker = function( layoutBounds ) {
  return new NumberPicker( new Property( 0 ), new Property( new Range( -10, 10 ) ), {
    font: new PhetFont( 40 ),
    center: layoutBounds.center
  } );
};

// Creates a demo for RulerNode
const demoRulerNode = function( layoutBounds ) {

  const rulerLength = 500;
  const majorTickWidth = 50;
  const majorTickLabels = [];
  const numberOfTicks = Math.floor( rulerLength / majorTickWidth ) + 1;
  for ( let i = 0; i < numberOfTicks; i++ ) {
    majorTickLabels[ i ] = '' + ( i * majorTickWidth );
  }

  return new RulerNode( rulerLength, 0.15 * rulerLength, majorTickWidth, majorTickLabels, 'm', {
    insetsWidth: 25,
    minorTicksPerMajorTick: 4,
    center: layoutBounds.center
  } );
};

// Creates a demo for SpectrumNode
const demoSpectrumNode = function( layoutBounds ) {
  return new SpectrumNode( {
    center: layoutBounds.center
  } );
};

// Creates a demo for StarNode
const demoStarNode = function( layoutBounds ) {

  const starValueProperty = new Property( 1 );

  const starSlider = new HSlider( starValueProperty, new Range( 0, 1 ), {
    thumbSize: new Dimension2( 25, 50 ),
    thumbFillHighlighted: 'yellow',
    thumbFill: 'rgb(220,220,0)',
    thumbCenterLineStroke: 'black'
  } );

  const starNodeContainer = new Node( {
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
const demoScientificNotationNode = function( layoutBounds ) {
  const numberProperty = new Property( 1 );

  const numberSlider = new HSlider( numberProperty, new Range( 0, 100 ) );

  const scientificNotationNode = new ScientificNotationNode( numberProperty );

  return new VBox( {
    spacing: 20,
    center: layoutBounds.center,
    children: [ numberSlider, scientificNotationNode ]
  } );
};

// Creates a sample StopwatchNode
const demoStopwatchNode = function( layoutBounds, options ) {

  // Create a StopwatchNode that doesn't show units (assumed to be seconds)
  const stopwatch = new Stopwatch( { isVisible: true, tandem: options.tandem.createTandem( 'stopwatch' ) } );
  const stopwatchNode = new StopwatchNode( stopwatch, {
    tandem: options.tandem.createTandem( 'unitlessStopwatchNode' )
  } );

  // Create a StopwatchNode that can show from a selection of units.
  const unitsProperty = new Property( 'ps' );

  // Initialize with longest possible string
  const unitsNode = new Text( 'ms', { font: new PhetFont( 15 ) } );
  const mutableUnitsStopwatch = new Stopwatch( {
    isVisible: true,
    tandem: options.tandem.createTandem( 'stopwatch' )
  } );
  const mutableUnitsStopwatchNode = new StopwatchNode( mutableUnitsStopwatch, {
    stopwatchReadoutNodeOptions: { unitsNode: unitsNode },
    scale: 2,
    tandem: options.tandem.createTandem( 'stopwatchNode' )
  } );

  const stopwatchNodeListener = dt => {
    stopwatch.step( dt );
    mutableUnitsStopwatch.step( dt );
  };
  emitter.addListener( stopwatchNodeListener );
  unitsProperty.link( function( units ) {
    unitsNode.text = units;
  } );
  const unitsRadioButtonGroup = new RadioButtonGroup( unitsProperty, [
    { value: 'ps', node: new Text( 'picoseconds' ), tandemName: 'picoseconds' },
    { value: 'ms', node: new Text( 'milliseconds' ), tandemName: 'milliseconds' },
    { value: 'fs', node: new Text( 'femtoseconds' ), tandemName: 'femtoseconds' }
  ], {
    spacing: 5,
    tandem: options.tandem.createTandem( 'unitsRadioButtonGroup' )
  } );

  // Layout
  const vBox = new VBox( {
    align: 'left',
    spacing: 20,
    center: layoutBounds.center,
    children: [
      stopwatchNode,
      new HBox( {
        spacing: 20,
        children: [
          mutableUnitsStopwatchNode,
          unitsRadioButtonGroup
        ]
      } )
    ]
  } );

  // Swap out the dispose function for one that also removes the Emitter listener
  const demoDispose = vBox.dispose.bind( vBox );
  vBox.dispose = function() {
    emitter.removeListener( stopwatchNodeListener );
    demoDispose();
  };
  return vBox;
};

// Creates a demo for PaperAirplaneNode
const demoPaperAirplaneNode = function( layoutBounds ) {
  const paperAirplaneNode = new PaperAirplaneNode( {
    center: layoutBounds.center,
    scale: 5
  } );
  return paperAirplaneNode;
};

// Creates a demo for ThermometerNode
const demoTemperatureNode = function( layoutBounds ) {

  const temperatureProperty = new Property( 50 );

  const thermometer = new ThermometerNode( 0, 100, temperatureProperty, {
    scale: 1.5
  } );

  const temperatureSlider = new HSlider( temperatureProperty, new Range( 0, 100 ), {
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

// Creates a demo for GrabDragInteraction
const getDemoGrabDragInteraction = tandem => {
  return function( layoutBounds ) {

    const rect = new Rectangle( 0, 0, 100, 100, {
      tagName: 'div',
      role: 'application',
      fill: 'blue',
      cursor: 'pointer'
    } );
    const positionProperty = new Vector2Property( Vector2.ZERO );
    positionProperty.linkAttribute( rect, 'translation' );

    const listener = new DragListener( {
      positionProperty: positionProperty
    } );
    rect.addInputListener( listener );
    const keyboardDragListener = new KeyboardDragListener( {
      positionProperty: positionProperty
    } );
    rect.addInputListener( keyboardDragListener );

    // @private
    this.grabDragInteraction = new GrabDragInteraction( rect, {
      objectToGrabString: 'rectangle',
      grabbableAccessibleName: 'grab rectangle',

      listenersForDrag: [ keyboardDragListener ],

      tandem: tandem.createTandem( 'grabDragInteraction' )
    } );

    return new Node( {
      children: [ rect ],
      center: layoutBounds.center
    } );
  };
};

// creates a demo for the TimeControlNode
const demoTimeControlNode = function( layoutBounds ) {

  const defaultTimeControlNode = new TimeControlNode( new BooleanProperty( true ) );

  // a TimeControlNode with all push buttons
  const pushButtonTimeControlNode = new TimeControlNode( new BooleanProperty( true ), {
    playPauseStepButtonOptions: {
      includeStepBackwardButton: true,
      playPauseButtonOptions: {
        scaleFactorWhenPaused: 1.3
      }
    }
  } );

  // a TimeControlNode with default speed radio buttons
  const speedTimeControlNode = new TimeControlNode( new BooleanProperty( true ), {
    timeControlSpeedProperty: new Property( TimeControlSpeed.NORMAL )
  } );

  // a TimeControlNode with swapped layout for radio buttons with radio buttons wrapped in a panel
  const customTimeControlNode = new TimeControlNode( new BooleanProperty( true ), {
    timeControlSpeedProperty: new Property( TimeControlSpeed.SLOW ),
    timeControlSpeeds: [ TimeControlSpeed.NORMAL, TimeControlSpeed.FAST, TimeControlSpeed.SLOW ],
    speedRadioButtonGroupOnLeft: true,
    wrapSpeedButtonsInPanel: true,
    speedRadioButtonGroupPanelOptions: {
      fill: 'rgb(239,239,195)'
    },
    buttonGroupXSpacing: 100,
    wrapSpeedRadioButtonGroupInPanel: true
  } );

  const controls = [ defaultTimeControlNode, pushButtonTimeControlNode, speedTimeControlNode, customTimeControlNode ];
  return new VBox( {
    children: controls,
    spacing: 30,
    center: layoutBounds.center,
    resize: false
  } );
};

export default inherit( DemosScreenView, ComponentsScreenView, {
  step: function( dt ) {
    emitter.emit( dt );
  }
} );