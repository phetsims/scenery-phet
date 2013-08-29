// Copyright 2002-2013, University of Colorado Boulder

/**
 * An arrow shape, either single or double headed.
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

  function ArrowShape( tailX, tailY, tipX, tipY, options ) {

    options = _.extend( {
      tailWidth: 5,
      headWidth: 10,
      headHeight: 10,
      doubleHead: false
    }, options );

    var thisShape = this;
    Shape.call( thisShape );

    if ( tipX !== tailX || tipY !== tailY ) {

      var vector = new Vector2( tipX - tailX, tipY - tailY );
      var xHatUnit = vector.normalized();
      var yHatUnit = xHatUnit.rotated( Math.PI / 2 );
      var length = vector.magnitude();

      // limit head height
      options.headHeight = Math.min( options.headHeight, options.doubleHead ? 0.35 * length : 0.5 * length );

      // Set up a coordinate frame that goes from the tail of the arrow to the tip.
      var getPoint = function( xHat, yHat ) {
        var x = xHatUnit.x * xHat + yHatUnit.x * yHat + tailX;
        var y = xHatUnit.y * xHat + yHatUnit.y * yHat + tailY;
        return new Vector2( x, y );
      };

      // Compute points for single- or double-headed arrow
      var points = [];
      if ( options.doubleHead ) {
        points.push( getPoint( 0, 0 ) );
        points.push( getPoint( options.headHeight, options.headWidth / 2 ) );
        points.push( getPoint( options.headHeight, options.tailWidth / 2 ) );
      }
      else {
        points.push( getPoint( 0, options.tailWidth / 2 ) );
      }
      points.push( getPoint( length - options.headHeight, options.tailWidth / 2 ) );
      points.push( getPoint( length - options.headHeight, options.headWidth / 2 ) );
      points.push( getPoint( length, 0 ) );
      points.push( getPoint( length - options.headHeight, -options.headWidth / 2 ) );
      points.push( getPoint( length - options.headHeight, -options.tailWidth / 2 ) );
      if ( options.doubleHead ) {
        points.push( getPoint( options.headHeight, -options.tailWidth / 2 ) );
        points.push( getPoint( options.headHeight, -options.headWidth / 2 ) );
      }
      else {
        points.push( getPoint( 0, -options.tailWidth / 2 ) );
      }

      // Describe the shape
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
