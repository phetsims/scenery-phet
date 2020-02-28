// Copyright 2017-2020, University of Colorado Boulder

/**
 * Node that looks like a 'Page Down' key on a keyboard.
 *
 * @author Michael Barlow
 */

import inherit from '../../../phet-core/js/inherit.js';
import sceneryPhetStrings from '../scenery-phet-strings.js';
import sceneryPhet from '../sceneryPhet.js';
import TextKeyNode from './TextKeyNode.js';

const keyPageDownString = sceneryPhetStrings.key.pageDown;

/**
 * Constructor.
 *
 * @param {Object} [options]
 */
function PageDownKeyNode( options ) {
  TextKeyNode.call( this, keyPageDownString, options );
}

sceneryPhet.register( 'PageDownKeyNode', PageDownKeyNode );

inherit( TextKeyNode, PageDownKeyNode );
export default PageDownKeyNode;