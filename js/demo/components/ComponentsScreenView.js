// Copyright 2014-2022, University of Colorado Boulder

/**
 * Demonstration of misc scenery-phet UI components.
 * Demos are selected from a combo box, and are instantiated on demand.
 * Use the 'component' query parameter to set the initial selection of the combo box.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import { Shape } from '../../../../kite/js/imports.js';
import merge from '../../../../phet-core/js/merge.js';
import { Color, DragListener, HBox, KeyboardDragListener, Node, Path, Rectangle, RichText, Text, VBox } from '../../../../scenery/js/imports.js';
import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import DemosScreenView from '../../../../sun/js/demo/DemosScreenView.js';
import Panel from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import GrabDragInteraction from '../../accessibility/GrabDragInteraction.js';
import HandleNode from '../../HandleNode.js';
import HeaterCoolerNode from '../../HeaterCoolerNode.js';
import LaserPointerNode from '../../LaserPointerNode.js';
import NumberControl from '../../NumberControl.js';
import PhetFont from '../../PhetFont.js';
import ProbeNode from '../../ProbeNode.js';
import sceneryPhet from '../../sceneryPhet.js';
import sceneryPhetQueryParameters from '../../sceneryPhetQueryParameters.js';
import demoArrowNode from './demoArrowNode.js';
import demoBeakerNode from './demoBeakerNode.js';
import demoBicyclePumpNode from './demoBicyclePumpNode.js';
import demoBracketNode from './demoBracketNode.js';
import demoCapacitorNode from './demoCapacitorNode.js';
import demoComboBoxDisplay from './demoComboBoxDisplay.js';
import demoConductivityTesterNode from './demoConductivityTesterNode.js';
import demoDrawer from './demoDrawer.js';
import demoEyeDropperNode from './demoEyeDropperNode.js';
import demoFaucetNode from './demoFaucetNode.js';
import demoFlowBox from './demoFlowBox.js';
import demoFormulaNode from './demoFormulaNode.js';
import demoGaugeNode from './demoGaugeNode.js';
import demoGridBox from './demoGridBox.js';
import demoKeyboardHelp from './demoKeyboardHelp.js';
import demoKeyNode from './demoKeyNode.js';
import demoKeypad from './demoKeypad.js';
import demoManualConstraint from './demoManualConstraint.js';
import demoMeasuringTapeNode from './demoMeasuringTapeNode.js';
import demoNumberDisplay from './demoNumberDisplay.js';
import demoPaperAirplaneNode from './demoPaperAirplaneNode.js';
import demoRulerNode from './demoRulerNode.js';
import demoScientificNotationNode from './demoScientificNotationNode.js';
import demoSpectrumNode from './demoSpectrumNode.js';
import demoSprites from './demoSprites.js';
import demoStarNode from './demoStarNode.js';
import demoStopwatchNode from './demoStopwatchNode.js';
import demoThermometerNode from './demoThermometerNode.js';
import demoTimeControlNode from './demoTimeControlNode.js';
import demoWireNode from './demoWireNode.js';

export default class ComponentsScreenView extends DemosScreenView {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {
      selectedDemoLabel: sceneryPhetQueryParameters.component,
      tandem: Tandem.REQUIRED
    }, options );

    // To add a demo, add an entry here of type SunDemo.
    const demos = [
      { label: 'ArrowNode', createNode: demoArrowNode },
      { label: 'BeakerNode', createNode: demoBeakerNode },
      { label: 'BicyclePumpNode', createNode: demoBicyclePumpNode },
      { label: 'BracketNode', createNode: demoBracketNode },
      { label: 'CapacitorNode', createNode: demoCapacitorNode },
      { label: 'ComboBoxDisplay', createNode: demoComboBoxDisplay },
      { label: 'ConductivityTesterNode', createNode: demoConductivityTesterNode },
      { label: 'Drawer', createNode: demoDrawer },
      { label: 'EyeDropperNode', createNode: demoEyeDropperNode },
      { label: 'FaucetNode', createNode: demoFaucetNode },
      { label: 'FlowBox', createNode: demoFlowBox },
      { label: 'FormulaNode', createNode: demoFormulaNode },
      { label: 'GaugeNode', createNode: demoGaugeNode },
      { label: 'GridBox', createNode: demoGridBox },
      { label: 'GrabDragInteraction', createNode: getDemoGrabDragInteraction( options.tandem ) },
      { label: 'HandleNode', createNode: demoHandleNode },
      { label: 'HeaterCoolerNode', createNode: demoHeaterCoolerNode },
      { label: 'KeyNode', createNode: demoKeyNode },
      { label: 'KeyboardHelp', createNode: demoKeyboardHelp },
      { label: 'Keypad', createNode: demoKeypad },
      { label: 'LaserPointerNode', createNode: demoLaserPointerNode },
      { label: 'ManualConstraint', createNode: demoManualConstraint },
      { label: 'MeasuringTapeNode', createNode: demoMeasuringTapeNode },
      { label: 'NumberDisplay', createNode: demoNumberDisplay },
      { label: 'PaperAirplaneNode', createNode: demoPaperAirplaneNode },
      { label: 'ProbeNode', createNode: demoProbeNode },
      { label: 'RichText', createNode: demoRichText },
      { label: 'RulerNode', createNode: demoRulerNode },
      { label: 'ScientificNotationNode', createNode: demoScientificNotationNode },
      { label: 'SpectrumNode', createNode: demoSpectrumNode },
      { label: 'Sprites', createNode: demoSprites },
      { label: 'StarNode', createNode: demoStarNode },
      { label: 'StopwatchNode', createNode: demoStopwatchNode },
      { label: 'ThermometerNode', createNode: demoThermometerNode },
      { label: 'TimeControlNode', createNode: demoTimeControlNode },
      { label: 'WireNode', createNode: demoWireNode }
    ];

    super( demos, options );
  }
}

// Creates a demo for HandleNode
function demoHandleNode( layoutBounds ) {
  const handleNode = new HandleNode( { scale: 4.0 } );

  return new Node( {
    children: [ handleNode ],
    center: layoutBounds.center
  } );
}

// Creates a demo for HeaterCoolerNode
function demoHeaterCoolerNode( layoutBounds ) {
  return new HeaterCoolerNode( new NumberProperty( 0, {
    range: new Range( -1, 1 ) // +1 for max heating, -1 for max cooling
  } ), { center: layoutBounds.center } );
}

// Creates a demo for ProbeNode
function demoProbeNode( layoutBounds ) {

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
  Multilink.multilink( [ redProperty, greenProperty, blueProperty ],
    ( r, g, b ) => {
      colorProperty.value = new Color( r, g, b );
    } );

  // Controls for the sensor type (glass/crosshairs/empty/etc)
  const radioButtonGroup = new RectangularRadioButtonGroup( sensorTypeFunctionProperty, [
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
  demoParent.addChild( radioButtonGroup );

  // When the model properties change, update the sensor node
  Multilink.multilink( [
      colorProperty,
      radiusProperty,
      innerRadiusProperty,
      handleWidthProperty,
      handleHeightProperty,
      handleCornerRadiusProperty,
      lightAngleProperty,
      sensorTypeFunctionProperty
    ],
    () => {
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
  multiplierProperty.link( multiplier => {
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
}

// Creates a demo for RichText
function demoRichText( layoutBounds ) {
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
          callback: () => console.log( 'Link was clicked' )
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
}

// Creates a demo for LaserPointerNode
function demoLaserPointerNode( layoutBounds ) {

  const leftOnProperty = new Property( false );
  const rightOnProperty = new Property( false );

  // Demonstrate how to adjust lighting
  const leftLaserNode = new LaserPointerNode( leftOnProperty, {

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
    left: layoutBounds.centerX + 20,
    centerY: layoutBounds.centerY,
    hasGlass: true
  } );

  const leftBeamNode = new Rectangle( 0, 0, 1000, 40, {
    fill: 'yellow',
    right: leftLaserNode.centerX,
    centerY: leftLaserNode.centerY
  } );

  const rightBeamNode = new Rectangle( 0, 0, 1000, 40, {
    fill: 'yellow',
    left: rightLaserNode.centerX,
    centerY: rightLaserNode.centerY
  } );

  leftOnProperty.link( on => {
    leftBeamNode.visible = on;
  } );
  rightOnProperty.link( on => {
    rightBeamNode.visible = on;
  } );

  return new Node( { children: [ leftBeamNode, leftLaserNode, rightBeamNode, rightLaserNode ] } );
}

// Creates a demo for GrabDragInteraction
function getDemoGrabDragInteraction( tandem ) {
  return layoutBounds => {

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
      positionProperty: positionProperty,
      tandem: tandem.createTandem( 'keyboardDragListener' )
    } );
    rect.addInputListener( keyboardDragListener );

    new GrabDragInteraction( rect, keyboardDragListener, { // eslint-disable-line no-new
      objectToGrabString: 'rectangle',
      grabbableAccessibleName: 'grab rectangle',
      tandem: tandem.createTandem( 'grabDragInteraction' )
    } );

    return new Node( {
      children: [ rect ],
      center: layoutBounds.center
    } );
  };
}

sceneryPhet.register( 'ComponentsScreenView', ComponentsScreenView );