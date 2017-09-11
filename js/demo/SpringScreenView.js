// Copyright 2015-2017, University of Colorado Boulder

/**
 * View for the "Spring" screen, a demo of ParametricSpringNode.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ParametricSpringNode = require( 'SCENERY_PHET/ParametricSpringNode' );
  var RangeWithValue = require( 'DOT/RangeWithValue' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var SpringControls = require( 'SCENERY_PHET/demo/SpringControls' );

  /**
   * @constructor
   */
  function SpringScreenView() {

    ScreenView.call( this );

    // A 200-unit vertical "wall", for comparison with the spring size
    var wallNode = new Rectangle( 0, 0, 25, 200, {
      fill: 'rgb( 180, 180, 180 )',
      stroke: 'black',
      left: 20,
      centerY: 200
    } );

    // Ranges for the various properties of ParametricSpringNode
    var ranges = {
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
    var springNode = new ParametricSpringNode( {

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
    var controls = new SpringControls( ranges, springNode );
    controls.setScaleMagnitude( Math.min( 1, this.layoutBounds.width / controls.width ) );
    controls.bottom = this.layoutBounds.bottom;
    controls.centerX = this.layoutBounds.centerX;

    this.addChild( controls );
    this.addChild( springNode );
    this.addChild( wallNode );

    // Reset All button, to the right, above control panel
    this.addChild( new ResetAllButton( {
      listener: function() {
        springNode.reset();
      },
      right: this.layoutBounds.maxX - 15,
      bottom: controls.top - 10
    } ) );
  }

  sceneryPhet.register( 'SpringScreenView', SpringScreenView );

  return inherit( ScreenView, SpringScreenView );
} );
