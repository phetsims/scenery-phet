// Copyright 2015-2016, University of Colorado Boulder

/**
 * Controls for experimenting with a ParametricSpring.
 * Sliders with 'black' thumbs are parameters that result in instantiation of Vector2s and Shapes.
 * Sliders with 'green' thumbs are parameters that result in mutation of Vector2s and Shapes.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberControl = require( 'SCENERY_PHET/NumberControl' );
  var Panel = require( 'SUN/Panel' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var VSeparator = require( 'SUN/VSeparator' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );

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
      titleFont: CONTROL_FONT,
      valueFont: CONTROL_FONT,
      decimalPlaces: 0,
      delta: 1,
      minorTickSpacing: 1,
      thumbFillEnabled: 'black'
    } );
    var pointsPerLoopControl = NumberControl.withMinMaxTicks( pointsPerLoopString, springNode.pointsPerLoopProperty, ranges.pointsPerLoopRange, {
      titleFont: CONTROL_FONT,
      valueFont: CONTROL_FONT,
      decimalPlaces: 0,
      delta: 1,
      minorTickSpacing: 10,
      thumbFillEnabled: 'black'
    } );
    var radiusControl = NumberControl.withMinMaxTicks( radiusString, springNode.radiusProperty, ranges.radiusRange, {
      titleFont: CONTROL_FONT,
      valueFont: CONTROL_FONT,
      decimalPlaces: 0,
      delta: 1,
      minorTickSpacing: 5,
      thumbFillEnabled: 'green'
    } );
    var aspectRatioControl = NumberControl.withMinMaxTicks( aspectRatioString, springNode.aspectRatioProperty, ranges.aspectRatioRange, {
      titleFont: CONTROL_FONT,
      valueFont: CONTROL_FONT,
      decimalPlaces: 1,
      delta: 0.1,
      minorTickSpacing: 0.5,
      thumbFillEnabled: 'black'
    } );
    assert && assert( ranges.phaseRange.min === 0 && ranges.phaseRange.max === 2 * Math.PI );
    var phaseControl = new NumberControl( phaseString, springNode.phaseProperty, ranges.phaseRange, {
      titleFont: CONTROL_FONT,
      valueFont: CONTROL_FONT,
      decimalPlaces: 1,
      delta: 0.1,
      minorTickSpacing: 1,
      thumbFillEnabled: 'black',
      majorTicks: [
        { value: ranges.phaseRange.min, label: new Text( '0', { font: TICK_LABEL_FONT } ) },
        { value: ranges.phaseRange.getCenter(), label: new Text( '\u03c0', { font: TICK_LABEL_FONT } ) },
        { value: ranges.phaseRange.max, label: new Text( '2\u03c0', { font: TICK_LABEL_FONT } ) }
      ]
    } );
    assert && assert( ranges.deltaPhaseRange.min === 0 && ranges.deltaPhaseRange.max === 2 * Math.PI );
    var deltaPhaseControl = new NumberControl( deltaPhaseString, springNode.deltaPhaseProperty, ranges.deltaPhaseRange, {
      titleFont: CONTROL_FONT,
      valueFont: CONTROL_FONT,
      decimalPlaces: 1,
      delta: 0.1,
      minorTickSpacing: 1,
      thumbFillEnabled: 'black',
      majorTicks: [
        { value: ranges.deltaPhaseRange.min, label: new Text( '0', { font: TICK_LABEL_FONT } ) },
        { value: ranges.deltaPhaseRange.getCenter(), label: new Text( '\u03c0', { font: TICK_LABEL_FONT } ) },
        { value: ranges.deltaPhaseRange.max, label: new Text( '2\u03c0', { font: TICK_LABEL_FONT } ) }
      ]
    } );
    var lineWidthControl = NumberControl.withMinMaxTicks( lineWidthString, springNode.lineWidthProperty, ranges.lineWidthRange, {
      titleFont: CONTROL_FONT,
      valueFont: CONTROL_FONT,
      decimalPlaces: 1,
      delta: 0.1,
      minorTickSpacing: 1,
      thumbFillEnabled: 'green'
    } );
    var xScaleControl = NumberControl.withMinMaxTicks( xScaleString, springNode.xScaleProperty, ranges.xScaleRange, {
      titleFont: CONTROL_FONT,
      valueFont: CONTROL_FONT,
      decimalPlaces: 1,
      delta: 0.1,
      minorTickSpacing: 0.5,
      thumbFillEnabled: 'green'
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
