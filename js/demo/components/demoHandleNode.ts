// Copyright 2022-2024, University of Colorado Boulder

/**
 * Demo for HandleNode
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import HandleNode from '../../HandleNode.js';
import { Node } from '../../../../scenery/js/imports.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';

export default function demoHandleNode( layoutBounds: Bounds2 ): Node {
  const handleNode = new HandleNode( { scale: 4.0 } );

  return new Node( {
    children: [ handleNode ],
    center: layoutBounds.center
  } );
}