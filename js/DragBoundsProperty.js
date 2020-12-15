// Copyright 2019-2020, University of Colorado Boulder

/**
 * DragBoundsProperty derives drag bounds that will keep an entire Node inside some specified bounds.
 * If the Node goes outside of these derived bounds, it's the client's responsibility to detect that
 * and move the Node accordingly.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../axon/js/DerivedProperty.js';
import Property from '../../axon/js/Property.js';
import Bounds2 from '../../dot/js/Bounds2.js';
import Node from '../../scenery/js/nodes/Node.js';
import sceneryPhet from './sceneryPhet.js';

class DragBoundsProperty extends DerivedProperty {

  /**
   * @param {Node} targetNode - the Node that is to be constrained
   * @param {Property.<Bounds2>} boundsProperty - targetNode will be fully inside these bounds
   */
  constructor( targetNode, boundsProperty ) {
    assert && assert( targetNode instanceof Node, `invalid targetNode: ${targetNode}` );
    assert && assert( boundsProperty instanceof Property, `invalid boundsProperty: ${boundsProperty}` );

    super( [ targetNode.boundsProperty, boundsProperty ], ( targetNodeBounds, bounds ) => {

      // account for the bounds of targetNode
      return new Bounds2(
        bounds.minX,
        bounds.minY,
        bounds.maxX - targetNodeBounds.width,
        bounds.maxY - targetNodeBounds.height
      );
    } );
  }
}

sceneryPhet.register( 'DragBoundsProperty', DragBoundsProperty );
export default DragBoundsProperty;