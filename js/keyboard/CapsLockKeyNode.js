// Copyright 2017-2020, University of Colorado Boulder

/**
 * Node that looks like a 'Caps Lock' key on a keyboard.  By default, the tab key is
 * more rectangular than a letter key, and the text content is aligned
 * in the left top corner.
 *
 * @author Jesse Greenberg
 */

import inherit from '../../../phet-core/js/inherit.js';
import sceneryPhetStrings from '../scenery-phet-strings.js';
import sceneryPhet from '../sceneryPhet.js';
import TextKeyNode from './TextKeyNode.js';

const keyCapsLockString = sceneryPhetStrings.key.capsLock;

/**
 * Constructor.
 *
 * @param {Object} [options]
 */
function CapsLockKeyNode( options ) {
  TextKeyNode.call( this, keyCapsLockString, options );
}

sceneryPhet.register( 'CapsLockKeyNode', CapsLockKeyNode );

inherit( TextKeyNode, CapsLockKeyNode );
export default CapsLockKeyNode;