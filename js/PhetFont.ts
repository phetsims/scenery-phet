// Copyright 2013-2021, University of Colorado Boulder

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

import merge from '../../phet-core/js/merge.js';
import { Font, FontOptions } from '../../scenery/js/imports.js';
import sceneryPhet from './sceneryPhet.js';

class PhetFont extends Font {

  /**
   * @param [options] number or string indicate the font size, otherwise same options as scenery.Font
   */
  constructor( providedOptions?: number | string | FontOptions ) {

    assert && assert( arguments.length === 0 || arguments.length === 1, 'Too many arguments' );

    // convenience constructor: new PhetFont( {number|string} size )
    let options: FontOptions;
    if ( typeof providedOptions === 'number' || typeof providedOptions === 'string' ) {
      options = { size: providedOptions };
    }
    else {
      options = providedOptions || {};
    }

    // PhET defaults
    options = merge( {
      family: 'Arial'
    }, options );

    // Guarantee a fallback family
    assert && assert( options.family );
    options.family = `${options.family}, sans-serif`;

    super( options );
  }
}

sceneryPhet.register( 'PhetFont', PhetFont );
export default PhetFont;