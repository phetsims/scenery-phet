// Copyright 2016-2017, University of Colorado Boulder

/**
 * Font used for math symbols, e.g. 'x', 'y'.
 * See https://github.com/phetsims/scenery/issues/545
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Font = require( 'SCENERY/util/Font' );
  var inherit = require( 'PHET_CORE/inherit' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );

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
    options.family = '"Times New Roman", Times, serif';

    assert && assert( !options.style, 'this type sets style' );
    options.style = 'italic';

    Font.call( this, options );
  }

  sceneryPhet.register( 'MathSymbolFont', MathSymbolFont );

  return inherit( Font, MathSymbolFont );
} );
