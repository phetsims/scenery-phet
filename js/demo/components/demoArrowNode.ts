// Copyright 2022, University of Colorado Boulder

/**
 * Demo for ArrowNode
 */

import { Node, Text } from '../../../../scenery/js/imports.js';
import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import ArrowNode from '../../ArrowNode.js';
import PhetFont from '../../PhetFont.js';

export default function demoArrowNode( layoutBounds: Bounds2 ): Node {

  const arrowNode = new ArrowNode( 0, 0, 200, 200, {
    headWidth: 30,
    headHeight: 30,
    center: layoutBounds.center
  } );

  const checkedProperty = new Property( false );
  checkedProperty.link( checked => arrowNode.setDoubleHead( checked ) );

  const checkbox = new Checkbox( checkedProperty, new Text( 'Double head', { font: new PhetFont( 20 ) } ), {
    centerX: layoutBounds.centerX,
    top: arrowNode.bottom + 50
  } );

  return new Node( {
    children: [
      checkbox,
      arrowNode
    ]
  } );
}