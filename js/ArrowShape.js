// Copyright 2002-2013, University of Colorado Boulder

/**
 * An arrow shape, either single or double headed.
 *
 * @author John Blanco
 * @author Chris Malley
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Shape = require( 'KITE/Shape' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   *
   * @param {number} tailX
   * @param {number} tailY
   * @param {number} tipX
   * @param {number} tipY
   * @param {Object} [options]
   * @constructor
   */
  function ArrowShape( tailX, tailY, tipX, tipY, options ) {

    options = _.extend( {
      tailWidth: 5,
      headWidth: 10,
      headHeight: 10,
      doubleHead: false,
      isHeadDynamic: false,
      scaleTailToo: false,
      fractionalHeadHeight: 0.5 // head will be scaled when head size is less than fractionalHeadHeight * arrow length
    }, options );

    var thisShape = this;
    Shape.call( thisShape );

    if ( tipX !== tailX || tipY !== tailY ) {

      var vector = new Vector2( tipX - tailX, tipY - tailY );
      var xHatUnit = vector.normalized();
      var yHatUnit = xHatUnit.rotated( Math.PI / 2 );
      var length = vector.magnitude();

      // scale down the head if head is dynamic.
      var tempHeadHeight = options.headHeight;
      var tempHeadWidth = options.headWidth;
      var tempTailWidth = options.tailWidth;
      if ( options.isHeadDynamic ) {
        if ( length < options.headHeight / options.fractionalHeadHeight ) {
          tempHeadHeight = length * options.fractionalHeadHeight;
          if ( options.scaleTailToo ) {
            tempTailWidth = options.tailWidth * tempHeadHeight / options.headHeight;
            tempHeadWidth = options.headWidth * tempHeadHeight / options.headHeight;
          }
        }
        else {
          //nothing to do; headHeight is already large enough, and previously computed values will be correct.
        }
      }
      // otherwise, just make sure that head height is less than arrow length
      else {
        tempHeadHeight = Math.min( options.headHeight, options.doubleHead ? 0.35 * length : 0.99 * length );
      }

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
        points.push( getPoint( tempHeadHeight, tempHeadWidth / 2 ) );
        points.push( getPoint( tempHeadHeight, tempTailWidth / 2 ) );
      }
      else {
        points.push( getPoint( 0, tempTailWidth / 2 ) );
      }
      points.push( getPoint( length - tempHeadHeight, tempTailWidth / 2 ) );
      points.push( getPoint( length - tempHeadHeight, tempHeadWidth / 2 ) );
      points.push( getPoint( length, 0 ) );
      points.push( getPoint( length - tempHeadHeight, -tempHeadWidth / 2 ) );
      points.push( getPoint( length - tempHeadHeight, -tempTailWidth / 2 ) );
      if ( options.doubleHead ) {
        points.push( getPoint( tempHeadHeight, -tempTailWidth / 2 ) );
        points.push( getPoint( tempHeadHeight, -tempHeadWidth / 2 ) );
      }
      else {
        points.push( getPoint( 0, -tempTailWidth / 2 ) );
      }

      // Describe the shape
      thisShape.moveTo( points[ 0 ].x, points[ 0 ].y );
      var tail = _.tail( points );
      _.each( tail, function( element ) {
        thisShape.lineTo( element.x, element.y );
      } );
      thisShape.close();
    }
  }

  return inherit( Shape, ArrowShape );
} );
