// Copyright 2014-2017, University of Colorado Boulder

/**
 * A single- or double-headed curved arrow.
 * Arrow heads are not curved, their tips are perpendicular to the ends of the arrow tail.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var Shape = require( 'KITE/Shape' );
  var Vector2 = require( 'DOT/Vector2' );

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
  var computePerpendicularPoint = function( x1, y1, x2, y2, distance ) {
    var dx = x1 - x2;
    var dy = y1 - y2;
    var r = Math.sqrt( dx * dx + dy * dy );
    // midpoint + distance * unitVector
    var x = ( x1 + x2 ) / 2 + ( distance * dy / r );
    var y = ( y1 + y2 ) / 2 - ( distance * dx / r );
    return new Vector2( x, y );
  };

  /**
   * @param {number} radius radius at the center of the arrow's tail
   * @param {number} startAngle starting angle, in radians (at tail, or optional 2nd head)
   * @param {number} endAngle end angle, in radians (at head of arrow)
   * @param {Object} [options]
   * @constructor
   */
  function CurvedArrowShape( radius, startAngle, endAngle, options ) {
    options = _.extend( {
      doubleHead: false, // false = single head at endAngle, true = heads at startAngle and endAngle
      headWidth: 10,
      headHeight: 10,
      tailWidth: 5
    }, options );

    Shape.call( this );

    // Points that define the base of an arrow head. 'inner' is closer to the center of the circle, 'outer' is farther away.
    var baseInnerX;
    var baseInnerY;
    var baseOuterX;
    var baseOuterY;

    // optional head at startAngle
    if ( options.doubleHead ) {

      // base of the arrow head at startAngle
      baseInnerX = Math.cos( startAngle ) * ( radius - options.headWidth / 2 );
      baseInnerY = Math.sin( startAngle ) * ( radius - options.headWidth / 2 );
      baseOuterX = Math.cos( startAngle ) * ( radius + options.headWidth / 2 );
      baseOuterY = Math.sin( startAngle ) * ( radius + options.headWidth / 2 );

      // tip of the arrow head at startAngle
      var startTip = computePerpendicularPoint( baseOuterX, baseOuterY, baseInnerX, baseInnerY, options.headHeight );

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
    var endTip = computePerpendicularPoint( baseInnerX, baseInnerY, baseOuterX, baseOuterY, options.headHeight );

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

  sceneryPhet.register( 'CurvedArrowShape', CurvedArrowShape );

  return inherit( Shape, CurvedArrowShape );
} );
