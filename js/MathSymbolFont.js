// Copyright 2016, University of Colorado Boulder

/**
 * Font used for math symbols, e.g. 'x', 'y'.
 * See https://github.com/phetsims/scenery/issues/545
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var functionBuilder = require( 'FUNCTION_BUILDER/functionBuilder' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Font = require( 'SCENERY/util/Font' );

  /**
   * @param {Object|number} [options]
   * @constructor
   */
  function MathSymbolFont( options ) {

    // convenience for specifying font size only, e.g. new MathSymbolFont(24)
    if ( typeof options === 'number' ) {
      options = { size: options };
    }

    // font options, see scenery.Font
    options = _.extend( {
      family: '"Times New Roman", Times, serif',
      style: 'italic'
    }, options );

    Font.call( this, options );
  }

  functionBuilder.register( 'MathSymbolFont', MathSymbolFont );

  return inherit( Font, MathSymbolFont );
} );
