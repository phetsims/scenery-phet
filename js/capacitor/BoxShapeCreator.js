// Copyright 2019-2022, University of Colorado Boulder

/**
 * Creates 2D projections of shapes that are related to the 3D boxes.
 * Shapes are in the view coordinate frame, everything else is in model coordinates.
 * Shapes for all faces corresponds to a box with its origin in the center of the top face.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */

import { Shape } from '../../../kite/js/imports.js';
import sceneryPhet from '../sceneryPhet.js';
import YawPitchModelViewTransform3 from './YawPitchModelViewTransform3.js';

class BoxShapeCreator {

  /**
   * @param {YawPitchModelViewTransform3} transform
   */
  constructor( transform ) {
    assert && assert( transform instanceof YawPitchModelViewTransform3 );

    // @public {YawPitchModelViewTransform3}
    this.modelViewTransform = transform;
  }

  /**
   * Top face is a parallelogram.
   * @public
   *
   *    p0 -------------- p1
   *   /                /
   *  /                /
   * p3 --------------p2
   *
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @param {number} width
   * @param {number} height
   * @param {number} depth
   * @returns {Shape}
   */
  createTopFace( x, y, z, width, height, depth ) {
    // points
    const p0 = this.modelViewTransform.modelToViewXYZ( x - ( width / 2 ), y, z + ( depth / 2 ) );
    const p1 = this.modelViewTransform.modelToViewXYZ( x + ( width / 2 ), y, z + ( depth / 2 ) );
    const p2 = this.modelViewTransform.modelToViewXYZ( x + ( width / 2 ), y, z - ( depth / 2 ) );
    const p3 = this.modelViewTransform.modelToViewXYZ( x - ( width / 2 ), y, z - ( depth / 2 ) );

    // shape
    return this.createFace( p0, p1, p2, p3 );
  }

  /**
   * Create the top face of the Box with a Bounds3 object.
   * @public
   *
   * @param {Bounds3} bounds
   * @returns {Shape}
   */
  createTopFaceBounds3( bounds ) {
    return this.createTopFace( bounds.minX, bounds.minY, bounds.minZ, bounds.width, bounds.height, bounds.depth );
  }

  /**
   * Front face is a rectangle.
   * @public
   *
   * p0 --------------- p1
   * |                 |
   * |                 |
   * p3 --------------- p2
   *
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @param {number} width
   * @param {number} height
   * @param {number} depth
   * @returns {Shape}
   */
  createFrontFace( x, y, z, width, height, depth ) {
    // points
    const p0 = this.modelViewTransform.modelToViewXYZ( x - ( width / 2 ), y, z - ( depth / 2 ) );
    const p1 = this.modelViewTransform.modelToViewXYZ( x + ( width / 2 ), y, z - ( depth / 2 ) );
    const p2 = this.modelViewTransform.modelToViewXYZ( x + ( width / 2 ), y + height, z - ( depth / 2 ) );
    const p3 = this.modelViewTransform.modelToViewXYZ( x - ( width / 2 ), y + height, z - ( depth / 2 ) );
    // shape
    return this.createFace( p0, p1, p2, p3 );
  }

  /**
   * Create the front face of the box with a Bounds3 object.
   * @public
   *
   * @param {Bounds3} bounds
   * @returns {Shape}
   */
  createFrontFaceBounds3( bounds ) {
    return this.createFrontFace( bounds.minX, bounds.minY, bounds.minZ, bounds.width, bounds.height, bounds.depth );
  }

  /**
   * Right-side face is a parallelogram.
   * @public
   *
   *      p1
   *     / |
   *    /  |
   *   /   |
   *  /    p2
   * p0   /
   * |   /
   * |  /
   * | /
   * p3
   *
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @param {number} width
   * @param {number} height
   * @param {number} depth
   * @returns {Shape}
   */
  createRightSideFace( x, y, z, width, height, depth ) {
    // points
    const p0 = this.modelViewTransform.modelToViewXYZ( x + ( width / 2 ), y, z - ( depth / 2 ) );
    const p1 = this.modelViewTransform.modelToViewXYZ( x + ( width / 2 ), y, z + ( depth / 2 ) );
    const p2 = this.modelViewTransform.modelToViewXYZ( x + ( width / 2 ), y + height, z + ( depth / 2 ) );
    const p3 = this.modelViewTransform.modelToViewXYZ( x + ( width / 2 ), y + height, z - ( depth / 2 ) );
    // path
    return this.createFace( p0, p1, p2, p3 );
  }

  /**
   * Create the right face of the box with a Bounds3 object.
   * @public
   *
   * @param {Bounds3} bounds
   * @returns {Shape}
   */
  createRightSideFaceBounds3( bounds ) {
    return this.createRightSideFace( bounds.minX, bounds.minY, bounds.minZ, bounds.width, bounds.height, bounds.depth );
  }

  /**
   * A complete box, relative to a specific origin.
   * @public
   *
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @param {number} width
   * @param {number} height
   * @param {number} depth
   * @returns {Shape}
   */
  createBoxShape( x, y, z, width, height, depth ) {
    const topShape = this.createTopFace( x, y, z, width, height, depth );
    const frontShape = this.createFrontFace( x, y, z, width, height, depth );
    const sideShape = this.createRightSideFace( x, y, z, width, height, depth );
    return Shape.union( [ topShape, frontShape, sideShape ] );
  }

  /**
   * A face is defined by 4 points, specified in view coordinates.
   * @public
   *
   * @returns {Shape}
   */
  createFace( p0, p1, p2, p3 ) {
    return new Shape()
      .moveToPoint( p0 )
      .lineToPoint( p1 )
      .lineToPoint( p2 )
      .lineToPoint( p3 )
      .close();
  }
}

sceneryPhet.register( 'BoxShapeCreator', BoxShapeCreator );
export default BoxShapeCreator;