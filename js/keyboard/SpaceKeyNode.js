// Copyright 2017-2020, University of Colorado Boulder

/**
 * Node that represents a 'Space' key on a keyboard.
 *
 * @author Jesse Greenberg
 */

import inherit from '../../../phet-core/js/inherit.js';
import sceneryPhetStrings from '../sceneryPhetStrings.js';
import sceneryPhet from '../sceneryPhet.js';
import TextKeyNode from './TextKeyNode.js';

const keySpaceString = sceneryPhetStrings.key.space;

/**
 * Constructor.
 *
 * @param {Object} [options]
 */
function SpaceKeyNode( options ) {
  TextKeyNode.call( this, keySpaceString, options );
}

sceneryPhet.register( 'SpaceKeyNode', SpaceKeyNode );

inherit( TextKeyNode, SpaceKeyNode );
export default SpaceKeyNode;