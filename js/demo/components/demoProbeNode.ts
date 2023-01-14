// Copyright 2022-2023, University of Colorado Boulder

/**
 * Demo for ProbeNode
 */

import { Color, Node, Path, Text, VBox } from '../../../../scenery/js/imports.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import NumberControl, { NumberControlOptions, NumberControlSliderOptions } from '../../NumberControl.js';
import PhetFont from '../../PhetFont.js';
import ProbeNode from '../../ProbeNode.js';
import Property from '../../../../axon/js/Property.js';
import Multilink from '../../../../axon/js/Multilink.js';
import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import { Shape } from '../../../../kite/js/imports.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Range from '../../../../dot/js/Range.js';
import Panel from '../../../../sun/js/Panel.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import { NumberDisplayOptions } from '../../NumberDisplay.js';

export default function demoProbeNode( layoutBounds: Bounds2 ): Node {

  const demoParent = new Node();

  // Layer for the light sensor node.  The node will be destroyed and re-created when its parameters change
  const probeNodeLayer = new Node();
  demoParent.addChild( probeNodeLayer );

  // Properties that describe the probe's options
  const colorProperty = new Property( ProbeNode.DEFAULT_PROBE_NODE_OPTIONS.color );
  const radiusProperty = new Property( ProbeNode.DEFAULT_PROBE_NODE_OPTIONS.radius );
  const innerRadiusProperty = new Property( ProbeNode.DEFAULT_PROBE_NODE_OPTIONS.innerRadius );
  const handleWidthProperty = new Property( ProbeNode.DEFAULT_PROBE_NODE_OPTIONS.handleWidth );
  const handleHeightProperty = new Property( ProbeNode.DEFAULT_PROBE_NODE_OPTIONS.handleHeight );
  const handleCornerRadiusProperty = new Property( ProbeNode.DEFAULT_PROBE_NODE_OPTIONS.handleCornerRadius );
  const lightAngleProperty = new Property( ProbeNode.DEFAULT_PROBE_NODE_OPTIONS.lightAngle );
  const sensorTypeFunctionProperty = new Property( ProbeNode.DEFAULT_PROBE_NODE_OPTIONS.sensorTypeFunction );

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
    { value: null, createNode: () => new Text( 'null' ) },
    { value: sensorTypeFunctionProperty.value, createNode: () => new Text( 'default glass' ) },
    { value: ProbeNode.crosshairs(), createNode: () => new Text( 'default crosshairs' ) },
    {
      value: ProbeNode.glass( {
        centerColor: 'red',
        middleColor: 'green',
        edgeColor: 'blue'
      } ), createNode: () => new Text( 'custom glass' )
    }
  ], {
    right: layoutBounds.maxX - 5,
    top: layoutBounds.minY + 5,
    orientation: 'horizontal',
    spacing: 5,
    radioButtonOptions: {
      baseColor: 'white'
    }
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
  const numberControlOptions: NumberControlOptions = {
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
        new Range( 1, ProbeNode.DEFAULT_PROBE_NODE_OPTIONS.radius * 2 ), numberControlOptions ),
      NumberControl.withMinMaxTicks( 'Inner Radius:', innerRadiusProperty,
        new Range( 1, ProbeNode.DEFAULT_PROBE_NODE_OPTIONS.innerRadius * 2 ), numberControlOptions ),
      NumberControl.withMinMaxTicks( 'Handle Width:', handleWidthProperty,
        new Range( 1, ProbeNode.DEFAULT_PROBE_NODE_OPTIONS.handleWidth * 2 ), numberControlOptions ),
      NumberControl.withMinMaxTicks( 'Handle Height:', handleHeightProperty,
        new Range( 1, ProbeNode.DEFAULT_PROBE_NODE_OPTIONS.handleHeight * 2 ), numberControlOptions ),
      NumberControl.withMinMaxTicks( 'Handle Corner Radius:', handleCornerRadiusProperty,
        new Range( 1, ProbeNode.DEFAULT_PROBE_NODE_OPTIONS.handleCornerRadius * 2 ), numberControlOptions )
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
  const lightAngleNumberControlOptions = combineOptions<NumberControlOptions>( {
    delta: 0.05
  }, numberControlOptions );

  lightAngleNumberControlOptions.numberDisplayOptions = combineOptions<NumberDisplayOptions>( {
    valuePattern: '{0} \u03c0',
    decimalPlaces: 2
  }, numberControlOptions.numberDisplayOptions );

  lightAngleNumberControlOptions.sliderOptions = combineOptions<NumberControlSliderOptions>( {
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