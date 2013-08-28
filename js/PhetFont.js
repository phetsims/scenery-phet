// Copyright 2002-2013, University of Colorado Boulder

/**
 * Encapsulation of the font used for PhET simulations.
 * Provides PhET-specific defaults, and guarantees a fallback for font family.
 * <p>
 * Sample use:
 * new PhetFont( { family: 'Futura', size: 24, weight: 'bold' } )
 * new PhetFont( 24 )
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var assert = require( 'ASSERT/assert' )( 'scenery-phet' );
  var Font = require( 'SCENERY/util/Font' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * @param {Number|*} options if number this is the font size, otherwise same options as scenery.Font
   * @constructor
   */
  function PhetFont( options ) {

    // convenience constructor: new PhetFont( size )
    if ( typeof options === 'number' ) {
      options = { size: options };
    }

    // PhET defaults
    options = _.extend( {
      family: 'Arial'
    }, options );

    // Guarantee a fallback family
    assert && assert( options.family );
    options.family = options.family + ', sans-serif';

    Font.call( this, options );
  }

  return inherit( Font, PhetFont );
} );