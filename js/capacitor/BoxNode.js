// Copyright 2015-2019, University of Colorado Boulder

/**
 * Pseudo-3D representation of a box, using parallelograms.  Only the three visible faces are shown: top, front,
 * right side.  The top and right-side faces are foreshortened to give the illusion of distance between front and back
 * planes. Origin is at the center of the top face.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 *
 * Moved from capacitor-lab-basics/js/common/view/BoxNode.js on Oct 7, 2019
 */
define( require => {
  'use strict';

  // modules
  const BoxShapeCreator = require( 'SCENERY_PHET/capacitor/BoxShapeCreator' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );

  // constants
  const LINE_WIDTH = 1;
  const STROKE = 'black';

  /**
   * @constructor
   *
   * @param {CLModelViewTransform3} modelViewTransform
   * @param {Color} color
   * @param {Bounds3} size
   */
  function BoxNode( modelViewTransform, color, size ) {

    Node.call( this );

    // @private {BoxShapeCreator}
    this.shapeCreator = new BoxShapeCreator( modelViewTransform );

    // @private {Bounds3}
    this.size = size;

    // @private {Path}
    this.topNode = new Path( this.shapeCreator.createTopFaceBounds3( size ), {
      fill: this.getTopColor( color ),
      lineWidth: LINE_WIDTH,
      stroke: STROKE
    } );

    // @private {Path}
    this.frontNode = new Path( this.shapeCreator.createFrontFaceBounds3( size ), {
      fill: this.getFrontColor( color ),
      lineWidth: LINE_WIDTH,
      stroke: STROKE
    } );

    // @private {Path}
    this.rightSideNode = new Path( this.shapeCreator.createRightSideFaceBounds3( size ), {
      fill: this.getSideColor( color ),
      lineWidth: LINE_WIDTH,
      stroke: STROKE
    } );

    // rendering order
    this.addChild( this.topNode );
    this.addChild( this.frontNode );
    this.addChild( this.rightSideNode );
  }

  sceneryPhet.register( 'BoxNode', BoxNode );

  return inherit( Node, BoxNode, {

    /**
     * Get color for the top of the capacitor.  Top color is the base color.
     * @public
     *
     * @returns {Color}
     */
    getTopColor: function( baseColor ) {
      return baseColor;
    },

    /**
     * Get the color for the front of the capacitor.  Front color is one shade darker
     * @public
     *
     * @param {Color} baseColor
     * @returns {Color}
     */
    getFrontColor: function( baseColor ) {
      return baseColor.darkerColor();
    },

    /**
     * Get the color for the side of the capacitor.  Side color is two shade darker.
     * @public
     *
     * @param {Color} baseColor
     * @returns {Color}
     */
    getSideColor: function( baseColor ) {
      return baseColor.darkerColor().darkerColor();
    },

    /**
     * Set shapes from size property
     * @public
     */
    updateShapes: function() {
      this.topNode.shape = this.shapeCreator.createTopFaceBounds3( this.size );
      this.frontNode.shape = this.shapeCreator.createFrontFaceBounds3( this.size );
      this.rightSideNode.shape = this.shapeCreator.createRightSideFaceBounds3( this.size );
    },

    /**
     * Set the size of this box.
     * @public
     *
     * @param {Bounds3} size
     */
    setBoxSize: function( size ) {
      if ( !size.equals( this.size ) ) {
        this.size = size;
        this.updateShapes();
      }
    }
  } );
} );
