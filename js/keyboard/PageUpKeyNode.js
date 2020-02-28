// Copyright 2017-2020, University of Colorado Boulder

/**
 * Node that looks like a 'Page Up' key on a keyboard.
 *
 * @author Michael Barlow
 */

import inherit from '../../../phet-core/js/inherit.js';
import sceneryPhetStrings from '../scenery-phet-strings.js';
import sceneryPhet from '../sceneryPhet.js';
import TextKeyNode from './TextKeyNode.js';

const keyPageUpString = sceneryPhetStrings.key.pageUp;

/**
 * Constructor.
 *
 * @param {Object} [options]
 */
function PageUpKeyNode( options ) {
  TextKeyNode.call( this, keyPageUpString, options );
}

sceneryPhet.register( 'PageUpKeyNode', PageUpKeyNode );

inherit( TextKeyNode, PageUpKeyNode );
export default PageUpKeyNode;