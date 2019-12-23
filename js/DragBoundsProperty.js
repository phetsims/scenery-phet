// Copyright 2019, University of Colorado Boulder

/**
 * DragBoundsProperty derives drag bounds that will keep an entire Node inside the visible bounds of a ScreenView.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Bounds2 = require( 'DOT/Bounds2' );
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const Node = require( 'SCENERY/nodes/Node' );
  const NodeProperty = require( 'SCENERY/util/NodeProperty' );
  const Property = require( 'AXON/Property' );
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );

  class DragBoundsProperty extends DerivedProperty {

    /**
     * @param {Node} targetNode - the Node that is to be constrained to the drag bounds
     * @param {Property.<Bounds2>} visibleBoundsProperty - visible bounds of the ScreenView
     */
    constructor( targetNode, visibleBoundsProperty ) {
      assert && assert( targetNode instanceof Node, `invalid targetNode: ${targetNode}` );
      assert && assert( visibleBoundsProperty instanceof Property,
        `invalid visibleBoundsProperty: ${visibleBoundsProperty}` );

      // Also detect changes in the size of the target node itself
      const targetWidthProperty = new NodeProperty( targetNode, 'bounds', 'width', {
        readOnly: true
      } );
      // Also detect changes in the size of the target node itself
      const targetHeightProperty = new NodeProperty( targetNode, 'bounds', 'height', {
        readOnly: true
      } );

      super( [ visibleBoundsProperty, targetWidthProperty, targetHeightProperty ], ( visibleBounds, targetWidth, targetHeight ) => {

        // account for the bounds of targetNode
        return new Bounds2(
          visibleBounds.minX,
          visibleBounds.minY,
          visibleBounds.maxX - targetWidth,
          visibleBounds.maxY - targetHeight
        );
      } );

      // @private
      this.disposeDragBoundsProperty = () => {
        targetWidthProperty.dispose();
      };
    }

    /**
     * @public
     */
    dispose() {
      this.disposeDragBoundsProperty();
      super.dispose();
    }
  }

  return sceneryPhet.register( 'DragBoundsProperty', DragBoundsProperty );
} );