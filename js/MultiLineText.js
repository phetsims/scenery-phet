// Copyright 2013-2018, University of Colorado Boulder

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
define( require => {
  'use strict';

  // modules
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var RichText = require( 'SCENERY/nodes/RichText' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );

  class MultiLineText extends RichText {

    /**
     * @param {string} text - newlines will be replaced with '<br>'.
     * @param {Object} [options]
     */
    constructor( text, options ) {

      options = _.extend( {

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

  return sceneryPhet.register( 'MultiLineText', MultiLineText );
} );
