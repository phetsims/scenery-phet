// Copyright 2022, University of Colorado Boulder

/**
 * Demo for PaperAirplaneNode
 */

import PaperAirplaneNode from '../../PaperAirplaneNode.js';
import { Node } from '../../../../scenery/js/imports.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';

export default function demoPaperAirplaneNode( layoutBounds: Bounds2 ): Node {
  return new PaperAirplaneNode( {
    center: layoutBounds.center,
    scale: 5
  } );
}