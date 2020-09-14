// Copyright 2015-2020, University of Colorado Boulder

/**
 * View for the "Spring" screen, a demo of ParametricSpringNode.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import RangeWithValue from '../../../dot/js/RangeWithValue.js';
import ScreenView from '../../../joist/js/ScreenView.js';
import Rectangle from '../../../scenery/js/nodes/Rectangle.js';
import ResetAllButton from '../buttons/ResetAllButton.js';
import ParametricSpringNode from '../ParametricSpringNode.js';
import sceneryPhet from '../sceneryPhet.js';
import SpringControls from './SpringControls.js';

class SpringScreenView extends ScreenView {
  constructor() {

    super();

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
    const controls = new SpringControls( ranges, springNode );
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
}

sceneryPhet.register( 'SpringScreenView', SpringScreenView );
export default SpringScreenView;