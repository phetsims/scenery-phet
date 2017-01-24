// Copyright 2014-2015, University of Colorado Boulder

/**
 * Star shape that fills in from left to right.  Can be used in games to show the score.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Shape = require( 'KITE/Shape' );
  var Vector2 = require( 'DOT/Vector2' );
  var Util = require( 'DOT/Util' );
  var Line = require( 'KITE/segments/Line' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var Tandem = require( 'TANDEM/Tandem' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function StarShape( options ) {

    options = _.extend( {

      //The amount the star is filled.  0=empty, 1=full
      value: 1,

      //Distance from the center to the tip of a star limb
      outerRadius: 15,

      //Distance from the center to the closest point on the exterior of the star.  Sets the "thickness" of the star limbs
      innerRadius: 7.5
    }, options );

    Tandem.disallowTandem( options );

    Shape.call( this );

    //If the value is zero, then the star should be completely empty.
    if ( options.value === 0 ) {
      return;
    }

    //Create the points for a filled-in star, which will be used to compute the geometry of a partial star.
    var points = [];
    var i = 0;
    for ( i = 0; i < 10; i++ ) {

      //Start at the top and proceed clockwise
      var angle = i / 10 * Math.PI * 2 - Math.PI / 2;
      var radius = i % 2 === 0 ? options.outerRadius : options.innerRadius;
      var x = radius * Math.cos( angle );
      var y = radius * Math.sin( angle );
      points.push( new Vector2( x, y ) );
    }

    //If the value is 1, the star should be completely filled.  So return early as a shortcut to computing all the rest of the geometry.
    if ( options.value === 1 ) {
      this.moveTo( points[ 0 ].x, points[ 0 ].y );
      for ( i = 1; i < points.length; i++ ) {
        this.lineTo( points[ i ].x, points[ i ].y );
      }
      this.close();
      return;
    }

    //Compute max width for filling algorithm.  Do this a fast/ugly way in case we ever animate these values
    //The star fills from left to right, so compute the distance across the star in the x-direction.
    var minX = points[ 0 ].x;
    var maxX = points[ 0 ].x;
    for ( i = 1; i < points.length; i++ ) {
      if ( points[ i ].x < minX ) {
        minX = points[ i ].x;
      }
      if ( points[ i ].x > maxX ) {
        maxX = points[ i ].x;
      }
    }

    var starWidth = maxX - minX;
    var fillPosition = options.value * starWidth + minX;

    //starting from the left, find the first intersection point for each line segment with a vertical line
    var verticalLine = new Line( new Vector2( fillPosition, -options.outerRadius * 2 ), new Vector2( fillPosition, options.outerRadius * 2 ) );

    //Get the intersection between the star segment and the vertical line
    var getIntersection = function( segment ) {
      return Util.lineSegmentIntersection( segment.start.x, segment.start.y, segment.end.x, segment.end.y, verticalLine.start.x, verticalLine.start.y, verticalLine.end.x, verticalLine.end.y );
    };

    //Return a line segment from the ath point to the bth point.
    var segment = function( a, b ) {
      return new Line( new Vector2( points[ a ].x, points[ a ].y ), new Vector2( points[ b ].x, points[ b ].y ) );
    };

    var topSegments = [ segment( 8, 9 ), segment( 9, 0 ), segment( 0, 1 ), segment( 1, 2 ) ];
    var bottomSegments = [ segment( 8, 7 ), segment( 7, 6 ), segment( 6, 5 ), segment( 5, 4 ), segment( 4, 3 ), segment( 3, 2 ) ];

    //trace path from top right counter-clockwise
    //First compute the top path
    var intersection = null;
    var highlightedPoints = [];
    var intersectedTop = false;
    for ( i = topSegments.length - 1; i >= 0; i-- ) {
      var topSegment = topSegments[ i ];
      intersection = getIntersection( topSegment );
      if ( intersection ) {
        highlightedPoints.push( intersection );
        intersectedTop = true;
      }
      if ( intersectedTop ) {
        highlightedPoints.push( topSegment.start );
      }
    }

    //trace path from top left clockwise
    //First compute the top path
    for ( i = 0; i < bottomSegments.length; i++ ) {
      var bottomSegment = bottomSegments[ i ];
      intersection = getIntersection( bottomSegment );
      if ( intersection ) {
        highlightedPoints.push( intersection );
        break;
      }
      else {
        highlightedPoints.push( bottomSegment.end );
      }
    }

    //Fill in the selected points
    this.moveTo( highlightedPoints[ 0 ].x, highlightedPoints[ 0 ].y );
    for ( i = 1; i < highlightedPoints.length; i++ ) {
      this.lineTo( highlightedPoints[ i ].x, highlightedPoints[ i ].y );
    }
  }

  sceneryPhet.register( 'StarShape', StarShape );

  return inherit( Shape, StarShape );
} );