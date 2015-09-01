// Copyright 2002-2015, University of Colorado Boulder

/**
 * Controls for experimenting with a ParametricSpring.
 * Sliders with 'black' thumbs are parameters that result in re-computation of Vector2s and Shapes.
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
  var Util = require( 'DOT/Util' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var VSeparator = require( 'SUN/VSeparator' );

  // strings - no need for i18n since this is a developer-only screen
  var aspectRatioString = 'aspect ratio:';
  var deltaPhaseString = 'delta phase:';
  var lineWidthString = 'line width:';
  var loopsString = "loops:";
  var phaseString = 'phase:';
  var pointsPerLoopString = 'points per loop:';
  var radiusString = 'radius:';
  var xScaleString = 'x scale:';

  // constants
  var CONTROL_FONT = new PhetFont( 22 );
  var TICK_LABEL_FONT = new PhetFont( 14 );

  /**
   * @param {Object} ranges - a collection of dot.Range
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

    var model = springNode.model;

    // controls, options tweaked empirically to match ranges
    var loopsControl = createNumberControl( loopsString, model.loopsProperty, ranges.loopsRange, {
      decimalPlaces: 0,
      delta: 1,
      minorTickSpacing: 1,
      thumbFillEnabled: 'black'
    } );
    var pointsPerLoopControl = createNumberControl( pointsPerLoopString, model.pointsPerLoopProperty, ranges.pointsPerLoopRange, {
      decimalPlaces: 0,
      delta: 1,
      minorTickSpacing: 10,
      thumbFillEnabled: 'black'
    } );
    var radiusControl = createNumberControl( radiusString, model.radiusProperty, ranges.radiusRange, {
      decimalPlaces: 0,
      delta: 1,
      minorTickSpacing: 5,
      thumbFillEnabled: 'green'
    } );
    var aspectRatioControl = createNumberControl( aspectRatioString, model.aspectRatioProperty, ranges.aspectRatioRange, {
      decimalPlaces: 1,
      delta: 0.1,
      minorTickSpacing: 0.5,
      thumbFillEnabled: 'black'
    } );
    assert && assert( ranges.phaseRange.min === 0 && ranges.phaseRange.max === 2 * Math.PI );
    var phaseControl = createNumberControl( phaseString, model.phaseProperty, ranges.phaseRange, {
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
    var deltaPhaseControl = createNumberControl( deltaPhaseString, model.deltaPhaseProperty, ranges.deltaPhaseRange, {
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
    var lineWidthControl = createNumberControl( lineWidthString, model.lineWidthProperty, ranges.lineWidthRange, {
      decimalPlaces: 1,
      delta: 0.1,
      minorTickSpacing: 1,
      thumbFillEnabled: 'green'
    } );
    var xScaleControl = createNumberControl( xScaleString, model.xScaleProperty, ranges.xScaleRange, {
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

  /**
   * Creates a NumberControl with labeled slider ticks at the min and max values.
   * @param {string} label
   * @param {Property.<number>} property
   * @param {Range} range
   * @param {Object} [options]
   */
  var createNumberControl = function( label, property, range, options ) {

    options = _.extend( {
      titleFont: CONTROL_FONT,
      valueFont: CONTROL_FONT,
      minorTickSpacing: 1,
      decimalPlaces: 0,
      delta: 1
    }, options );

    options.majorTicks = options.majorTicks || [
        { value: range.min, label: new Text( Util.toFixed( range.min, options.decimalPlaces ), { font: TICK_LABEL_FONT } ) },
        { value: range.max, label: new Text( Util.toFixed( range.max, options.decimalPlaces ), { font: TICK_LABEL_FONT } ) }
      ];

    return new NumberControl( label, property, range, options );
  };

  return inherit( Panel, SpringControls );
} );
