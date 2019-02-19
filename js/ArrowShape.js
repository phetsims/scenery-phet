// Copyright 2013-2018, University of Colorado Boulder

/**
 * An arrow shape, either single or double headed.
 * ArrowShape has an optimization that allows you to reuse an array of Vector2.
 * The array will have 0 points if the tail and tip are the same point.
 *
 * @author John Blanco
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Aaron Davis
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var Shape = require( 'KITE/Shape' );
  var Tandem = require( 'TANDEM/Tandem' );
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

    Tandem.disallowTandem( options );

    var self = this;
    Shape.call( this );

    if ( tipX !== tailX || tipY !== tailY ) {

      var points = ArrowShape.getArrowShapePoints( tailX, tailY, tipX, tipY, [], options );

      // Describe the shape
      this.moveTo( points[ 0 ].x, points[ 0 ].y );
      var tail = _.tail( points );
      _.each( tail, function( element ) {
        self.lineTo( element.x, element.y );
      } );
      this.close();
    }
  }

  sceneryPhet.register( 'ArrowShape', ArrowShape );

  return inherit( Shape, ArrowShape, {}, {

    /**
     * This method is static so it can be used in ArrowShape as well as in ArrowNode.
     * @param {number} tailX
     * @param {number} tailY
     * @param {number} tipX
     * @param {number} tipY
     * @param {Vector2[]} shapePoints - if provided, values will be overwritten. This is to achieve
     *                                  high performance and is used by ArrowNode to avoid re-creating shapes.
     *                                  Tested this implementation vs the old one by creating hundreds of arrows and
     *                                  saw significant performance gains.
     * @param {Object} [options]
     * @returns {Array}
     * @static
     * @public
     */
    getArrowShapePoints: function( tailX, tailY, tipX, tipY, shapePoints, options ) {

      // default shapePoints to empty array if it isn't passed in
      if ( !shapePoints ) {
        shapePoints = [];
      }

      // if arrow has no length, it should have no points so that we don't attempt to draw anything
      if ( tipX === tailX && tipY === tailY ) {
        shapePoints.length = 0;
      }
      else {

        // The shape of the arrow will populate the shapePoints array
        var vector = new Vector2( tipX - tailX, tipY - tailY );
        var xHatUnit = vector.normalized();
        var yHatUnit = xHatUnit.rotated( Math.PI / 2 );
        var length = vector.magnitude;

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
  } );
} );
