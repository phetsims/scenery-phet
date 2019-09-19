// Copyright 2015-2019, University of Colorado Boulder

/**
 * Controls for experimenting with a ParametricSpring.
 * Sliders with 'black' thumbs are parameters that result in instantiation of Vector2s and Shapes.
 * Sliders with 'green' thumbs are parameters that result in mutation of Vector2s and Shapes.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const HBox = require( 'SCENERY/nodes/HBox' );
  const inherit = require( 'PHET_CORE/inherit' );
  const NumberControl = require( 'SCENERY_PHET/NumberControl' );
  const Panel = require( 'SUN/Panel' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );
  const VSeparator = require( 'SUN/VSeparator' );

  // strings - no need for i18n since this is a developer-only demo
  var aspectRatioString = 'aspect ratio:';
  var deltaPhaseString = 'delta phase:';
  var lineWidthString = 'line width:';
  var loopsString = 'loops:';
  var phaseString = 'phase:';
  var pointsPerLoopString = 'points per loop:';
  var radiusString = 'radius:';
  var xScaleString = 'x scale:';

  // constants
  var CONTROL_FONT = new PhetFont( 18 );
  var TICK_LABEL_FONT = new PhetFont( 14 );

  /**
   * @param {Object} ranges - a hash of dot.Range
   * @param {ParametricSpringNode} springNode
   * @param {Object} [options]
   * @constructor
   */
  function SpringControls( ranges, springNode, options ) {

    options = _.extend( {
      fill: 'rgb( 243, 243, 243 )',
      stroke: 'rgb( 125, 125, 125 )',
      xMargin: 20,
      yMargin: 10
    }, options );

    // controls, options tweaked empirically to match ranges
    var loopsControl = NumberControl.withMinMaxTicks( loopsString, springNode.loopsProperty, ranges.loopsRange, {
      delta: 1,
      titleNodeOptions: { font: CONTROL_FONT },
      numberDisplayOptions: {
        font: CONTROL_FONT,
        decimalPlaces: 0
      },
      sliderOptions: {
        thumbFill: 'black',
        minorTickSpacing: 1
      }
    } );
    var pointsPerLoopControl = NumberControl.withMinMaxTicks( pointsPerLoopString, springNode.pointsPerLoopProperty, ranges.pointsPerLoopRange, {
      delta: 1,
      titleNodeOptions: { font: CONTROL_FONT },
      numberDisplayOptions: {
        font: CONTROL_FONT,
        decimalPlaces: 0
      },
      sliderOptions: {
        minorTickSpacing: 10,
        thumbFill: 'black'
      }
    } );
    var radiusControl = NumberControl.withMinMaxTicks( radiusString, springNode.radiusProperty, ranges.radiusRange, {
      delta: 1,
      titleNodeOptions: { font: CONTROL_FONT },
      numberDisplayOptions: {
        font: CONTROL_FONT,
        decimalPlaces: 0
      },
      sliderOptions: {
        minorTickSpacing: 5,
        thumbFill: 'green'
      }
    } );
    var aspectRatioControl = NumberControl.withMinMaxTicks( aspectRatioString, springNode.aspectRatioProperty, ranges.aspectRatioRange, {
      delta: 0.1,
      titleNodeOptions: { font: CONTROL_FONT },
      numberDisplayOptions: {
        font: CONTROL_FONT,
        decimalPlaces: 1
      },
      sliderOptions: {
        minorTickSpacing: 0.5,
        thumbFill: 'black'
      }
    } );
    assert && assert( ranges.phaseRange.min === 0 && ranges.phaseRange.max === 2 * Math.PI );
    var phaseControl = new NumberControl( phaseString, springNode.phaseProperty, ranges.phaseRange, {
      delta: 0.1,
      titleNodeOptions: { font: CONTROL_FONT },
      numberDisplayOptions: {
        font: CONTROL_FONT,
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
    var deltaPhaseControl = new NumberControl( deltaPhaseString, springNode.deltaPhaseProperty, ranges.deltaPhaseRange, {
      delta: 0.1,
      titleNodeOptions: { font: CONTROL_FONT },
      numberDisplayOptions: {
        font: CONTROL_FONT,
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

    var lineWidthControl = NumberControl.withMinMaxTicks( lineWidthString, springNode.lineWidthProperty, ranges.lineWidthRange, {
      delta: 0.1,
      titleNodeOptions: { font: CONTROL_FONT },
      numberDisplayOptions: {
        font: CONTROL_FONT,
        decimalPlaces: 1
      },
      sliderOptions: {
        minorTickSpacing: 1,
        thumbFill: 'green'
      }
    } );
    var xScaleControl = NumberControl.withMinMaxTicks( xScaleString, springNode.xScaleProperty, ranges.xScaleRange, {
      delta: 0.1,
      titleNodeOptions: { font: CONTROL_FONT },
      numberDisplayOptions: {
        font: CONTROL_FONT,
        decimalPlaces: 1
      },
      sliderOptions: {
        minorTickSpacing: 0.5,
        thumbFill: 'green'
      }
    } );

    // layout
    var xSpacing = 25;
    var ySpacing = 30;
    var content = new HBox( {
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

  return inherit( Panel, SpringControls );
} );
