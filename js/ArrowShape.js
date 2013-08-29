// Copyright 2002-2013, University of Colorado Boulder

/**
 * Single-headed arrow shape.
 *
 * @author John Blanco
 * @author Chris Malley
 */
define( function( require ) {
  'use strict';

  // imports
  var inherit = require( 'PHET_CORE/inherit' );
  var Shape = require( 'KITE/Shape' );
  var Vector2 = require( 'DOT/Vector2' );

  function ArrowShape( tailX, tailY, tipX, tipY, tailWidth, headWidth, headHeight ) {

    var thisShape = this;
    Shape.call( thisShape );

    if ( tipX !== tailX || tipY !== tailY ) {

      var vector = new Vector2( tipX - tailX, tipY - tailY );
      var xHatUnit = vector.normalized();
      var yHatUnit = xHatUnit.rotated( Math.PI / 2 );
      var length = vector.magnitude();
      if ( headHeight > length / 2 ) {
        headHeight = length / 2;
      }
      var tailLength = length - headHeight;

      // Set up a coordinate frame that goes from the tail of the arrow to the tip.
      var getPoint = function( xHat, yHat ) {
        var x = xHatUnit.x * xHat + yHatUnit.x * yHat + tailX;
        var y = xHatUnit.y * xHat + yHatUnit.y * yHat + tailY;
        return new Vector2( x, y );
      };

      var points = [
        getPoint( 0, tailWidth / 2 ),
        getPoint( tailLength, tailWidth / 2 ),
        getPoint( tailLength, headWidth / 2 ),
        getPoint( length, 0 ),
        getPoint( tailLength, -headWidth / 2 ),
        getPoint( tailLength, -tailWidth / 2 ),
        getPoint( 0, -tailWidth / 2 )
      ];

      thisShape.moveTo( points[0].x, points[0].y );
      var tail = _.tail( points );
      _.each( tail, function( element ) {
        thisShape.lineTo( element.x, element.y );
      } );
      thisShape.close();
    }
  }

  return inherit( Shape, ArrowShape );
} );
