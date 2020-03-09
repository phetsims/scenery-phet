// Copyright 2013-2020, University of Colorado Boulder

/**
 * DO NOT USE IN NEW DEVELOPMENT - see deprecation notice below
 *
 * MultiLine plain text, with alignment.
 * Lines are separated with the newline character '\n', which will be converted to '<br>'.
 * This was reimplemented as a subclass of RichText, see https://github.com/phetsims/scenery-phet/issues/392.
 *
 * @author Sam Reid
 * @author Chris Malley (PixelZoom, Inc.)
 * @deprecated - this has been supplanted by SCENERY/nodes/RichText
 */

import deprecationWarning from '../../phet-core/js/deprecationWarning.js';
import merge from '../../phet-core/js/merge.js';
import RichText from '../../scenery/js/nodes/RichText.js';
import PhetFont from './PhetFont.js';
import sceneryPhet from './sceneryPhet.js';

class MultiLineText extends RichText {

  /**
   * @param {string} text - newlines will be replaced with '<br>'.
   * @param {Object} [options]
   */
  constructor( text, options ) {
    assert && deprecationWarning( 'MultiLineText is deprecated, please use RichText instead' );

    options = merge( {

      // RichText options
      align: 'center',
      font: new PhetFont()
    }, options );

    super( replaceNewlines( text ), options );
  }

  /**
   * Sets the text, replacing newlines with '<br>'.
   * @param {string} text
   * @public
   * @override
   */
  setText( text ) {
    super.setText( replaceNewlines( text ) );
  }
}

/**
 * Replaces newline characters with '<br>'.
 * @param {string} text
 * @returns {string}
 */
function replaceNewlines( text ) {
  return text.replace( /\n/g, '<br>' );
}

sceneryPhet.register( 'MultiLineText', MultiLineText );
export default MultiLineText;