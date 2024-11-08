// Copyright 2022-2024, University of Colorado Boulder

/**
 * Demo for RulerNode
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import { Node } from '../../../../scenery/js/imports.js';
import SpectrumNode from '../../SpectrumNode.js';

export default function demoSpectrumNode( layoutBounds: Bounds2 ): Node {
  return new SpectrumNode( {
    center: layoutBounds.center
  } );
}