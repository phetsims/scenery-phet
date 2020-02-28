// Copyright 2017-2020, University of Colorado Boulder

/**
 * Node that looks like a 'Enter' key on a keyboard.
 *
 * @author Jesse Greenberg
 */

import sceneryPhetStrings from '../scenery-phet-strings.js';
import sceneryPhet from '../sceneryPhet.js';
import TextKeyNode from './TextKeyNode.js';

const keyEnterString = sceneryPhetStrings.key.enter;

class EnterKeyNode extends TextKeyNode {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {
    super( keyEnterString, options );
  }
}

sceneryPhet.register( 'EnterKeyNode', EnterKeyNode );
export default EnterKeyNode;