// Copyright 2017-2019, University of Colorado Boulder

/**
 * Node that looks like a keyboard key with text that is generally more than a single character. By default, a key
 * node with text is more rectangular than a letter key, and the key compactly surrounds the text content.
 *
 * @author Jesse Greenberg
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var KeyNode = require( 'SCENERY_PHET/keyboard/KeyNode' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var RichText = require( 'SCENERY/nodes/RichText' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );

  /**
   * Constructor.
   *
   * @param {string} string
   * @param {Object} options
   */
  function TextKeyNode( string, options ) {

    // margins, width, and height in ScreenView coordinates
    options = _.extend( {

      // text options
      font: new PhetFont( { size: 12 } ),
      fill: 'black',
      textMaxWidth: 35, // Long keys like Space, Enter, Tab, Shift are all smaller than this.

      // by default, key should tightly surround the text, with a bit more horizontal space
      xPadding: 8

    }, options );

    // use RichText because some keys (like page up/page down/caps lock) might span multiple lines
    var textNode = new RichText( string, { font: options.font, fill: options.fill, maxWidth: options.textMaxWidth } );

    KeyNode.call( this, textNode, options );
  }

  sceneryPhet.register( 'TextKeyNode', TextKeyNode );

  return inherit( KeyNode, TextKeyNode );

} );
