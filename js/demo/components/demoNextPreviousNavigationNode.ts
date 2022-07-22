// Copyright 2022, University of Colorado Boulder

/**
 * Demo for NextPreviousNavigationNode
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { Circle, Node } from '../../../../scenery/js/imports.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import NextPreviousNavigationNode from '../../NextPreviousNavigationNode.js';

export default function demoNextPreviousNavigationNode( layoutBounds: Bounds2 ): Node {

  const circleNode = new Circle( 30, {
    fill: 'green',
    stroke: 'black'
  } );

  const nextPreviousNavigationNode = new NextPreviousNavigationNode( circleNode, {
    arrowColor: 'red',
    arrowStrokeColor: 'black',
    arrowWidth: 28,
    arrowHeight: 36,
    next: () => console.log( 'next' ),
    previous: () => console.log( 'previous' )
  }, {
    center: layoutBounds.center
  } );

  // After instantiation of NextPreviousNavigationNode, you'll see no arrows until you set these Properties.
  // ... which is very confusing the first time you're using this component.
  nextPreviousNavigationNode.hasNextProperty.value = true;
  nextPreviousNavigationNode.hasPreviousProperty.value = true;

  return nextPreviousNavigationNode;
}