// Copyright 2022-2025, University of Colorado Boulder

/**
 * Demo for LineArrowNode
 *
 * @author Chris Malley (PixelZoom, Inc).
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import LineArrowNode from '../../LineArrowNode.js';

export default function demoLineArrowNode( layoutBounds: Bounds2 ): Node {

  const lineArrowNode = new LineArrowNode( 0, 0, 200, 0, {
    headWidth: 30,
    headHeight: 30,
    headLineWidth: 3,
    tailLineWidth: 3
  } );

  const smoothArrowNode = new LineArrowNode( 0, 0, 200, 0, {
    lineJoin: 'round',
    lineCap: 'round',
    headWidth: 30,
    headHeight: 30,
    headLineWidth: 8,
    tailLineWidth: 8
  } );

  const dashedArrowNode = new LineArrowNode( 0, 0, 200, 0, {
    stroke: 'maroon',
    headWidth: 30,
    headHeight: 30,
    headLineWidth: 7,
    tailLineWidth: 7,
    tailLineDash: [ 10, 8 ]
  } );

  return new VBox( {
    spacing: 100,
    children: [ lineArrowNode, smoothArrowNode, dashedArrowNode ],
    center: layoutBounds.center
  } );
}