// Copyright 2017-2020, University of Colorado Boulder

/**
 * Node that looks like a keyboard key with a single letter. By default, a letter key is square, with a bit less
 * horizontal padding than a key with a full word.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import inherit from '../../../phet-core/js/inherit.js';
import merge from '../../../phet-core/js/merge.js';
import sceneryPhet from '../sceneryPhet.js';
import TextKeyNode from './TextKeyNode.js';

/**
 * Constructor.
 *
 * @param {string} string - the letter for the key
 * @param {Object} [options]
 */
function LetterKeyNode( string, options ) {

  options = merge( {
    xPadding: 5,
    forceSquareKey: true
  }, options );

  TextKeyNode.call( this, string, options );
}

sceneryPhet.register( 'LetterKeyNode', LetterKeyNode );

inherit( TextKeyNode, LetterKeyNode );
export default LetterKeyNode;