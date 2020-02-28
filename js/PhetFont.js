// Copyright 2013-2020, University of Colorado Boulder

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

import inherit from '../../phet-core/js/inherit.js';
import merge from '../../phet-core/js/merge.js';
import Font from '../../scenery/js/util/Font.js';
import sceneryPhet from './sceneryPhet.js';

/**
 * @param {number|string|Object} [options] number or string indicate the font size, otherwise same options as scenery.Font
 * @constructor
 */
function PhetFont( options ) {

  assert && assert( arguments.length === 0 || arguments.length === 1, 'Too many arguments' );

  // convenience constructor: new PhetFont( {number|string} size )
  if ( typeof options === 'number' || typeof options === 'string' ) {
    options = { size: options };
  }

  // PhET defaults
  options = merge( {
    family: 'Arial'
  }, options );

  // Guarantee a fallback family
  assert && assert( options.family );
  options.family = options.family + ', sans-serif';

  Font.call( this, options );
}

sceneryPhet.register( 'PhetFont', PhetFont );

inherit( Font, PhetFont );
export default PhetFont;