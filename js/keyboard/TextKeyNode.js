// Copyright 2017-2020, University of Colorado Boulder

/**
 * Node that looks like a keyboard key with text that is generally more than a single character. By default, a key
 * node with text is more rectangular than a letter key, and the key compactly surrounds the text content.
 *
 * @author Jesse Greenberg
 */

import inherit from '../../../phet-core/js/inherit.js';
import merge from '../../../phet-core/js/merge.js';
import RichText from '../../../scenery/js/nodes/RichText.js';
import PhetFont from '../PhetFont.js';
import sceneryPhet from '../sceneryPhet.js';
import KeyNode from './KeyNode.js';

/**
 * Constructor.
 *
 * @param {string} string
 * @param {Object} [options]
 */
function TextKeyNode( string, options ) {

  // margins, width, and height in ScreenView coordinates
  options = merge( {

    // text options
    font: new PhetFont( { size: 12 } ),
    fill: 'black',
    textMaxWidth: 35, // Long keys like Space, Enter, Tab, Shift are all smaller than this.

    // by default, key should tightly surround the text, with a bit more horizontal space
    xPadding: 8

  }, options );

  // use RichText because some keys (like page up/page down/caps lock) might span multiple lines
  const textNode = new RichText( string, { font: options.font, fill: options.fill, maxWidth: options.textMaxWidth } );

  KeyNode.call( this, textNode, options );
}

sceneryPhet.register( 'TextKeyNode', TextKeyNode );

inherit( KeyNode, TextKeyNode );
export default TextKeyNode;