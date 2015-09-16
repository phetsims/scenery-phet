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
    Shape.call( this );

    if ( tipX !== tailX || tipY !== tailY ) {

      var points = ArrowShape.getArrowShapePoints( tailX, tailY, tipX, tipY, null, options );

      // Describe the shape
      this.moveTo( points[ 0 ].x, points[ 0 ].y );
      var tail = _.tail( points );
      _.each( tail, function( element ) {
        thisShape.lineTo( element.x, element.y );
      } );
      this.close();
    }
  }

  return inherit( Shape, ArrowShape, {}, {

    /**
     * @private
     * @param tailX
     * @param tailY
     * @param tipX
     * @param tipY
     * @param {Vector2[]|null} shapePoints - if provided, values will be overwritten.  This is to achieve
     *                                     - high performance and is used by ArrowNode to avoid re-creating shapes
     * @param options
     * @returns {Array}
     */
    getArrowShapePoints: function( tailX, tailY, tipX, tipY, shapePoints, options ) {

      var numberPoints = options.doubleHead ? 10 : 7;
      if ( !shapePoints ) {

        shapePoints = _.times( numberPoints, function() {return new Vector2();} );
      }

      assert && assert( shapePoints.length === numberPoints, 'wrong number of shape points' );

      var vector = new Vector2( tipX - tailX, tipY - tailY );
      var xHatUnit = vector.normalized();
      var yHatUnit = xHatUnit.rotated( Math.PI / 2 );
      var length = vector.magnitude();

      // scale down the head if head is dynamic.
      var headWidth = options.headWidth;
      var headHeight = options.headHeight;
      var tailWidth = options.tailWidth;
      if ( options.isHeadDynamic ) {
        if ( length < options.headHeight / options.fractionalHeadHeight ) {
          headHeight = length * options.fractionalHeadHeight;
          if ( options.scaleTailToo ) {
            tailWidth = options.tailWidth * headHeight / options.headHeight;
            headWidth = options.headWidth * headHeight / options.headHeight;
          }
        }
        else {
          // nothing to do; headHeight is already large enough, and previously computed values will be correct.
        }
      }

      // otherwise, just make sure that head height is less than arrow length
      else {
        headHeight = Math.min( options.headHeight, options.doubleHead ? 0.35 * length : 0.99 * length );
      }

      var index = 0;

      // Set up a coordinate frame that goes from the tail of the arrow to the tip.
      var addPoint = function( xHat, yHat ) {
        var x = xHatUnit.x * xHat + yHatUnit.x * yHat + tailX;
        var y = xHatUnit.y * xHat + yHatUnit.y * yHat + tailY;
        shapePoints[ index ].x = x;
        shapePoints[ index ].y = y;
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

      return shapePoints;
    }
  } );
} );
