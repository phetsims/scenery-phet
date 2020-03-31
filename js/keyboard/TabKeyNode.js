// Copyright 2017-2020, University of Colorado Boulder

/**
 * Node that looks like a 'Tab' key on a keyboard.
 *
 * @author Jesse Greenberg
 */

import inherit from '../../../phet-core/js/inherit.js';
import sceneryPhetStrings from '../sceneryPhetStrings.js';
import sceneryPhet from '../sceneryPhet.js';
import TextKeyNode from './TextKeyNode.js';

const keyTabString = sceneryPhetStrings.key.tab;

/**
 * Constructor.
 *
 * @param {Object} [options]
 */
function TabKeyNode( options ) {
  TextKeyNode.call( this, keyTabString, options );
}

sceneryPhet.register( 'TabKeyNode', TabKeyNode );

inherit( TextKeyNode, TabKeyNode );
export default TabKeyNode;