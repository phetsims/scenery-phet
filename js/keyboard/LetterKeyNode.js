// Copyright 2017-2020, University of Colorado Boulder

/**
 * LetterKeyNode looks like a keyboard key with a single letter. By default, a letter key is square, with a bit less
 * horizontal padding than a key with a full word.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import merge from '../../../phet-core/js/merge.js';
import sceneryPhet from '../sceneryPhet.js';
import TextKeyNode from './TextKeyNode.js';

class LetterKeyNode extends TextKeyNode {

  /**
   * @param {string} letter
   * @param {Object} [options]
   */
  constructor( letter, options ) {

    options = merge( {
      xPadding: 5,
      forceSquareKey: true
    }, options );

    super( letter, options );
  }
}

sceneryPhet.register( 'LetterKeyNode', LetterKeyNode );
export default LetterKeyNode;