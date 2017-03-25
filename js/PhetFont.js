// Copyright 2013-2017, University of Colorado Boulder

/**
 * Encapsulation of the font used for PhET simulations.
 * Provides PhET-specific defaults, and guarantees a fallback for font family.
 *
 * Sample use:
 * new PhetFont( { family: 'Futura', size: 24, weight: 'bold' } )
 * new PhetFont( 24 )
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Font = require( 'SCENERY/util/Font' );
  var inherit = require( 'PHET_CORE/inherit' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var Tandem = require( 'TANDEM/Tandem' );
  var TFont = require( 'SCENERY/util/TFont' ); // TODO: we should have TPhetFont

  /**
   * @param {number|Object} [options] if number this is the font size, otherwise same options as scenery.Font
   * @constructor
   */
  function PhetFont( options ) {

    // convenience constructor: new PhetFont( {number|string} size )
    if ( typeof options === 'number' || typeof options === 'string' ) {
      options = { size: options };
    }

    assert && assert( arguments.length === 0 || arguments.length === 1, 'Too many arguments' );

    // PhET defaults
    options = _.extend( {
      family: 'Arial',
      tandem: Tandem.tandemOptional()
    }, options );

    // Guarantee a fallback family
    assert && assert( options.family );
    options.family = options.family + ', sans-serif';

    Font.call( this, options );

    options.tandem.addInstance( this, TFont );
  }

  sceneryPhet.register( 'PhetFont', PhetFont );

  return inherit( Font, PhetFont );
} );
