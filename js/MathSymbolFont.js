// Copyright 2016-2020, University of Colorado Boulder

/**
 * MathSymbolFont is the font used for math symbols (e.g. 'x', 'y') in PhET sims.
 * See https://github.com/phetsims/scenery/issues/545
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import StringUtils from '../../phetcommon/js/util/StringUtils.js';
import Font from '../../scenery/js/util/Font.js';
import sceneryPhet from './sceneryPhet.js';

// constants
const FAMILY = '"Times New Roman", Times, serif';

class MathSymbolFont extends Font {

  /**
   * @param {Object|number|string} [options] number or string indicate the font size, otherwise same options as scenery.Font
   */
  constructor( options ) {

    assert && assert( arguments.length <= 1, 'Too many arguments' );

    options = options || {};

    // convenience constructor: new MathSymbolFont( {number|string} size )
    if ( typeof options === 'number' || typeof options === 'string' ) {
      options = { size: options };
    }

    assert && assert( !options.family, 'MathSymbolFont sets family' );
    options.family = FAMILY;

    assert && assert( !options.style, 'MathSymbolFont sets style' );
    options.style = 'italic';

    super( options );
  }

  /**
   * Converts a string to the markup needed to display that string with RichText,
   * using the same family and style as MathSymbolFont.
   * @param {string} text
   * @returns {string}
   * @public
   */
  static getRichTextMarkup( text ) {
    return StringUtils.fillIn( '<i><span style=\'font-family: {{face}};\'>{{text}}</span></i>', {
      face: FAMILY,
      text: text
    } );
  }
}

// @public
MathSymbolFont.FAMILY = FAMILY;

sceneryPhet.register( 'MathSymbolFont', MathSymbolFont );
export default MathSymbolFont;