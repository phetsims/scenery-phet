// Copyright 2017-2020, University of Colorado Boulder

/**
 * TextKeyNode is a keyboard key with text that is generally more than a single character. By default, a key
 * with text is more rectangular than a letter key (LetterKeyNode), and the key compactly surrounds the text content.
 *
 * @author Jesse Greenberg
 */

import merge from '../../../phet-core/js/merge.js';
import RichText from '../../../scenery/js/nodes/RichText.js';
import PhetFont from '../PhetFont.js';
import sceneryPhet from '../sceneryPhet.js';
import KeyNode from './KeyNode.js';
import sceneryPhetStrings from '../sceneryPhetStrings.js';

class TextKeyNode extends KeyNode {

  /**
   * @param {string} string
   * @param {Object} [options]
   */
  constructor( string, options ) {

    // margins, width, and height in ScreenView coordinates
    options = merge( {

      // text options
      font: new PhetFont( { size: 16 } ),
      fill: 'black',
      textMaxWidth: 45, // Long keys like Space, Enter, Tab, Shift are all smaller than this.

      // by default, key should tightly surround the text, with a bit more horizontal space
      xPadding: 11

    }, options );

    // use RichText because some keys (like page up/page down/caps lock) might span multiple lines
    const textNode = new RichText( string, {
      font: options.font,
      fill: options.fill,
      maxWidth: options.textMaxWidth
    } );

    super( textNode, options );
  }

  //-------------------------------------------------------------------------------------------------
  // Static factory methods for specific text strings. For brevity, these methods have the same names
  // as their string keys. For example sceneryPhetStrings.key.alt is rendered by the alt method.
  //-------------------------------------------------------------------------------------------------

  /**
   * @param {Object} [options]
   * @returns {Node}
   * @public
   */
  static alt( options ) {
    return new TextKeyNode( sceneryPhetStrings.key.alt, options );
  }

  /**
   * @param {Object} [options]
   * @returns {Node}
   * @public
   */
  static capsLock( options ) {
    return new TextKeyNode( sceneryPhetStrings.key.capsLock, options );
  }

  /**
   * @param {Object} [options]
   * @returns {Node}
   * @public
   */
  static esc( options ) {
    return new TextKeyNode( sceneryPhetStrings.key.esc, options );
  }

  /**
   * @param {Object} [options]
   * @returns {Node}
   * @public
   */
  static end( options ) {
    return new TextKeyNode( sceneryPhetStrings.key.end, options );
  }

  /**
   * @param {Object} [options]
   * @returns {Node}
   * @public
   */
  static enter( options ) {
    return new TextKeyNode( sceneryPhetStrings.key.enter, options );
  }

  /**
   * @param {Object} [options]
   * @returns {Node}
   * @public
   */
  static fn( options ) {
    return new TextKeyNode( sceneryPhetStrings.key.fn, options );
  }

  /**
   * @param {Object} [options]
   * @returns {Node}
   * @public
   */
  static home( options ) {
    return new TextKeyNode( sceneryPhetStrings.key.home, options );
  }

  /**
   * @param {Object} [options]
   * @returns {Node}
   * @public
   */
  static pageDown( options ) {
    return new TextKeyNode( sceneryPhetStrings.key.pageDown, options );
  }

  /**
   * @param {Object} [options]
   * @returns {Node}
   * @public
   */
  static pageUp( options ) {
    return new TextKeyNode( sceneryPhetStrings.key.pageUp, options );
  }

  /**
   * @param {Object} [options]
   * @returns {Node}
   * @public
   */
  static space( options ) {
    return new TextKeyNode( sceneryPhetStrings.key.space, options );
  }

  /**
   * @param {Object} [options]
   * @returns {Node}
   * @public
   */
  static shift( options ) {
    return new TextKeyNode( sceneryPhetStrings.key.shift, options );
  }

  /**
   * @param {Object} [options]
   * @returns {Node}
   * @public
   */
  static tab( options ) {
    return new TextKeyNode( sceneryPhetStrings.key.tab, options );
  }
}

sceneryPhet.register( 'TextKeyNode', TextKeyNode );
export default TextKeyNode;