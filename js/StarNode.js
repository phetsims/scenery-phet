// Copyright 2014-2021, University of Colorado Boulder

/**
 * Star that fills in from left to right.  Can be used in games to show the score.
 *
 * @author Sam Reid
 * @author John Blanco
 */

import Shape from '../../kite/js/Shape.js';
import merge from '../../phet-core/js/merge.js';
import Node from '../../scenery/js/nodes/Node.js';
import Path from '../../scenery/js/nodes/Path.js';
import sceneryPhet from './sceneryPhet.js';
import StarShape from './StarShape.js';

class StarNode extends Node {

  /**
   * @param {Object} [options] see comments in the constructor for options parameter values
   */
  constructor( options ) {

    options = merge( {

      //See StarShape for the other options, including:
      // value -- 0=empty, 1=full
      value: 1,
      // outerRadius
      // innerRadius

      // Fill parameters for the part of the star that is filled in.  Should be bold and gold.
      filledFill: '#fcff03',
      filledStroke: 'black',
      filledLineWidth: 1.5,
      filledLineJoin: 'round',

      // Fill parameters for the part of the star that is unfilled.  Should be bland.
      emptyFill: '#e1e1e1', //pretty gray
      emptyStroke: '#d3d1d1 ', //darker gray than the fill, but still pretty faint
      emptyLineWidth: 1.5,
      emptyLineJoin: 'round'
    }, options );

    super();

    // add the gray star behind the filled star, so it will look like it fills in
    const backgroundStar = new Path( null, {
      stroke: options.emptyStroke,
      fill: options.emptyFill,
      lineWidth: options.emptyLineWidth,
      lineJoin: options.emptyLineJoin,
      boundsMethod: 'none' // optimization for faster creation and usage
    } );
    const o2 = _.clone( options );
    o2.value = 1;
    const backgroundStarShape = new StarShape( o2 );
    backgroundStar.setShape( backgroundStarShape );

    function getBounds() {
      return backgroundStarShape.bounds;
    }

    backgroundStar.computeShapeBounds = getBounds; // optimization - override bounds calculation to used pre-computed value

    this.addChild( backgroundStar );

    // add the foreground star
    if ( options.value !== 0 ) {
      const foregroundStar = new Path( new StarShape( o2 ), {
        stroke: options.filledStroke,
        fill: options.filledFill,
        lineWidth: options.filledLineWidth,
        lineJoin: options.filledLineJoin,
        boundsMethod: 'none' // optimization for faster creation and usage
      } );
      foregroundStar.computeShapeBounds = getBounds; // optimization - override bounds calculation to used pre-computed value
      foregroundStar.shape = new StarShape( o2 );

      // Apply a clipArea instead of actually adjusting the star's shape. This is faster for startup (potentially
      // important given the optimization documentation already in this file), and gives a cleaner appearance.
      // See https://github.com/phetsims/area-model-common/issues/131.
      if ( options.value !== 1 ) {
        const unstrokedBounds = backgroundStarShape.bounds;
        const overlySafeBounds = unstrokedBounds.dilated( options.filledLineWidth * 1.5 );
        foregroundStar.clipArea = Shape.bounds( overlySafeBounds.withMaxX( unstrokedBounds.left + options.value * unstrokedBounds.width ) );
      }
      this.addChild( foregroundStar );
    }

    this.mutate( options );
  }
}

sceneryPhet.register( 'StarNode', StarNode );
export default StarNode;