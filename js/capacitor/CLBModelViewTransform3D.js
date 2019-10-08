// Copyright 2019, University of Colorado Boulder

/**
 * Provides the transforms between model and view 3D-coordinate systems. In both coordinate systems, +x is to the right,
 * +y is down, +z is away from the viewer. Sign of rotation angles is specified using the right-hand rule.
 *
 * +y
 * ^    +z
 * |   /
 * |  /
 * | /
 * +-------> +x
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 *
 * Moved from capacitor-lab-basics/js/common/model/CLBModelViewTransform3D.js on Oct 7, 2019
 */
define( require => {
  'use strict';

  // modules
  const Matrix3 = require( 'DOT/Matrix3' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  const Vector2 = require( 'DOT/Vector2' );
  const Vector3 = require( 'DOT/Vector3' );

  // Scratch variable for performance
  // @private
  const scratchVector2 = new Vector2( 0, 0 );
  const scratchVector3 = new Vector3( 0, 0, 0 );

  class CLBModelViewTransform3D {

    /**
     * @constructor
     *
     * @param {Object} [options]
     */
    constructor( options ) {

      options = _.extend( {
        scale: 12000, // scale for mapping from model to view (x and y scale are identical)
        pitch: 30 * Math.PI / 180, // rotation about the horizontal (x) axis, sign determined using the right-hand rule (radians)
        yaw: -45 * Math.PI / 180 // rotation about the vertical (y) axis, sign determined using the right-hand rule (radians)
      }, options );

      // @private {ModelViewTransform2}
      this.modelToViewTransform2D = new ModelViewTransform2( Matrix3.scaling( options.scale ) );

      // @private {number}
      this.pitch = options.pitch;

      // @public {number} (read-only)
      this.yaw = options.yaw;
    }

    //----------------------------------------------------------------------------
    // Model-to-view transforms
    //----------------------------------------------------------------------------

    /**
     * Maps a point from 3D model coordinates to 2D view coordinates.
     * @public
     *
     * @param {Vector3} modelPoint
     * @returns {Vector3}
     */
    modelToViewPosition( modelPoint ) {

      assert && assert( modelPoint instanceof Vector3,
        'modelPoint must be of type Vector3. Received ' + modelPoint );

      scratchVector2.setPolar( modelPoint.z * Math.sin( this.pitch ), this.yaw ).add( modelPoint );
      return this.modelToViewTransform2D.transformPosition2( scratchVector2 );
    }

    /**
     * Maps a point from 3D model coordinates to 2D view coordinates.
     * @public
     *
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @returns {Vector2}
     */
    modelToViewXYZ( x, y, z ) {
      return this.modelToViewPosition( scratchVector3.setXYZ( x, y, z ) );
    }

    /**
     * Maps a delta from 3D model coordinates to 2D view coordinates.
     * @public
     *
     * @param {Vector3} delta
     * @returns {Vector2}
     */
    modelToViewDelta( delta ) {
      const origin = this.modelToViewPosition( scratchVector3.setXYZ( 0, 0, 0 ) );
      return this.modelToViewPosition( delta ).minus( origin );
    }

    /**
     * Maps a delta from 3D model coordinates to 2D view coordinates.
     * @public
     *
     * @param {number} xDelta
     * @param {number} yDelta
     * @param {number} zDelta
     * @returns {Vector2}
     */
    modelToViewDeltaXYZ( xDelta, yDelta, zDelta ) {
      return this.modelToViewDelta( new Vector3( xDelta, yDelta, zDelta ) );
    }

    /**
     * Model shapes are all in the 2D xy plane, and have no depth.
     * @public
     *
     * @param {Shape} modelShape
     * @returns {Shape}
     */
    modelToViewShape( modelShape ) {
      return this.modelToViewTransform2D.transformShape( modelShape );
    }

    /**
     * Bounds are all in the 2D xy plane, and have no depth.
     * @public
     *
     * @param  {Bounds2} modelBounds
     * @returns {Bounds2}
     */
    modelToViewBounds( modelBounds ) {
      return this.modelToViewTransform2D.transformBounds2( modelBounds );
    }

    //----------------------------------------------------------------------------
    // View-to-model transforms
    //----------------------------------------------------------------------------

    /**
     * Maps a point from 2D view coordinates to 3D model coordinates. The z coordinate will be zero.
     * This is different than the inverse of modelToViewPosition.
     * @public
     *
     * @param {Vector2} pView
     * @returns {Vector3}
     */
    viewToModelPosition( pView ) {
      return this.modelToViewTransform2D.inversePosition2( pView ).toVector3();
    }

    /**
     * Maps a point from 2D view coordinates to 3D model coordinates. The z coordinate will be zero.
     * @public
     *
     * @param {number} x
     * @param {number} y
     * @returns {Vector3}
     */
    viewToModelXY( x, y ) {
      return this.viewToModelPosition( scratchVector2.setXY( x, y ) );
    }

    /**
     * Maps a delta from 2D view coordinates to 3D model coordinates. The z coordinate will be zero.
     * @public
     *
     * @param {Vector2} delta
     * @returns {Vector3}
     */
    viewToModelDelta( delta ) {
      const origin = this.viewToModelPosition( scratchVector2.setXY( 0, 0 ) );

      return this.viewToModelPosition( delta ).minus( origin );
    }

    /**
     * Maps a delta from 2D view coordinates to 3D model coordinates. The z coordinate will be zero.
     * @public
     *
     * @param {number} xDelta
     * @param {number} yDelta
     * @returns {Vector3}
     */
    viewToModelDeltaXY( xDelta, yDelta ) {
      return this.viewToModelDelta( new Vector2( xDelta, yDelta ) );
    }

    /**
     * Model shapes are all in the 2D xy plane, and have no depth.
     * @public
     *
     * @param {Shape} viewShape
     * @returns {Shape}
     */
    viewToModelShape( viewShape ) {
      return this.modelToViewTransform2D.inverseShape( viewShape );
    }

    /**
     * Transforms 2D view bounds to 2D model bounds since bounds have no depth.
     * @public
     *
     * @param {Bounds2} viewBounds
     * @returns {Bounds2}
     */
    viewToModelBounds( viewBounds ) {
      return this.modelToViewTransform2D.inverseBounds2( viewBounds );
    }
  }

  return sceneryPhet.register( 'CLBModelViewTransform3D', CLBModelViewTransform3D );
} );