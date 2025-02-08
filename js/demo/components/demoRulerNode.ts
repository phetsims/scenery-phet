// Copyright 2022-2025, University of Colorado Boulder

/**
 * Demo for RulerNode
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import RulerNode from '../../RulerNode.js';

export default function demoRulerNode( layoutBounds: Bounds2 ): Node {

  const rulerLength = 500;
  const majorTickWidth = 50;
  const majorTickLabels = [];
  const numberOfTicks = Math.floor( rulerLength / majorTickWidth ) + 1;
  for ( let i = 0; i < numberOfTicks; i++ ) {
    majorTickLabels[ i ] = `${i * majorTickWidth}`;
  }

  return new RulerNode( rulerLength, 0.15 * rulerLength, majorTickWidth, majorTickLabels, 'm', {
    insetsWidth: 25,
    minorTicksPerMajorTick: 4,
    center: layoutBounds.center
  } );
}