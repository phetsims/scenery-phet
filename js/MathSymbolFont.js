// Copyright 2016-2020, University of Colorado Boulder

/**
 * Font used for math symbols, e.g. 'x', 'y'.
 * See https://github.com/phetsims/scenery/issues/545
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import inherit from '../../phet-core/js/inherit.js';
import StringUtils from '../../phetcommon/js/util/StringUtils.js';
import Font from '../../scenery/js/util/Font.js';
import sceneryPhet from './sceneryPhet.js';

// constants
const FAMILY = '"Times New Roman", Times, serif';

/**
 * @param {Object|number|string} [options] number or string indicate the font size, otherwise same options as scenery.Font
 * @constructor
 */
function MathSymbolFont( options ) {

  assert && assert( arguments.length === 0 || arguments.length === 1, 'Too many arguments' );

  options = options || {};

  // convenience constructor: new MathSymbolFont( {number|string} size )
  if ( typeof options === 'number' || typeof options === 'string' ) {
    options = { size: options };
  }

  assert && assert( !options.family, 'this type sets family' );
  options.family = FAMILY;

  assert && assert( !options.style, 'this type sets style' );
  options.style = 'italic';

  Font.call( this, options );
}

sceneryPhet.register( 'MathSymbolFont', MathSymbolFont );

inherit( Font, MathSymbolFont, {}, {

  // @public @static
  FAMILY: FAMILY,

  /**
   * Converts a string to the markup needed to display that string with RichText,
   * using the same family and style as MathSymbolFont.
   * @param {string} text
   * @returns {string}
   * @public
   * @static
   */
  getRichTextMarkup: function( text ) {
    return StringUtils.fillIn( '<i><span style=\'font-family: {{face}};\'>{{text}}</span></i>', {
      face: FAMILY,
      text: text
    } );
  }
} );

export default MathSymbolFont;