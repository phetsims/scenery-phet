// Copyright 2022-2025, University of Colorado Boulder

/**
 * Demo for BracketNode
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import BracketNode from '../../BracketNode.js';
import PhetFont from '../../PhetFont.js';

export default function demoBracketNode( layoutBounds: Bounds2 ): Node {
  return new BracketNode( {
    orientation: 'left',
    bracketTipPosition: 0.75,
    labelNode: new Text( 'bracket', { font: new PhetFont( 20 ) } ),
    spacing: 10,
    center: layoutBounds.center
  } );
}