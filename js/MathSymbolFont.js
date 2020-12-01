// Copyright 2016-2020, University of Colorado Boulder

/**
 * MathSymbolFont is the font used for math symbols (e.g. 'x', 'y') in PhET sims.
 * See https://github.com/phetsims/scenery/issues/545
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../phet-core/js/merge.js';
import StringUtils from '../../phetcommon/js/util/StringUtils.js';
import Font from '../../scenery/js/util/Font.js';
import sceneryPhet from './sceneryPhet.js';

// constants
const FAMILY = '"Times New Roman", Times, serif';
const DEFAULT_OPTIONS = {
  style: 'italic'
};

class MathSymbolFont extends Font {

  /**
   * @param {Object|number|string} [options] number or string indicate the font size, otherwise same options as scenery.Font
   */
  constructor( options ) {

    assert && assert( arguments.length <= 1, 'Too many arguments' );

    // convenience constructor: new MathSymbolFont( {number|string} size )
    if ( typeof options === 'number' || typeof options === 'string' ) {
      options = merge( {}, DEFAULT_OPTIONS, {
        size: options
      } );
    }
    else {
      options = merge( {}, DEFAULT_OPTIONS, options );
    }

    assert && assert( !options.family, 'MathSymbolFont sets family' );
    options.family = FAMILY;

    super( options );
  }

  /**
   * Converts a string to the markup needed to display that string with RichText,
   * using the same family and style as MathSymbolFont.
   * @param {string} text
   * @param {string} [style] - see Font options.style
   * @returns {string}
   * @public
   */
  static getRichTextMarkup( text, style = DEFAULT_OPTIONS.style ) {
    assert && assert( Font.VALID_STYLES.includes( style ), `invalid style: ${style}` );
    return StringUtils.fillIn( '<span style=\'font-family: {{face}};font-style: {{style}}\'>{{text}}</span>', {
      face: FAMILY,
      style: style,
      text: text
    } );
  }
}

// @public
MathSymbolFont.FAMILY = FAMILY;

sceneryPhet.register( 'MathSymbolFont', MathSymbolFont );
export default MathSymbolFont;