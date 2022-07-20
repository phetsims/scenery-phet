// Copyright 2022, University of Colorado Boulder

/**
 * Demo for BracketNode
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import BracketNode from '../../BracketNode.js';
import PhetFont from '../../PhetFont.js';
import { Node, Text } from '../../../../scenery/js/imports.js';

export default function demoBracketNode( layoutBounds: Bounds2 ): Node {
  return new BracketNode( {
    orientation: 'left',
    bracketTipPosition: 0.75,
    labelNode: new Text( 'bracket', { font: new PhetFont( 20 ) } ),
    spacing: 10,
    center: layoutBounds.center
  } );
}