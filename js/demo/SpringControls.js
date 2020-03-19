// Copyright 2015-2020, University of Colorado Boulder

/**
 * Controls for experimenting with a ParametricSpring.
 * Sliders with 'black' thumbs are parameters that result in instantiation of Vector2s and Shapes.
 * Sliders with 'green' thumbs are parameters that result in mutation of Vector2s and Shapes.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import inherit from '../../../phet-core/js/inherit.js';
import merge from '../../../phet-core/js/merge.js';
import HBox from '../../../scenery/js/nodes/HBox.js';
import Text from '../../../scenery/js/nodes/Text.js';
import VBox from '../../../scenery/js/nodes/VBox.js';
import Panel from '../../../sun/js/Panel.js';
import VSeparator from '../../../sun/js/VSeparator.js';
import NumberControl from '../NumberControl.js';
import PhetFont from '../PhetFont.js';
import sceneryPhet from '../sceneryPhet.js';

// strings - no need for i18n since this is a developer-only demo
const aspectRatioString = 'aspect ratio:';
const deltaPhaseString = 'delta phase:';
const lineWidthString = 'line width:';
const loopsString = 'loops:';
const phaseString = 'phase:';
const pointsPerLoopString = 'points per loop:';
const radiusString = 'radius:';
const xScaleString = 'x scale:';

// constants
const CONTROL_FONT = new PhetFont( 18 );
const TICK_LABEL_FONT = new PhetFont( 14 );

/**
 * @param {Object} ranges - a hash of dot.Range
 * @param {ParametricSpringNode} springNode
 * @param {Object} [options]
 * @constructor
 */
function SpringControls( ranges, springNode, options ) {

  options = merge( {
    fill: 'rgb( 243, 243, 243 )',
    stroke: 'rgb( 125, 125, 125 )',
    xMargin: 20,
    yMargin: 10
  }, options );

  // controls, options tweaked empirically to match ranges
  const loopsControl = NumberControl.withMinMaxTicks( loopsString, springNode.loopsProperty, ranges.loopsRange, {
    delta: 1,
    titleNodeOptions: { font: CONTROL_FONT },
    numberDisplayOptions: {
      textOptions: {
        font: CONTROL_FONT
      },
      decimalPlaces: 0
    },
    sliderOptions: {
      thumbFill: 'black',
      minorTickSpacing: 1
    }
  } );
  const pointsPerLoopControl = NumberControl.withMinMaxTicks( pointsPerLoopString, springNode.pointsPerLoopProperty, ranges.pointsPerLoopRange, {
    delta: 1,
    titleNodeOptions: { font: CONTROL_FONT },
    numberDisplayOptions: {
      textOptions: {
        font: CONTROL_FONT
      },
      decimalPlaces: 0
    },
    sliderOptions: {
      minorTickSpacing: 10,
      thumbFill: 'black'
    }
  } );
  const radiusControl = NumberControl.withMinMaxTicks( radiusString, springNode.radiusProperty, ranges.radiusRange, {
    delta: 1,
    titleNodeOptions: { font: CONTROL_FONT },
    numberDisplayOptions: {
      textOptions: {
        font: CONTROL_FONT
      },
      decimalPlaces: 0
    },
    sliderOptions: {
      minorTickSpacing: 5,
      thumbFill: 'green'
    }
  } );
  const aspectRatioControl = NumberControl.withMinMaxTicks( aspectRatioString, springNode.aspectRatioProperty, ranges.aspectRatioRange, {
    delta: 0.1,
    titleNodeOptions: { font: CONTROL_FONT },
    numberDisplayOptions: {
      textOptions: {
        font: CONTROL_FONT
      },
      decimalPlaces: 1
    },
    sliderOptions: {
      minorTickSpacing: 0.5,
      thumbFill: 'black'
    }
  } );
  assert && assert( ranges.phaseRange.min === 0 && ranges.phaseRange.max === 2 * Math.PI );
  const phaseControl = new NumberControl( phaseString, springNode.phaseProperty, ranges.phaseRange, {
    delta: 0.1,
    titleNodeOptions: { font: CONTROL_FONT },
    numberDisplayOptions: {
      textOptions: {
        font: CONTROL_FONT
      },
      decimalPlaces: 1
    },
    sliderOptions: {
      minorTickSpacing: 1,
      thumbFill: 'black',
      majorTicks: [
        { value: ranges.phaseRange.min, label: new Text( '0', { font: TICK_LABEL_FONT } ) },
        { value: ranges.phaseRange.getCenter(), label: new Text( '\u03c0', { font: TICK_LABEL_FONT } ) },
        { value: ranges.phaseRange.max, label: new Text( '2\u03c0', { font: TICK_LABEL_FONT } ) }
      ]
    }
  } );
  assert && assert( ranges.deltaPhaseRange.min === 0 && ranges.deltaPhaseRange.max === 2 * Math.PI );
  const deltaPhaseControl = new NumberControl( deltaPhaseString, springNode.deltaPhaseProperty, ranges.deltaPhaseRange, {
    delta: 0.1,
    titleNodeOptions: { font: CONTROL_FONT },
    numberDisplayOptions: {
      textOptions: {
        font: CONTROL_FONT
      },
      decimalPlaces: 1
    },
    sliderOptions: {
      minorTickSpacing: 1,
      thumbFill: 'black',
      majorTicks: [
        { value: ranges.deltaPhaseRange.min, label: new Text( '0', { font: TICK_LABEL_FONT } ) },
        { value: ranges.deltaPhaseRange.getCenter(), label: new Text( '\u03c0', { font: TICK_LABEL_FONT } ) },
        { value: ranges.deltaPhaseRange.max, label: new Text( '2\u03c0', { font: TICK_LABEL_FONT } ) }
      ]
    }
  } );

  const lineWidthControl = NumberControl.withMinMaxTicks( lineWidthString, springNode.lineWidthProperty, ranges.lineWidthRange, {
    delta: 0.1,
    titleNodeOptions: { font: CONTROL_FONT },
    numberDisplayOptions: {
      textOptions: {
        font: CONTROL_FONT
      },
      decimalPlaces: 1
    },
    sliderOptions: {
      minorTickSpacing: 1,
      thumbFill: 'green'
    }
  } );
  const xScaleControl = NumberControl.withMinMaxTicks( xScaleString, springNode.xScaleProperty, ranges.xScaleRange, {
    delta: 0.1,
    titleNodeOptions: { font: CONTROL_FONT },
    numberDisplayOptions: {
      textOptions: {
        font: CONTROL_FONT
      },
      decimalPlaces: 1
    },
    sliderOptions: {
      minorTickSpacing: 0.5,
      thumbFill: 'green'
    }
  } );

  // layout
  const xSpacing = 25;
  const ySpacing = 30;
  const content = new HBox( {
    children: [
      new VBox( { children: [ loopsControl, pointsPerLoopControl ], spacing: ySpacing } ),
      new VBox( { children: [ radiusControl, aspectRatioControl ], spacing: ySpacing } ),
      new VBox( { children: [ phaseControl, deltaPhaseControl ], spacing: ySpacing } ),
      new VSeparator( 225, { stroke: 'rgb( 125, 125, 125 )' } ),
      new VBox( { children: [ lineWidthControl, xScaleControl ], spacing: ySpacing } )
    ],
    spacing: xSpacing,
    align: 'top'
  } );

  Panel.call( this, content, options );
}

sceneryPhet.register( 'SpringControls', SpringControls );

inherit( Panel, SpringControls );
export default SpringControls;