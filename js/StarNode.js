//  Copyright 2002-2014, University of Colorado Boulder

/**
 * Star that fills in from left to right.  Can be used in games to show the score.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // imports
  var Dimension2 = require( 'DOT/Dimension2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var Vector2 = require( 'DOT/Vector2' );
  var Util = require( 'DOT/Util' );
  var Line = require( 'KITE/segments/Line' );

  /**
   * @param options
   * @constructor
   */
  function StarNode( options ) {

    options = _.extend( {

      //The amount the star is filled.  0=empty, 1=full
      value: 1,

      //Distance from the center to the tip of a star limb
      outerRadius: 20,

      //Distance from the center to the closest point on the exterior of the star.  Sets the "thickness" of the star limbs
      innerRadius: 10,

      // a bold yellow indeed
      fill: '#fcff03',

      stroke: 'black',
      lineWidth: 3,
      lineJoin: 'round'
    }, options );

    var points = [];
    for ( var i = 0; i < 10; i++ ) {

      //Start at the top
      var angle = i / 10 * Math.PI * 2 - Math.PI / 2;
      var radius = i % 2 === 0 ? options.outerRadius : options.innerRadius;
      var x = radius * Math.cos( angle );
      var y = radius * Math.sin( angle );
      points.push( new Vector2( x, y ) );
    }

    //Compute max width for filling algorithm.  Do this a fast/ugly way in case we ever animate these values
    var minX = points[0].x;
    var maxX = points[0].x;
    for ( i = 1; i < points.length; i++ ) {
      if ( points[i].x < minX ) {
        minX = points[i].x;
      }
      if ( points[i].x > maxX ) {
        maxX = points[i].x;
      }
    }

    var starWidth = maxX - minX;
    var fillPosition = options.value * starWidth + minX;

    //starting from the left, find the first intersection point for each line segment with a vertical line
    var verticalLine = new Line( new Vector2( fillPosition, -options.outerRadius * 2 ), new Vector2( fillPosition, options.outerRadius * 2 ) );
    var index = 8;
    var toString = function( segment ) {
      return segment.start.toString() + ' -> ' + segment.end.toString();
    };

    var segment = new Line( new Vector2( points[index].x, points[index].y ), new Vector2( points[index + 1].x, points[index + 1].y ) );
//    console.log( toString( verticalLine ), ' x ', toString( segment ) );
    var intersection = Util.lineSegmentIntersection( segment.start.x, segment.start.y, segment.end.x, segment.end.y, verticalLine.start.x, verticalLine.start.y, verticalLine.end.x, verticalLine.end.y );
    console.log( intersection );

    var getIntersection = function( segment ) {
      return Util.lineSegmentIntersection( segment.start.x, segment.start.y, segment.end.x, segment.end.y, verticalLine.start.x, verticalLine.start.y, verticalLine.end.x, verticalLine.end.y );
    };

    var segment = function( a, b ) {
      return new Line( new Vector2( points[a].x, points[a].y ), new Vector2( points[b].x, points[b].y ) );
    };

    var topSegments = [segment( 8, 9 ), segment( 9, 0 ), segment( 0, 1 ), segment( 1, 2 )];
    var bottomSegments = [segment( 8, 7 ), segment( 7, 6 ), segment( 6, 5 ), segment( 5, 4 ), segment( 4, 3 ), segment( 3, 2 )];
//    lineSegmentIntersection: function( x1, y1, x2, y2, x3, y3, x4, y4 ) {

    //trace path from top left clockwise

    var topIntersectionSegment = getIntersection( topSegments[0] ) || getIntersection( topSegments[1] ) || getIntersection( topSegments[2] ) || getIntersection( topSegments[3] );
    var bottomIntersectionSegment = getIntersection( bottomSegments[0] ) || getIntersection( bottomSegments[1] ) || getIntersection( bottomSegments[2] ) || getIntersection( bottomSegments[3] ) || getIntersection( bottomSegments[4] ) || getIntersection( bottomSegments[5] );

    var lightedPoints = [new Vector2( points[8].x, points[8].y )];
    lightedPoints.push( topIntersectionSegment );
    lightedPoints.push( bottomIntersectionSegment );

    var pointsToShape = function( points ) {
      var shape = new Shape().moveTo( points[0].x, points[0].y );
      for ( i = 1; i < points.length; i++ ) {
        shape.lineTo( points[i].x, points[i].y );
      }
      shape.close();
      return shape;
    };

    Path.call( this, pointsToShape( points ), options );

    this.addChild( new Path( new Shape().moveTo( verticalLine.start.x, verticalLine.start.y ).lineTo( verticalLine.end.x, verticalLine.end.y ), {stroke: 'blue'} ) );

    this.addChild( new Path( pointsToShape( lightedPoints ), {fill: 'green', stroke: 'red', lineWidth: 3} ) );
  }

  return inherit( Path, StarNode );
} );