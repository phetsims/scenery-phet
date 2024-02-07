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

    options.family = [
      options.family,

      // A sans-serif backup that should be web-safe
      'Arial',

      // Backups for other scripts for macOS Safari (since we are getting issues, see
      // https://github.com/phetsims/website-meteor/issues/656) somewhat modeled on
      // https://github.com/alacritty/alacritty/issues/45#issuecomment-301343001 or
      // https://www.figma.com/blog/when-fonts-fall/
      // NOTE: This is SVG-specific, does not happen in Canvas.
      '"Bangla MN"', // actually solves locale=bn on macOS Safari
      '"Bangla Sangam MN"',
      'Ayuthaya', // actually solves locale=th on macOS Safari
      '"Devanagari MT"', // actually solves locale=hi on macOS Safari
      'Kailasa',
      '"PingFang SC"',
      '"PingFang TC"',
      '"Hiragino Sans"',
      '"Hiragino Sans GB"',
      '"Apple SD Gothic Neo"',
      '"PingFang HK"',
      '"Kohinoor Bangla"',
      '"Kohinoor Devanagari"',
      '"Gujarati Sangam MN"',
      '"Gurmukhi MN"',
      '"Kannada Sangam MN"',
      '"Khmer Sangam MN"',
      '"Lao Sangam MN"',
      '"Malayalam Sangam MN"',
      '"Myanmar Sangam MN"',
      '"Oriya Sangam MN"',
      '"Sinhala Sangam MN"',
      '"Tamil Sangam MN"',
      '"Kohinoor Telugu"',
      'Mshtakan',
      '"Euphemia UCAS"',
      '"Plantagenet Cherokee"',
      '"Apple Color Emoji"',
      '"Tiro Devangari Hindi"',
      'sans-serif'
    ].join( ', ' );

    super( options );
  }
}

sceneryPhet.register( 'PhetFont', PhetFont );
