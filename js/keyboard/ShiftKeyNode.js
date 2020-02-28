// Copyright 2017-2020, University of Colorado Boulder

/**
 * Node that looks like a 'Shift' key on a keyboard.
 *
 * @author Jesse Greenberg
 */

import inherit from '../../../phet-core/js/inherit.js';
import sceneryPhetStrings from '../scenery-phet-strings.js';
import sceneryPhet from '../sceneryPhet.js';
import TextKeyNode from './TextKeyNode.js';

const keyShiftString = sceneryPhetStrings.key.shift;

/**
 * Constructor.
 *
 * @param {Object} [options]
 */
function ShiftKeyNode( options ) {
  TextKeyNode.call( this, keyShiftString, options );
}

sceneryPhet.register( 'ShiftKeyNode', ShiftKeyNode );

inherit( TextKeyNode, ShiftKeyNode );
export default ShiftKeyNode;