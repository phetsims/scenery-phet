// Copyright 2022, University of Colorado Boulder

/**
 * Demo for HeaterCoolerNode
 */

import { Node } from '../../../../scenery/js/imports.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Range from '../../../../dot/js/Range.js';
import HeaterCoolerNode from '../../HeaterCoolerNode.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';

export default function demoHeaterCoolerNode( layoutBounds: Bounds2 ): Node {
  return new HeaterCoolerNode( new NumberProperty( 0, {
    range: new Range( -1, 1 ) // +1 for max heating, -1 for max cooling
  } ), { center: layoutBounds.center } );
}