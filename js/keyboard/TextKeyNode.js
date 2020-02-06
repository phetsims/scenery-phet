// Copyright 2017-2020, University of Colorado Boulder

/**
 * Node that looks like a keyboard key with text that is generally more than a single character. By default, a key
 * node with text is more rectangular than a letter key, and the key compactly surrounds the text content.
 *
 * @author Jesse Greenberg
 */

define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const KeyNode = require( 'SCENERY_PHET/keyboard/KeyNode' );
  const merge = require( 'PHET_CORE/merge' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const RichText = require( 'SCENERY/nodes/RichText' );
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );

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

  return inherit( KeyNode, TextKeyNode );

} );
