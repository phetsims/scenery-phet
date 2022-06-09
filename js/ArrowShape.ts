// Copyright 2013-2022, University of Colorado Boulder

/**
 * An arrow shape, either single or double headed.
 * ArrowShape has an optimization that allows you to reuse an array of Vector2.
 * The array will have 0 points if the tail and tip are the same point.
 *
 * @author John Blanco
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Aaron Davis
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Vector2 from '../../dot/js/Vector2.js';
import { Shape } from '../../kite/js/imports.js';
import optionize from '../../phet-core/js/optionize.js';
import sceneryPhet from './sceneryPhet.js';

export type ArrowShapeOptions = {
  tailWidth?: number;
  headWidth?: number;
  headHeight?: number;
  fractionalHeadHeight?: number; // head will be scaled when headHeight is greater than fractionalHeadHeight * arrow length
  doubleHead?: boolean; // determines whether the arrow has a head at both ends of the tail
  isHeadDynamic?: boolean; // determines whether to scale down the arrow head height for fractionalHeadHeight constraint
  scaleTailToo?: boolean;  // determines whether to also scale arrow head width and tail width when scaling head height
};

export default class ArrowShape extends Shape {

  public constructor( tailX: number, tailY: number, tipX: number, tipY: number, providedOptions: ArrowShapeOptions ) {

    super();

    if ( tipX !== tailX || tipY !== tailY ) {

      const points = ArrowShape.getArrowShapePoints( tailX, tailY, tipX, tipY, [], providedOptions );

      // Describe the shape
      this.moveTo( points[ 0 ].x, points[ 0 ].y );
      const tail = _.tail( points );
      _.each( tail, ( point: Vector2 ) => this.lineTo( point.x, point.y ) );
      this.close();
    }
  }

  /**
   * This method is static so it can be used in ArrowShape as well as in ArrowNode.  If the tail and tip are at the
   * same position, there are no points and the arrow will not be shown.
   * @param tailX
   * @param tailY
   * @param tipX
   * @param tipY
   * @param shapePoints - if provided, values will be overwritten. This is to achieve high performance and is used
   *   by ArrowNode to avoid re-creating shapes. Tested this implementation vs the old one by creating hundreds of
   *   arrows and saw significant performance gains.
   * @param providedOptions
   */
  public static getArrowShapePoints( tailX: number, tailY: number, tipX: number, tipY: number, shapePoints: Vector2[],
                                     providedOptions?: ArrowShapeOptions ): Vector2[] {

    const options = optionize<ArrowShapeOptions>()( {

      // ArrowShapeOptions
      tailWidth: 5,
      headWidth: 10,
      headHeight: 10,
      fractionalHeadHeight: 0.5,
      doubleHead: false,
      isHeadDynamic: false,
      scaleTailToo: false
    }, providedOptions );

    // default shapePoints to empty array if it isn't passed in
    if ( !shapePoints ) {
      shapePoints = [];
    }

    if ( tipX === tailX && tipY === tailY ) {

      // if arrow has no length, it should have no points so that we don't attempt to draw anything
      shapePoints.length = 0;
    }
    else {

      // create a vector representation of the arrow
      const vector = new Vector2( tipX - tailX, tipY - tailY );
      const length = vector.magnitude;

      // start with the dimensions specified in options
      let headWidth = options.headWidth;
      let headHeight = options.headHeight;
      let tailWidth = options.tailWidth;

      // handle scaling of the head and tail
      if ( options.isHeadDynamic ) {

        const maxHeadHeight = options.fractionalHeadHeight * length;

        // scale down the head height if it exceeds the max
        if ( options.headHeight > maxHeadHeight ) {
          headHeight = maxHeadHeight;

          // optionally scale down the head width and tail width
          if ( options.scaleTailToo ) {
            headWidth = options.headWidth * headHeight / options.headHeight;
            tailWidth = options.tailWidth * headHeight / options.headHeight;
          }
        }
      }
      else {

        // otherwise, just make sure that head height is less than arrow length
        headHeight = Math.min( options.headHeight, options.doubleHead ? 0.35 * length : 0.99 * length );
      }

      // Index into shapePoints, incremented each time addPoint is called.
      let index = 0;

      // Set up a coordinate frame that goes from the tail of the arrow to the tip.
      const xHatUnit = vector.normalized();
      const yHatUnit = xHatUnit.rotated( Math.PI / 2 );

      // Function to add a point to shapePoints
      const addPoint = function( xHat: number, yHat: number ) {
        const x = xHatUnit.x * xHat + yHatUnit.x * yHat + tailX;
        const y = xHatUnit.y * xHat + yHatUnit.y * yHat + tailY;
        if ( shapePoints[ index ] ) {
          shapePoints[ index ].x = x;
          shapePoints[ index ].y = y;
        }
        else {
          shapePoints.push( new Vector2( x, y ) );
        }
        index++;
      };

      // Compute points for single- or double-headed arrow
      if ( options.doubleHead ) {
        addPoint( 0, 0 );
        addPoint( headHeight, headWidth / 2 );
        addPoint( headHeight, tailWidth / 2 );
      }
      else {
        addPoint( 0, tailWidth / 2 );
      }
      addPoint( length - headHeight, tailWidth / 2 );
      addPoint( length - headHeight, headWidth / 2 );
      addPoint( length, 0 );
      addPoint( length - headHeight, -headWidth / 2 );
      addPoint( length - headHeight, -tailWidth / 2 );
      if ( options.doubleHead ) {
        addPoint( headHeight, -tailWidth / 2 );
        addPoint( headHeight, -headWidth / 2 );
      }
      else {
        addPoint( 0, -tailWidth / 2 );
      }

      if ( index < shapePoints.length ) {
        shapePoints.length = index;
      }
    }

    return shapePoints;
  }
}

sceneryPhet.register( 'ArrowShape', ArrowShape );