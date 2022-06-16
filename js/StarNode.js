// Copyright 2014-2022, University of Colorado Boulder

/**
 * Star that fills in from left to right.  Can be used in games to show the score.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author John Blanco
 */

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

    // Create the shape that will be used as the basis for both the background and foreground star nodes.
    const starShape = new StarShape( options.starShapeOptions );

    // Add the gray star behind the filled star, so it will look like it fills in.
    const backgroundStar = new Path( starShape, {
      stroke: options.emptyStroke,
      fill: options.emptyFill,
      lineWidth: options.emptyLineWidth,
      lineJoin: options.emptyLineJoin,
      boundsMethod: 'none' // optimization for faster creation and usage
    } );

    function getBounds() {
      return starShape.bounds;
    }

    backgroundStar.computeShapeBounds = getBounds; // optimization - override bounds calculation to used pre-computed value

    this.addChild( backgroundStar );

    // Add the foreground star.
    if ( options.value !== 0 ) {
      const foregroundStar = new Path( starShape, {
        stroke: options.filledStroke,
        fill: options.filledFill,
        lineWidth: options.filledLineWidth,
        lineJoin: options.filledLineJoin,
        boundsMethod: 'none' // optimization for faster creation and usage
      } );
      foregroundStar.computeShapeBounds = getBounds; // optimization - override bounds calculation to used pre-computed value

      // Apply a clipArea instead of actually adjusting the star's shape. This is faster for startup (potentially
      // important given the optimization documentation already in this file), and gives a cleaner appearance.
      // See https://github.com/phetsims/area-model-common/issues/131.
      if ( options.value !== 1 ) {
        const unstrokedBounds = starShape.bounds;
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