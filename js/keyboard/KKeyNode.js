// Copyright 2020, University of Colorado Boulder

/**
 * Node that looks like an "K" key on a keyboard.
 *
 * @author Jesse Greenberg
 */

import sceneryPhet from '../sceneryPhet.js';
import sceneryPhetStrings from '../sceneryPhetStrings.js';
import TextKeyNode from './TextKeyNode.js';

class KKeyNode extends TextKeyNode {
  constructor( options ) {
    super( sceneryPhetStrings.key.k, options );
  }
}

sceneryPhet.register( 'KKeyNode', KKeyNode );

export default KKeyNode;