// Copyright 2002-2013, University of Colorado Boulder

/**
 * Scenery node that represents a single-ended arrow.
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // Imports
  var assert = require( 'ASSERT/assert' )( 'scenery-phet' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var Vector2 = require( 'DOT/Vector2' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  /**
   * @param {number} tailX
   * @param {number} tailY
   * @param {number} tipX
   * @param {number} tipY
   * @param {Object} options
   * @constructor
   */
  function ArrowNode( tailX, tailY, tipX, tipY, options ) {

    // default options
    options = _.extend(
      {
        headHeight: 10,
        headWidth: 10,
        tailWidth: 5,
        fill: 'black',
        stroke: 'black',
        lineWidth: 1
      }, options );

    // things you're likely to mess up, add more as needed
    assert && assert( options.headWidth > options.tailWidth );

    // shape is not an option that the client should be able to set
    options.shape = ArrowNode.createArrowShape( tailX, tailY, tipX, tipY, options.tailWidth, options.headWidth, options.headHeight );

    Path.call( this, options );
  }

  return inherit( Path, ArrowNode,

    //Instance methods & fields
    {},

    //Static methods & fields
    {
      // Function for creating arrow shape.  All parameters are of type number.
      createArrowShape: function( tailX, tailY, tipX, tipY, tailWidth, headWidth, headHeight ) {
        var arrowShape = new Shape();
        if ( tipX === tailX && tipY === tailY ) {
          return arrowShape;
        }
        var vector = new Vector2( tipX - tailX, tipY - tailY );
        var xHatUnit = vector.normalized();
        var yHatUnit = xHatUnit.rotated( Math.PI / 2 );
        var length = vector.magnitude();

        //Set up a coordinate frame that goes from the tail of the arrow to the tip.
        function getPoint( xHat, yHat ) {
          var x = xHatUnit.x * xHat + yHatUnit.x * yHat + tailX;
          var y = xHatUnit.y * xHat + yHatUnit.y * yHat + tailY;
          return new Vector2( x, y );
        }

        if ( headHeight > length / 2 ) {
          headHeight = length / 2;
        }

        var tailLength = length - headHeight;
        var points = [
          getPoint( 0, tailWidth / 2 ),
          getPoint( tailLength, tailWidth / 2 ),
          getPoint( tailLength, headWidth / 2 ),
          getPoint( length, 0 ),
          getPoint( tailLength, -headWidth / 2 ),
          getPoint( tailLength, -tailWidth / 2 ),
          getPoint( 0, -tailWidth / 2 )
        ];

        arrowShape.moveTo( points[0].x, points[0].y );
        var tail = _.tail( points );
        _.each( tail, function( element ) { arrowShape.lineTo( element.x, element.y ); } );
        arrowShape.close();

        return arrowShape;
      }
    } );
} );