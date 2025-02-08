// Copyright 2022-2025, University of Colorado Boulder

/**
 * Demo for WireNode - two circles connected by a wire.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import DragListener from '../../../../scenery/js/listeners/DragListener.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import WireNode from '../../WireNode.js';

export default function demoWireNode( layoutBounds: Bounds2 ): Node {

  const greenCircle = new Circle( 20, {
    fill: 'green',
    cursor: 'pointer'
  } );
  greenCircle.addInputListener( new DragListener( { translateNode: true } ) );

  const redCircle = new Circle( 20, {
    fill: 'red',
    cursor: 'pointer',
    center: greenCircle.center.plusXY( 200, 200 )
  } );
  redCircle.addInputListener( new DragListener( { translateNode: true } ) );

  // Distance the wires stick out from the objects
  const NORMAL_DISTANCE = 100;

  // Add the wire behind the probe.
  const wireNode = new WireNode(
    // Connect to the greenCircle at the center bottom
    new DerivedProperty( [ greenCircle.boundsProperty ], bounds => bounds.centerBottom ),
    new Vector2Property( new Vector2( 0, NORMAL_DISTANCE ) ),

    // Connect to node2 at the left center
    new DerivedProperty( [ redCircle.boundsProperty ], bounds => bounds.leftCenter ),
    new Vector2Property( new Vector2( -NORMAL_DISTANCE, 0 ) ), {
      lineWidth: 3
    }
  );

  return new Node( {
    children: [ greenCircle, redCircle, wireNode ], // wireNode on top, so we can see it fully
    center: layoutBounds.center
  } );
}