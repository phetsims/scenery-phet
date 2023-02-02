// Copyright 2019-2023, University of Colorado Boulder

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
import Vector2 from '../../dot/js/Vector2.js';
import { Node } from '../../scenery/js/imports.js';
import sceneryPhet from './sceneryPhet.js';

/**
 * @deprecated Don't use this, it's a bad approach. See https://github.com/phetsims/scenery-phet/issues/656
 */
class DragBoundsProperty extends DerivedProperty {

  /**
   * @param {Node} targetNode - the Node that is to be constrained
   * @param {TReadOnlyProperty.<Bounds2>} boundsProperty - targetNode will be fully inside these bounds. Should be given in the
   *                                              parent coordinate frame of the targetNode
   */
  constructor( targetNode, boundsProperty ) {
    assert && assert( targetNode instanceof Node, `invalid targetNode: ${targetNode}` );
    assert && assert( boundsProperty instanceof Property, `invalid boundsProperty: ${boundsProperty}` );

    super( [ targetNode.boundsProperty, boundsProperty ], ( targetNodeBounds, bounds ) => {
      // We'll grab the origin in the parent coordinate frame, to determine our bounds offsets in that coordinate frame.
      // This way we'll properly handle scaling/rotation/etc.
      const targetOriginInParentCoordinates = targetNode.localToParentPoint( Vector2.ZERO );

      // We'll adjust the bounds based on the target's bounds relative to its origin.
      return new Bounds2(
        bounds.minX - ( targetNodeBounds.minX - targetOriginInParentCoordinates.x ),
        bounds.minY - ( targetNodeBounds.minY - targetOriginInParentCoordinates.y ),
        bounds.maxX - ( targetNodeBounds.maxX - targetOriginInParentCoordinates.x ),
        bounds.maxY - ( targetNodeBounds.maxY - targetOriginInParentCoordinates.y )
      );
    }, {
      // Don't make spurious changes, we often won't be changing
      valueComparisonStrategy: 'equalsFunction'
    } );
  }
}

sceneryPhet.register( 'DragBoundsProperty', DragBoundsProperty );
export default DragBoundsProperty;