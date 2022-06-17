// Copyright 2014-2022, University of Colorado Boulder

/**
 * Star that fills in from left to right.  Can be used in games to show the score.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author John Blanco
 */

// @ts-nocheck

import { Shape } from '../../kite/js/imports.js';
import merge from '../../phet-core/js/merge.js';
import { Node } from '../../scenery/js/imports.js';
import { Path } from '../../scenery/js/imports.js';
import sceneryPhet from './sceneryPhet.js';
import StarShape from './StarShape.js';

class StarNode extends Node {

  /**
   * @param {Object} [options] see comments in the constructor for options parameter values
   */
  constructor( options ) {

    options = merge( {

      value: 1,

      // Fill parameters for the part of the star that is filled in.  Should be bold and gold.
      filledFill: '#fcff03',
      filledStroke: 'black',
      filledLineWidth: 1.5,
      filledLineJoin: 'round',

      // Fill parameters for the part of the star that is unfilled.  Should be bland.
      emptyFill: '#e1e1e1', //pretty gray
      emptyStroke: '#d3d1d1 ', //darker gray than the fill, but still pretty faint
      emptyLineWidth: 1.5,
      emptyLineJoin: 'round',

      // Options that are passed through to the star shape, see StarShape for details.
      starShapeOptions: {}
    }, options );

    super();

    // Add the gray star behind the filled star, so it will look like it fills in.
    const backgroundStar = new OptimizedStarPath( {
      stroke: options.emptyStroke,
      fill: options.emptyFill,
      lineWidth: options.emptyLineWidth,
      lineJoin: options.emptyLineJoin,
      starShapeOptions: options.starShapeOptions

    } );

    this.addChild( backgroundStar );

    // Add the foreground star.
    if ( options.value > 0 ) {
      const foregroundStar = new OptimizedStarPath( {
        stroke: options.filledStroke,
        fill: options.filledFill,
        lineWidth: options.filledLineWidth,
        lineJoin: options.filledLineJoin
      } );

      // Apply a clipArea instead of actually adjusting the star's shape. This is faster for startup (potentially
      // important given the optimization documentation already in this file), and gives a cleaner appearance.
      // See https://github.com/phetsims/area-model-common/issues/131.
      if ( options.value < 1 ) {
        const unstrokedBounds = foregroundStar.starShapeBounds;
        const overlySafeBounds = unstrokedBounds.dilated( options.filledLineWidth * 1.5 );
        foregroundStar.clipArea = Shape.bounds(
          overlySafeBounds.withMaxX( unstrokedBounds.left + options.value * unstrokedBounds.width )
        );
      }
      this.addChild( foregroundStar );
    }

    this.mutate( options );
  }
}

class OptimizedStarPath extends Path {
  constructor( options ) {

    // parameter checking
    assert && assert( options.boundsMethod === undefined, 'boundsMethod should not be specified, this class will do it' );

    // optimization for faster creation and usage
    options.boundsMethod = 'none';

    // Create the shape that will be used for the path and the bounds.
    const starShape = new StarShape( options.starShapeOptions );

    super( starShape, options );

    // Pre-compute the bounds as an optimization.
    this.starShapeBounds = starShape.getBounds();
  }

  /**
   * Override the method used to compute the bounds to use the pre-computed value.
   * @returns {Bounds2}
   * @public
   */
  computeShapeBounds() {
    return this.starShapeBounds;
  }
}

sceneryPhet.register( 'StarNode', StarNode );
export default StarNode;