// Copyright 2013-2023, University of Colorado Boulder

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

import { combineOptions } from '../../phet-core/js/optionize.js';
import { Font, FontOptions } from '../../scenery/js/imports.js';
import sceneryPhet from './sceneryPhet.js';
import sceneryPhetQueryParameters from './sceneryPhetQueryParameters.js';

export default class PhetFont extends Font {

  /**
   * @param providedOptions - number or string indicate the font size, otherwise same options as phet.scenery.Font
   */
  public constructor( providedOptions?: number | string | FontOptions ) {

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
    options = combineOptions<FontOptions>( {
      family: sceneryPhetQueryParameters.fontFamily!
    }, options );

    // Guarantee a fallback family
    assert && assert( options.family );
    options.family = `${options.family}, sans-serif`;

    super( options );
  }
}

sceneryPhet.register( 'PhetFont', PhetFont );
