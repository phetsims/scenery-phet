// Copyright 2020, University of Colorado Boulder

/**
 * Node that looks like an "Alt" key on a keyboard.
 *
 * @author Jesse Greenberg
 */

import sceneryPhet from '../sceneryPhet.js';
import sceneryPhetStrings from '../sceneryPhetStrings.js';
import TextKeyNode from './TextKeyNode.js';

class AltKeyNode extends TextKeyNode {
  constructor( options ) {
    super( sceneryPhetStrings.key.alt, options );
  }
}

sceneryPhet.register( 'AltKeyNode', AltKeyNode );

export default AltKeyNode;