// Copyright 2002-2013, University of Colorado Boulder

/**
 * Encapsulation of the font used for PhET simulations.
 * Enforces a specific font family (with fallback) and limited options.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var Font = require( 'SCENERY/util/Font' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * @param {Number} size in pixels
   * @param {String} weight normal | bold | bolder | lighter
   * @constructor
   */
  function PhetFont( size, weight ) {
    Font.call( this, {
      family: '"Arial", sans-serif',
      size: ( size + 'px' ),
      weight: weight || 'normal'
    } );
  }

  inherit( Font, PhetFont );

  return PhetFont;
} );