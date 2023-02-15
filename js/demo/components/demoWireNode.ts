// Copyright 2022-2023, University of Colorado Boulder

/**
 * Demo for WireNode - two circles connected by a wire.
 */

import { Circle, DragListener, Node } from '../../../../scenery/js/imports.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import WireNode from '../../WireNode.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';

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