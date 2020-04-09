// Copyright 2019-2020, University of Colorado Boulder

/**
 * DragBoundsProperty derives drag bounds that will keep an entire Node inside the visible bounds of a ScreenView.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../axon/js/DerivedProperty.js';
import Property from '../../axon/js/Property.js';
import Bounds2 from '../../dot/js/Bounds2.js';
import Node from '../../scenery/js/nodes/Node.js';
import NodeProperty from '../../scenery/js/util/NodeProperty.js';
import sceneryPhet from './sceneryPhet.js';

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
    const targetWidthProperty = new NodeProperty( targetNode, targetNode.boundsProperty, 'width', {
      readOnly: true
    } );
    // Also detect changes in the size of the target node itself
    const targetHeightProperty = new NodeProperty( targetNode, targetNode.boundsProperty, 'height', {
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

sceneryPhet.register( 'DragBoundsProperty', DragBoundsProperty );
export default DragBoundsProperty;