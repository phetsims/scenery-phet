// Copyright 2013, University of Colorado

/**
 * Scenery node that represents a single-ended arrow.
 */
define( function( require ) {
  'use strict';

  // imports
  var assert = require( 'ASSERT/assert' )( 'scenery-phet' );
  var inherit = require( "PHET_CORE/inherit" );
  var Node = require( "SCENERY/nodes/Node" );
  var Path = require( "SCENERY/nodes/Path" );
  var Shape = require( "KITE/Shape" );
  var Vector2 = require( "DOT/Vector2" );
  var Rectangle = require( "SCENERY/nodes/Rectangle" );

  /**
   * @param {Vector2} tailLocation
   * @param {Vector2} tipLocation
   * @param {number} headHeight
   * @param {number} headWidth
   * @param {number} tailWidth
   * @constructor
   */
  function ArrowNode( tailLocation, tipLocation, headHeight, headWidth, tailWidth, options ) {

    this.tailLocation = tailLocation;
    this.tipLocation = tipLocation;
    this.headHeight = headHeight;
    this.headWidth = headWidth;
    this.tailWidth = tailWidth;

    // default options
    options = _.extend(
        {
          fill: 'black',
          stroke: 'black',
          lineWidth: 1
        }, options );

    // things you're likely to mess up, add more as needed
    assert && assert( headWidth >= tailWidth );

    // Call super constructor.
    Node.call( this, options );

    this.path = new Path( options );
    this.addChild( this.path );
    this.updateShape();
  }

  inherit( Node, ArrowNode, {
    updateShape: function(){
      this.path.shape = this._createArrowShape( this.tailLocation.x, this.tailLocation.y, this.tipLocation.x, this.tipLocation.y, this.tailWidth, this.headWidth, this.headHeight );
      this.addChild( this.path );
    },
    _createArrowShape: function ( tailX, tailY, tipX, tipY, tailWidth, headWidth, headHeight ) {   //All parameters are Number
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

  return ArrowNode;
} );
