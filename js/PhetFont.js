// Copyright 2002-2013, University of Colorado Boulder

/**
 * Encapsulation of the font used for PhET simulations.
 * Enforces a specific font family (with fallback).
 * <p>
 * Sample use:
 * new PhetFont( { size: 24, weight: 'bold' } )
 * new PhetFont( 24 )
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var Font = require( 'SCENERY/util/Font' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * @param {Number|*} options if number this is the font size, otherwise same options as scenery.Font
   * @constructor
   */
  function PhetFont( options ) {
    var defaultOptions = {
      family: '"Arial", sans-serif'
    };
    if ( typeof options === 'number' ) {
      defaultOptions.size = options;
      options = {};
    }
    Font.call( this, _.extend( defaultOptions, options ) );
  }

  return inherit( Font, PhetFont );
} );