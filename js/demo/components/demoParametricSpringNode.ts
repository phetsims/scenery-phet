// Copyright 2015-2022, University of Colorado Boulder

/**
 * Demo for ParametricSpringNode
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize from '../../../../phet-core/js/optionize.js';
import { HBox, Node, Rectangle, Text, VBox, VSeparator } from '../../../../scenery/js/imports.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import Range from '../../../../dot/js/Range.js';
import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import NumberControl from '../../NumberControl.js';
import ParametricSpringNode from '../../ParametricSpringNode.js';
import PhetFont from '../../PhetFont.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import ResetAllButton from '../../buttons/ResetAllButton.js';

export default function demoParametricSpringNode( layoutBounds: Bounds2 ): Node {
  return new DemoNode( layoutBounds );
}

class DemoNode extends Node {

  private readonly disposeDemoNode: () => void;

  public constructor( layoutBounds: Bounds2 ) {

    // A 200-unit vertical "wall", for comparison with the spring size
    const wallNode = new Rectangle( 0, 0, 25, 200, {
      fill: 'rgb( 180, 180, 180 )',
      stroke: 'black',
      left: 20,
      centerY: 200
    } );

    // Ranges for the various properties of ParametricSpringNode
    const ranges = {
      loopsRange: new RangeWithValue( 4, 15, 10 ),
      radiusRange: new RangeWithValue( 5, 70, 10 ),
      aspectRatioRange: new RangeWithValue( 0.5, 10, 4 ),
      pointsPerLoopRange: new RangeWithValue( 10, 100, 30 ),
      lineWidthRange: new RangeWithValue( 1, 10, 3 ),
      phaseRange: new RangeWithValue( 0, 2 * Math.PI, Math.PI ), // radians
      deltaPhaseRange: new RangeWithValue( 0, 2 * Math.PI, Math.PI / 2 ), // radians
      xScaleRange: new RangeWithValue( 0.5, 11, 2.5 )
    };

    // spring
    const springNode = new ParametricSpringNode( {

      // initial values for Properties
      loops: ranges.loopsRange.defaultValue,
      radius: ranges.radiusRange.defaultValue,
      aspectRatio: ranges.aspectRatioRange.defaultValue,
      pointsPerLoop: ranges.pointsPerLoopRange.defaultValue,
      lineWidth: ranges.lineWidthRange.defaultValue,
      phase: ranges.phaseRange.defaultValue,
      deltaPhase: ranges.deltaPhaseRange.defaultValue,
      xScale: ranges.xScaleRange.defaultValue,

      // initial values for static fields
      frontColor: 'rgb( 150, 150, 255 )',
      middleColor: 'rgb( 0, 0, 255 )',
      backColor: 'rgb( 0, 0, 200 )',

      // use x,y exclusively for layout, because we're using boundsMethod:'none'
      x: wallNode.right,
      y: wallNode.centerY
    } );

    // control panel, scaled to fit across the bottom
    const controlPanel = new ControlPanel( springNode, ranges );
    controlPanel.setScaleMagnitude( Math.min( 1, layoutBounds.width / controlPanel.width ) );
    controlPanel.bottom = layoutBounds.bottom;
    controlPanel.centerX = layoutBounds.centerX;

    const resetAllButton = new ResetAllButton( {
      listener: function() {
        springNode.reset();
      },
      right: layoutBounds.maxX - 15,
      bottom: controlPanel.top - 10
    } );

    super( {
      children: [ springNode, wallNode, controlPanel, resetAllButton ]
    } );

    this.disposeDemoNode = () => {
      wallNode.dispose();
      springNode.dispose();
      controlPanel.dispose();
      resetAllButton.dispose();
    };
  }

  public override dispose(): void {
    this.disposeDemoNode();
    super.dispose();
  }
}

/**
 * Controls for experimenting with a ParametricSpring.
 * Sliders with 'black' thumbs are parameters that result in instantiation of Vector2s and Shapes.
 * Sliders with 'green' thumbs are parameters that result in mutation of Vector2s and Shapes.
 */

// strings - no need for i18n since this is a developer-only demo
const aspectRatioString = 'aspect ratio:';
const deltaPhaseString = 'delta phase:';
const lineWidthString = 'line width:';
const loopsString = 'loops:';
const phaseString = 'phase:';
const pointsPerLoopString = 'points per loop:';
const radiusString = 'radius:';
const xScaleString = 'x scale:';

const CONTROL_FONT = new PhetFont( 18 );
const TICK_LABEL_FONT = new PhetFont( 14 );

type ControlPanelSelfOptions = {

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
export type ControlPanelOptions = ControlPanelSelfOptions & PanelOptions;

class ControlPanel extends Panel {

  public constructor( springNode: ParametricSpringNode, providedOptions: ControlPanelOptions ) {

    const options = optionize<ControlPanelOptions, ControlPanelSelfOptions, PanelOptions>()( {

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
        new VSeparator( { stroke: 'rgb( 125, 125, 125 )' } ),
        new VBox( { children: [ lineWidthControl, xScaleControl ], spacing: ySpacing } )
      ],
      spacing: xSpacing,
      align: 'top'
    } );

    super( content, options );
  }
}