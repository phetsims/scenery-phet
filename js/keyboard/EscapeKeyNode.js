// Copyright 2017-2020, University of Colorado Boulder

/**
 * Node that looks like an 'Esc' key on a keyboard.
 *
 * @author Jesse Greenberg
 */

import sceneryPhetStrings from '../scenery-phet-strings.js';
import sceneryPhet from '../sceneryPhet.js';
import TextKeyNode from './TextKeyNode.js';

const keyEscString = sceneryPhetStrings.key.esc;

class EscapeKeyNode extends TextKeyNode {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {
    super( keyEscString, options );
  }
}

sceneryPhet.register( 'EscapeKeyNode', EscapeKeyNode );
export default EscapeKeyNode;