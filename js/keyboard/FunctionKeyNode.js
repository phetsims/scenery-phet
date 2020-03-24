// Copyright 2017-2020, University of Colorado Boulder

/**
 * Node that looks like a 'function' key on a keyboard.  By default, the function key is
 * more rectangular than a letter key, and the text content is aligned
 * in the left top corner.
 *
 * @author Michael Barlow
 */

import inherit from '../../../phet-core/js/inherit.js';
import merge from '../../../phet-core/js/merge.js';
import sceneryPhetStrings from '../scenery-phet-strings.js';
import sceneryPhet from '../sceneryPhet.js';
import TextKeyNode from './TextKeyNode.js';

// strings
const keyFnString = sceneryPhetStrings.key.fn;

/**
 * Constructor.
 *
 * @param {Object} [options]
 */
function FunctionKeyNode( options ) {

  options = merge( {
    minKeyWidth: 75, // in ScreenView coordinates, function key is usually longer than other keys
    maxKeyWidth: 75
  }, options );

  TextKeyNode.call( this, keyFnString, options );
}

sceneryPhet.register( 'FunctionKeyNode', FunctionKeyNode );

inherit( TextKeyNode, FunctionKeyNode );
export default FunctionKeyNode;