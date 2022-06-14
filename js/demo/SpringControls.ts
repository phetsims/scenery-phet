// Copyright 2015-2022, University of Colorado Boulder

/**
 * Controls for experimenting with a ParametricSpring.
 * Sliders with 'black' thumbs are parameters that result in instantiation of Vector2s and Shapes.
 * Sliders with 'green' thumbs are parameters that result in mutation of Vector2s and Shapes.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize from '../../../phet-core/js/optionize.js';
import { HBox, Text, VBox } from '../../../scenery/js/imports.js';
import Panel, { PanelOptions } from '../../../sun/js/Panel.js';
import VSeparator from '../../../sun/js/VSeparator.js';
import Range from '../../../dot/js/Range.js';
import NumberControl from '../NumberControl.js';
import ParametricSpringNode from '../ParametricSpringNode.js';
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

type SelfOptions = {

  // ranges for each spring parameter
  loopsRange: Range;
  radiusRange: Range;
  aspectRatioRange: Range;
  pointsPerLoopRange: Range;
  lineWidthRange: Range;
  phaseRange: Range;
  deltaPhaseRange: Range;
  xScaleRange: Range;
};
export type SpringControlsOptions = SelfOptions & PanelOptions;

export default class SpringControls extends Panel {

  public constructor( springNode: ParametricSpringNode, providedOptions: SpringControlsOptions ) {

    const options = optionize<SpringControlsOptions, SelfOptions, PanelOptions>()( {

      // PanelOptions
      fill: 'rgb( 243, 243, 243 )',
      stroke: 'rgb( 125, 125, 125 )',
      xMargin: 20,
      yMargin: 10
    }, providedOptions );

    // controls, options tweaked empirically to match ranges
    const loopsControl = NumberControl.withMinMaxTicks( loopsString, springNode.loopsProperty, options.loopsRange, {
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

    const pointsPerLoopControl = NumberControl.withMinMaxTicks( pointsPerLoopString, springNode.pointsPerLoopProperty,
      options.pointsPerLoopRange, {
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

    const radiusControl = NumberControl.withMinMaxTicks( radiusString, springNode.radiusProperty, options.radiusRange, {
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

    const aspectRatioControl = NumberControl.withMinMaxTicks( aspectRatioString, springNode.aspectRatioProperty,
      options.aspectRatioRange, {
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

    assert && assert( options.phaseRange.min === 0 && options.phaseRange.max === 2 * Math.PI );
    const phaseControl = new NumberControl( phaseString, springNode.phaseProperty, options.phaseRange, {
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
          { value: options.phaseRange.min, label: new Text( '0', { font: TICK_LABEL_FONT } ) },
          { value: options.phaseRange.getCenter(), label: new Text( '\u03c0', { font: TICK_LABEL_FONT } ) },
          { value: options.phaseRange.max, label: new Text( '2\u03c0', { font: TICK_LABEL_FONT } ) }
        ]
      }
    } );

    assert && assert( options.deltaPhaseRange.min === 0 && options.deltaPhaseRange.max === 2 * Math.PI );
    const deltaPhaseControl = new NumberControl( deltaPhaseString, springNode.deltaPhaseProperty, options.deltaPhaseRange, {
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
          { value: options.deltaPhaseRange.min, label: new Text( '0', { font: TICK_LABEL_FONT } ) },
          { value: options.deltaPhaseRange.getCenter(), label: new Text( '\u03c0', { font: TICK_LABEL_FONT } ) },
          { value: options.deltaPhaseRange.max, label: new Text( '2\u03c0', { font: TICK_LABEL_FONT } ) }
        ]
      }
    } );

    const lineWidthControl = NumberControl.withMinMaxTicks( lineWidthString, springNode.lineWidthProperty, options.lineWidthRange, {
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

    const xScaleControl = NumberControl.withMinMaxTicks( xScaleString, springNode.xScaleProperty, options.xScaleRange, {
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

    super( content, options );
  }
}

sceneryPhet.register( 'SpringControls', SpringControls );