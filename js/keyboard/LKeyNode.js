// Copyright 2020, University of Colorado Boulder

/**
 * Node that looks like an "L" key on a keyboard.
 *
 * @author Jesse Greenberg
 */

import sceneryPhet from '../sceneryPhet.js';
import sceneryPhetStrings from '../sceneryPhetStrings.js';
import TextKeyNode from './TextKeyNode.js';

class LKeyNode extends TextKeyNode {
  constructor( options ) {
    super( sceneryPhetStrings.key.l, options );
  }
}

sceneryPhet.register( 'LKeyNode', LKeyNode );

export default LKeyNode;