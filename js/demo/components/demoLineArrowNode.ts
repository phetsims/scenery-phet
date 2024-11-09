// Copyright 2022-2024, University of Colorado Boulder

/**
 * Demo for LineArrowNode
 *
 * @author Chris Malley (PixelZoom, Inc).
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import { Node, VBox } from '../../../../scenery/js/imports.js';
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

  return new VBox( {
    spacing: 100,
    children: [ lineArrowNode, smoothArrowNode ],
    center: layoutBounds.center
  } );
}