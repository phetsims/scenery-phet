// Copyright 2014-2022, University of Colorado Boulder

/**
 * Star that fills in from left to right.  This was originally created for score indicators in games, but it may have
 * other uses.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import Bounds2 from '../../dot/js/Bounds2.js';
import { LineJoin, Shape } from '../../kite/js/imports.js';
import optionize from '../../phet-core/js/optionize.js';
import { TPaint, Node, NodeOptions, Path, PathOptions } from '../../scenery/js/imports.js';
import sceneryPhet from './sceneryPhet.js';
import StarShape, { StarShapeOptions } from './StarShape.js';

type SelfOptions = {

  // The value, from 0 to 1, represented by this StarNode.  A value of 0 shows a completely unfilled star, a value of
  // 1 shows a completely filled star.
  value?: number;

  // Options that control the appearance of the unfilled (background) star.  Should be bland.
  emptyFill?: TPaint;
  emptyStroke?: TPaint;
  emptyLineWidth?: number;
  emptyLineJoin?: LineJoin;

  // Options that control the appearance of the filled (foreground) star.  Should be bold and eye catching.
  filledFill?: TPaint;
  filledStroke?: TPaint;
  filledLineWidth?: number;
  filledLineJoin?: LineJoin;

  // Options that are passed to the star shape to control things like its size and number of points.
  starShapeOptions?: StarShapeOptions;
};
export type StarNodeOptions = SelfOptions & NodeOptions;

class StarNode extends Node {

  public constructor( providedOptions?: StarNodeOptions ) {

    const options = optionize<StarNodeOptions, SelfOptions, NodeOptions>()( {
      value: 1,
      emptyFill: '#e1e1e1', //pretty gray
      emptyStroke: '#d3d1d1 ', //darker gray than the fill, but still pretty faint
      emptyLineWidth: 1.5,
      emptyLineJoin: 'round',
      filledFill: '#fcff03',
      filledStroke: 'black',
      filledLineWidth: 1.5,
      filledLineJoin: 'round',
      starShapeOptions: {}
    }, providedOptions );

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

    // Add the foreground star, unless the value is too low to warrant it.
    if ( options.value > 0 ) {
      const foregroundStar = new OptimizedStarPath( {
        stroke: options.filledStroke,
        fill: options.filledFill,
        lineWidth: options.filledLineWidth,
        lineJoin: options.filledLineJoin,
        starShapeOptions: options.starShapeOptions
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

type OptimizedStarPathSelfOptions = {
  starShapeOptions?: StarShapeOptions;
};
type OptimizedStarPathOptions = OptimizedStarPathSelfOptions & PathOptions;

/**
 * Internal class for the path that represents that stars.  This exists primarily to provide something that can provide
 * the bounds in a highly optimized way, since otherwise they are fairly computational expensive to compute.
 */
class OptimizedStarPath extends Path {

  // pre-computed bounds for this node, used as an optimization to make bounds retrieval very fast
  public readonly starShapeBounds: Bounds2;

  public constructor( providedOptions?: OptimizedStarPathOptions ) {

    const options = optionize<OptimizedStarPathOptions, OptimizedStarPathSelfOptions, PathOptions>()( {
      starShapeOptions: {}
    }, providedOptions );

    // optimization for faster creation and usage
    options.boundsMethod = 'none';

    // Create the shape that will be used for the path and the bounds.
    const starShape = new StarShape( options.starShapeOptions );

    super( starShape, options );

    // Pre-compute the bounds as an optimization.
    this.starShapeBounds = starShape.getBounds();
  }

  /**
   * override for the method used to compute the bounds, uses a pre-computed value
   */
  public override computeShapeBounds(): Bounds2 {
    return this.starShapeBounds;
  }
}

sceneryPhet.register( 'StarNode', StarNode );
export default StarNode;