// Copyright 2018-2020, University of Colorado Boulder

/**
 * An arrow that is composed of 3 line segments: one for the tail, and 2 for a V-shaped head
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Vector2 from '../../dot/js/Vector2.js';
import Shape from '../../kite/js/Shape.js';
import InstanceRegistry from '../../phet-core/js/documentation/InstanceRegistry.js';
import inherit from '../../phet-core/js/inherit.js';
import merge from '../../phet-core/js/merge.js';
import Node from '../../scenery/js/nodes/Node.js';
import Path from '../../scenery/js/nodes/Path.js';
import sceneryPhet from './sceneryPhet.js';

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
  options = merge( {
    headHeight: 10,
    headWidth: 10,
    headLineWidth: 1,
    tailLineWidth: 1,
    tailLineDash: [],
    doubleHead: false, // true puts heads on both ends of the arrow, false puts a head at the tip
    stroke: 'black'
  }, options );

  this.headHeight = options.headHeight; // @private
  this.headWidth = options.headWidth; // @private

  // @private
  this.tailNode = new Path( null, {
    stroke: options.stroke,
    lineWidth: options.tailLineWidth,
    lineDash: options.tailLineDash
  } );

  // @private
  this.headNode = new Path( null, {
    stroke: options.stroke,
    lineWidth: options.headLineWidth
  } );

  this.setTailAndTip( tailX, tailY, tipX, tipY );

  options.children = [ this.tailNode, this.headNode ];
  Node.call( this, options );

  // support for binder documentation, stripped out in builds and only runs when ?binder is specified
  assert && phet.chipper.queryParameters.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'LineArrowNode', this );
}

sceneryPhet.register( 'LineArrowNode', LineArrowNode );

inherit( Node, LineArrowNode, {

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
    const vector = new Vector2( tipX - tailX, tipY - tailY );
    const xHatUnit = vector.normalized();
    const yHatUnit = xHatUnit.rotated( Math.PI / 2 );
    const length = vector.magnitude;
    const getPoint = function( xHat, yHat ) {
      const x = xHatUnit.x * xHat + yHatUnit.x * yHat + tailX;
      const y = xHatUnit.y * xHat + yHatUnit.y * yHat + tailY;
      return new Vector2( x, y );
    };

    // limit head height to tail length
    const headHeight = Math.min( this.headHeight, 0.99 * length );

    this.headNode.shape = new Shape()
      .moveToPoint( getPoint( length - headHeight, this.headWidth / 2 ) )
      .lineToPoint( getPoint( length, 0 ) )
      .lineToPoint( getPoint( length - headHeight, -this.headWidth / 2 ) );
  }
} );

export default LineArrowNode;