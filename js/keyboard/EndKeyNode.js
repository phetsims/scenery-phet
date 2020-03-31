// Copyright 2017-2020, University of Colorado Boulder

/**
 * Node that is meant to represent the 'End' key on a keyboard.
 *
 * @author Michael Barlow
 */

import inherit from '../../../phet-core/js/inherit.js';
import sceneryPhetStrings from '../sceneryPhetStrings.js';
import sceneryPhet from '../sceneryPhet.js';
import TextKeyNode from './TextKeyNode.js';

const keyEndString = sceneryPhetStrings.key.end;

/**
 * Constructor.
 *
 * @param {Object} [options]
 */
function EndKeyNode( options ) {
  TextKeyNode.call( this, keyEndString, options );
}

sceneryPhet.register( 'EndKeyNode', EndKeyNode );

inherit( TextKeyNode, EndKeyNode );
export default EndKeyNode;