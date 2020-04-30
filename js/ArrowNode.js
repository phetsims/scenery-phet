// Copyright 2013-2020, University of Colorado Boulder

/**
 * A single- or double-headed arrow. This is a convenience class, most of the work is done in ArrowShape.
 *
 * @author John Blanco
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Aaron Davis
 * @author Sam Reid
 */

import Shape from '../../kite/js/Shape.js';
import InstanceRegistry from '../../phet-core/js/documentation/InstanceRegistry.js';
import inherit from '../../phet-core/js/inherit.js';
import merge from '../../phet-core/js/merge.js';
import Path from '../../scenery/js/nodes/Path.js';
import Tandem from '../../tandem/js/Tandem.js';
import ArrowShape from './ArrowShape.js';
import sceneryPhet from './sceneryPhet.js';

/**
 * @param {number} tailX
 * @param {number} tailY
 * @param {number} tipX
 * @param {number} tipY
 * @param {Object} [options]
 * @constructor
 */
function ArrowNode( tailX, tailY, tipX, tipY, options ) {

  // default options
  options = merge( {
    headHeight: 10,
    headWidth: 10,
    tailWidth: 5,
    isHeadDynamic: false,
    scaleTailToo: false,
    fractionalHeadHeight: 0.5, // head will be scaled when headHeight is greater than fractionalHeadHeight * arrow length
    doubleHead: false, // true puts heads on both ends of the arrow, false puts a head at the tip
    fill: 'black',
    stroke: 'black',
    lineWidth: 1,

    // phet-io
    tandem: Tandem.OPTIONAL
  }, options );

  // things you're likely to mess up, add more as needed
  assert && assert( options.headWidth > options.tailWidth );

  Path.call( this, null );

  // @private
  this.options = options;
  this.shapePoints = []; // {Vector2[]}

  // @public {read-only}
  this.tailX = tailX;
  this.tailY = tailY;
  this.tipX = tipX;
  this.tipY = tipY;

  this.setTailAndTip( tailX, tailY, tipX, tipY );

  this.mutate( options );

  // support for binder documentation, stripped out in builds and only runs when ?binder is specified
  assert && phet.chipper.queryParameters.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'ArrowNode', this );
}

sceneryPhet.register( 'ArrowNode', ArrowNode );

inherit( Path, ArrowNode, {

  /**
   * Update the internal shapePoints array which is used to populate the points in the Shape instance.
   * @private
   * @returns {boolean} true if the number of points in the array has changed, which would require building a new
   *                    shape instance.
   */
  updateShapePoints: function() {
    const numberOfPoints = this.shapePoints.length;
    this.shapePoints = ArrowShape.getArrowShapePoints( this.tailX, this.tailY, this.tipX, this.tipY, this.shapePoints, this.options );
    return ( this.shapePoints.length !== numberOfPoints );
  },

  /**
   * Initialize or update the shape. Only called if the number of points in the shape changes.
   * @private
   */
  updateShape: function() {

    const shape = new Shape();

    if ( this.shapePoints.length > 1 ) {
      shape.moveToPoint( this.shapePoints[ 0 ] );
      for ( let i = 1; i < this.shapePoints.length; i++ ) {
        shape.lineToPoint( this.shapePoints[ i ] );
      }
      shape.close();
    }

    this.shape = shape;
  },

  /**
   * Sets the tail and tip locations to update the arrow shape.
   * If the tail and tip are at the same point, the arrow is not shown.
   * @public
   * @param {number} tailX
   * @param {number} tailY
   * @param {number} tipX
   * @param {number} tipY
   */
  setTailAndTip: function( tailX, tailY, tipX, tipY ) {

    this.tailX = tailX;
    this.tailY = tailY;
    this.tipX = tipX;
    this.tipY = tipY;

    const numberOfPointsChanged = this.updateShapePoints();

    // This bit of logic is to improve performance for the case where the Shape instance can be reused
    // (if the number of points in the array is the same).
    if ( !this.shape || numberOfPointsChanged ) {
      this.updateShape();
    }
    else {

      // This is the higher-performance case where the Shape instance can be reused
      this.shape.invalidatePoints();
    }
  },

  /**
   * Sets the tail location.
   * @param {number} tailX
   * @param {number} tailY
   * @public
   */
  setTail: function( tailX, tailY ) {
    this.setTailAndTip( tailX, tailY, this.tipX, this.tipY );
  },

  /**
   * Sets the tip location.
   * @param {number} tipX
   * @param {number} tipY
   * @public
   */
  setTip: function( tipX, tipY ) {
    this.setTailAndTip( this.tailX, this.tailY, tipX, tipY );
  },

  /**
   * Sets the tail width.
   * @public
   * @param {number} tailWidth
   */
  setTailWidth: function( tailWidth ) {
    this.options.tailWidth = tailWidth;
    this.updateShapePoints();
    this.updateShape();
  },

  /**
   * Sets whether the arrow has one or two heads.
   * @public
   * @param {boolean} doubleHead
   */
  setDoubleHead: function( doubleHead ) {
    this.options.doubleHead = doubleHead;
    this.updateShapePoints();
    this.updateShape();
  }
} );

export default ArrowNode;