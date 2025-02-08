// Copyright 2022-2025, University of Colorado Boulder

/**
 * Demo for PaperAirplaneNode
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import PaperAirplaneNode from '../../PaperAirplaneNode.js';

export default function demoPaperAirplaneNode( layoutBounds: Bounds2 ): Node {
  return new PaperAirplaneNode( {
    center: layoutBounds.center,
    scale: 5
  } );
}