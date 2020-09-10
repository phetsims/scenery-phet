// Copyright 2014-2020, University of Colorado Boulder

/**
 * CurvedArrowShape draws a single- or double-headed curved arrow.
 * Arrow heads are not curved, their tips are perpendicular to the ends of the arrow tail.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Vector2 from '../../dot/js/Vector2.js';
import Shape from '../../kite/js/Shape.js';
import merge from '../../phet-core/js/merge.js';
import sceneryPhet from './sceneryPhet.js';

class CurvedArrowShape extends Shape {

  /**
   * @param {number} radius radius at the center of the arrow's tail
   * @param {number} startAngle starting angle, in radians (at tail, or optional 2nd head)
   * @param {number} endAngle end angle, in radians (at head of arrow)
   * @param {Object} [options]
   */
  constructor( radius, startAngle, endAngle, options ) {

    options = merge( {
      doubleHead: false, // false = single head at endAngle, true = heads at startAngle and endAngle
      headWidth: 10,
      headHeight: 10,
      tailWidth: 5
    }, options );

    super();

    // Points that define the base of an arrow head. 'inner' is closer to the center of the circle, 'outer' is farther away.
    let baseInnerX;
    let baseInnerY;
    let baseOuterX;
    let baseOuterY;

    // optional head at startAngle
    if ( options.doubleHead ) {

      // base of the arrow head at startAngle
      baseInnerX = Math.cos( startAngle ) * ( radius - options.headWidth / 2 );
      baseInnerY = Math.sin( startAngle ) * ( radius - options.headWidth / 2 );
      baseOuterX = Math.cos( startAngle ) * ( radius + options.headWidth / 2 );
      baseOuterY = Math.sin( startAngle ) * ( radius + options.headWidth / 2 );

      // tip of the arrow head at startAngle
      const startTip = computePerpendicularPoint( baseOuterX, baseOuterY, baseInnerX, baseInnerY, options.headHeight );

      // head at startAngle
      this.moveTo( baseInnerX, baseInnerY )
        .lineTo( startTip.x, startTip.y )
        .lineTo( baseOuterX, baseOuterY );
    }

    // outer arc from startAngle to endAngle
    this.arc( 0, 0, radius + options.tailWidth / 2, startAngle, endAngle, options.anticlockwise );

    // base of the arrow head at endAngle
    baseInnerX = Math.cos( endAngle ) * ( radius - options.headWidth / 2 );
    baseInnerY = Math.sin( endAngle ) * ( radius - options.headWidth / 2 );
    baseOuterX = Math.cos( endAngle ) * ( radius + options.headWidth / 2 );
    baseOuterY = Math.sin( endAngle ) * ( radius + options.headWidth / 2 );

    // tip of the arrow head at endAngle
    const endTip = computePerpendicularPoint( baseInnerX, baseInnerY, baseOuterX, baseOuterY, options.headHeight );

    // arrow head at endAngle
    this.lineTo( baseOuterX, baseOuterY )
      .lineTo( endTip.x, endTip.y )
      .lineTo( baseInnerX, baseInnerY );

    // inner arc from endAngle to startAngle
    this.arc( 0, 0, radius - options.tailWidth / 2, endAngle, startAngle, !options.anticlockwise );

    // Workaround for https://github.com/phetsims/scenery/issues/214 (Firefox-specific path rendering issue)
    this.lineTo( Math.cos( startAngle ) * radius, Math.sin( startAngle ) * radius + 0.00001 );

    this.close();
  }
}

/**
 * This is a general algorithm, used herein to compute the point for an arrow's tip.
 * Given 2 points that define a line segment (the arrow's base), compute the point (the tip) that
 * is a specified distance away from a perpendicular line that runs through the center point
 * of the line segment.
 *
 * @param x1
 * @param y1
 * @param x2
 * @param y2
 * @param distance
 * @returns {Vector2}
 */
const computePerpendicularPoint = function( x1, y1, x2, y2, distance ) {
  const dx = x1 - x2;
  const dy = y1 - y2;
  const r = Math.sqrt( dx * dx + dy * dy );

  // midpoint + distance * unitVector
  const x = ( x1 + x2 ) / 2 + ( distance * dy / r );
  const y = ( y1 + y2 ) / 2 - ( distance * dx / r );
  return new Vector2( x, y );
};

sceneryPhet.register( 'CurvedArrowShape', CurvedArrowShape );
export default CurvedArrowShape;