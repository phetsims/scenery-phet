// Copyright 2019, University of Colorado Boulder

/**
 * Pseudo-3D representation of a box, using parallelograms.  Only the three visible faces are shown: top, front,
 * right side.  The top and right-side faces are foreshortened to give the illusion of distance between front and back
 * planes. Origin is at the center of the top face.
 *
 * Moved from capacitor-lab-basics/js/common/view/BoxNode.js on Oct 7, 2019
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const BoxShapeCreator = require( 'SCENERY_PHET/capacitor/BoxShapeCreator' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );

  // constants
  const LINE_WIDTH = 1;
  const STROKE = 'black';

  class BoxNode extends Node {

    /**
     * @param {CLBModelViewTransform3} modelViewTransform
     * @param {Color} color
     * @param {Bounds3} size
     * @param {Object} options
     */
    constructor( modelViewTransform, color, size, options ) {

      super();

      // @private {BoxShapeCreator}
      this.shapeCreator = new BoxShapeCreator( modelViewTransform );

      // @private {Bounds3}
      this.size = size;

      // @private {Path}
      this.topNode = new Path( this.shapeCreator.createTopFaceBounds3( size ), {
        fill: color,
        lineWidth: LINE_WIDTH,
        stroke: STROKE
      } );

      // @private {Path}
      this.frontNode = new Path( this.shapeCreator.createFrontFaceBounds3( size ), {
        fill: color.darkerColor(),
        lineWidth: LINE_WIDTH,
        stroke: STROKE
      } );

      // @private {Path}
      this.rightSideNode = new Path( this.shapeCreator.createRightSideFaceBounds3( size ), {
        fill: color.darkerColor().darkerColor(),
        lineWidth: LINE_WIDTH,
        stroke: STROKE
      } );

      // rendering order
      this.addChild( this.topNode );
      this.addChild( this.frontNode );
      this.addChild( this.rightSideNode );

      this.mutate( options );
    }

    /**
     * Set shapes from size property
     * @public
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