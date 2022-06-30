// Copyright 2022, University of Colorado Boulder

/**
 * Demo for RulerNode
 */

import SpectrumNode from '../../SpectrumNode.js';
import { Node } from '../../../../scenery/js/imports.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';

export default function demoSpectrumNode( layoutBounds: Bounds2 ): Node {
  return new SpectrumNode( {
    center: layoutBounds.center
  } );
}