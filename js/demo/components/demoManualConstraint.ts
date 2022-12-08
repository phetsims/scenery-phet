// Copyright 2022, University of Colorado Boulder

/**
 * Demo for ManualConstraint
 *
 * @author Jonathan Olson
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import { ManualConstraint, Node, Text } from '../../../../scenery/js/imports.js';

export default function demoManualConstraint( layoutBounds: Bounds2 ): Node {

  const base = new Node();
  const transformedContainer = new Node( {
    scale: 2,
    x: 100,
    y: -50
  } );

  const nodeA = new Text( 'A' );
  const nodeB = new Text( 'B' );

  base.addChild( nodeA );
  base.addChild( transformedContainer );
  transformedContainer.addChild( nodeB );

  ManualConstraint.create( base, [ nodeA ], nodeAWrapper => {
    nodeAWrapper.left = 200;
    nodeAWrapper.top = 200;
  } );
  ManualConstraint.create( base, [ nodeA, nodeB ], ( nodeAWrapper, nodeBWrapper ) => {
    nodeBWrapper.left = nodeAWrapper.right + 10;
    nodeBWrapper.centerY = nodeAWrapper.centerY;
  } );

  return new Node( {
    children: [ base ],
    center: layoutBounds.center
  } );
}