// Copyright 2019, University of Colorado Boulder

/**
 * Pseudo-3D representation of a box, using parallelograms.  Only the three visible faces are shown: top, front,
 * right side.  The top and right-side faces are foreshortened to give the illusion of distance between front and back
 * planes. Origin is at the center of the top face.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const BoxShapeCreator = require( 'SCENERY_PHET/capacitor/BoxShapeCreator' );
  const merge = require( 'PHET_CORE/merge' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );

  // constants
  const PATH_OPTIONS = {
    lineWidth: 1,
    stroke: 'black'
  };

  class BoxNode extends Node {

    /**
     * @param {YawPitchModelViewTransform3} transform
     * @param {Color} color
     * @param {Bounds3} size
     * @param {Object} options
     */
    constructor( transform, color, size, options ) {

      super();

      // @private {BoxShapeCreator}
      this.shapeCreator = new BoxShapeCreator( transform );

      // @public (read-only) {Path}
      this.topNode = new Path( null, merge( { fill: color }, PATH_OPTIONS ) );

      // @public (read-only) {Path}
      this.frontNode = new Path( null, merge( { fill: color.darkerColor() }, PATH_OPTIONS ) );

      // @private {Path}
      this.rightSideNode = new Path( null, merge( { fill: color.darkerColor().darkerColor() }, PATH_OPTIONS ) );

      // @private {Bounds3}
      this.size = size;
      this.updateShapes();

      // rendering order
      this.addChild( this.topNode );
      this.addChild( this.frontNode );
      this.addChild( this.rightSideNode );

      // mark pickable so it can be hit tested for the voltmeter probe
      options = merge( { pickable: true }, options );

      this.mutate( options );
    }

    /**
     * @private - update the shapes after the size has been set
     */
    updateShapes() {
      this.topNode.shape = this.shapeCreator.createTopFaceBounds3( this.size );
      this.frontNode.shape = this.shapeCreator.createFrontFaceBounds3( this.size );
      this.rightSideNode.shape = this.shapeCreator.createRightSideFaceBounds3( this.size );
    }

    /**
     * Set the size of this box.
     * @param {Bounds3} size
     * @public
     */
    setBoxSize( size ) {
      if ( !size.equals( this.size ) ) {
        this.size = size;
        this.updateShapes();
      }
    }
  }

  return sceneryPhet.register( 'BoxNode', BoxNode );
} );