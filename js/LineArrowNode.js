// Copyright 2015, University of Colorado Boulder

//TODO scenery-phet#165 reimplement as LineArrowShape and a Path subtype, move to scenery-phet
/**
 * An arrow that is composed of 3 line segments: one for the tail, and 2 for a V-shaped head
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @param {number} tailX
   * @param {number} tailY
   * @param {number} tipX
   * @param {number} tipY
   * @param {Object} [options]
   * @constructor
   */
  function LineArrowNode( tailX, tailY, tipX, tipY, options ) {

    // default options
    options = _.extend( {
      headHeight: 10,
      headWidth: 10,
      headLineWidth: 1,
      tailLineWidth: 1,
      doubleHead: false, // true puts heads on both ends of the arrow, false puts a head at the tip
      stroke: 'black'
    }, options );

    this.headHeight = options.headHeight; // @private
    this.headWidth = options.headWidth; // @private

    // @private
    this.tailNode = new Path( null, {
      stroke: options.stroke,
      lineWidth: options.tailLineWidth
    } );

    // @private
    this.headNode = new Path( null, {
      stroke: options.stroke,
      lineWidth: options.headLineWidth
    } );

    this.setTailAndTip( tailX, tailY, tipX, tipY );

    options.children = [ this.tailNode, this.headNode ];
    Node.call( this, options );
  }

  sceneryPhet.register( 'LineArrowNode', LineArrowNode );

  return inherit( Node, LineArrowNode, {
    /**
     * Set the tail and tip locations to update the arrow shape.
     * @param {number} tailX
     * @param {number} tailY
     * @param {number} tipX
     * @param {number} tipY
     * @public
     */
    setTailAndTip: function( tailX, tailY, tipX, tipY ) {

      this.tailNode.shape = Shape.lineSegment( tailX, tailY, tipX, tipY );

      // Set up a coordinate frame that goes from tail to tip.
      var vector = new Vector2( tipX - tailX, tipY - tailY );
      var xHatUnit = vector.normalized();
      var yHatUnit = xHatUnit.rotated( Math.PI / 2 );
      var length = vector.magnitude();
      var getPoint = function( xHat, yHat ) {
        var x = xHatUnit.x * xHat + yHatUnit.x * yHat + tailX;
        var y = xHatUnit.y * xHat + yHatUnit.y * yHat + tailY;
        return new Vector2( x, y );
      };

      // limit head height to tail length
      var headHeight = Math.min( this.headHeight, 0.99 * length );

      this.headNode.shape = new Shape()
        .moveToPoint( getPoint( length - headHeight, this.headWidth / 2 ) )
        .lineToPoint( getPoint( length, 0 ) )
        .lineToPoint( getPoint( length - headHeight, -this.headWidth / 2 ) );
    }
  }, {
    /**
     *
     * @param tailX
     * @param tailY
     * @param tipX
     * @param tipY
     * @param options
     * @returns {Array}
     */
    getArrowPoints: function( tailX, tailY, tipX, tipY, options ) {
      var shapePoints = [];

      var vector = new Vector2( tipX - tailX, tipY - tailY );
      var xHatUnit = vector.normalized();
      var yHatUnit = xHatUnit.rotated( Math.PI / 2 );
      var length = vector.magnitude();

      var getPoint = function( xHat, yHat ) {
        var x = xHatUnit.x * xHat + yHatUnit.x * yHat + tailX;
        var y = xHatUnit.y * xHat + yHatUnit.y * yHat + tailY;
        return new Vector2( x, y );
      };

      var addPoint = function( point ) {
        shapePoints.push( point );
      };

      // limit head height to tail length
      var headHeight = Math.min( options.headHeight, 0.99 * length );

      // TODO: Are these points correct? Would it be better to add a line segment for the tail?
      //Points to create tail
      addPoint( getPoint( tailX, tailY ) );
      addPoint( getPoint( length, 0 ) );

      // Points to create head
      addPoint( getPoint( length - headHeight, options.headWidth / 2 ) );
      addPoint( getPoint( length, 0 ) );
      addPoint( getPoint( length - headHeight, -options.headWidth / 2 ) );

      return shapePoints;
    }
  } );
} );
