// Copyright 2013-2021, University of Colorado Boulder

/**
 * Provides a 2-way mapping between wavelength and Color.
 * The mapping is performed using a color lookup table.
 *
 * Note that the sRGB colorspace is not capable of representing all visible colors.
 * So in converting visible wavelengths to Color, it is possible to lose some color information.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Utils from '../../dot/js/Utils.js';
import merge from '../../phet-core/js/merge.js';
import Color from '../../scenery/js/util/Color.js';
import sceneryPhet from './sceneryPhet.js';

// constants
const COLOR_MATCH_DELTA = 2; // Two colors match if their RGB components each differ by less than this amount.
const SPEED_OF_LIGHT = 299792458; // The speed of light in a vacuum in meters/second

const VIOLET_WAVELENGTH = 380; // nanometers
const RED_WAVELENGTH = 780; // nanometers

// Create the color tables on demand, since they take up 282kb per table or so
let REDUCED_INTENSITY_COLOR_TABLE = null;
let FULL_INTENSITY_COLOR_TABLE = null;

const VisibleColor = {

  // public constants
  MIN_WAVELENGTH: VIOLET_WAVELENGTH, // in nanometers
  MAX_WAVELENGTH: RED_WAVELENGTH, // in nanometers
  MIN_FREQUENCY: SPEED_OF_LIGHT / RED_WAVELENGTH * 1E9, // in Hz
  MAX_FREQUENCY: SPEED_OF_LIGHT / VIOLET_WAVELENGTH * 1E9, // in Hz
  SPEED_OF_LIGHT: SPEED_OF_LIGHT, // The speed of light in a vacuum in meters/second
  WHITE_WAVELENGTH: 0,

  /**
   * Converts a wavelength to a visible color.
   *
   * @param {number} wavelength in nanometers will be rounded to the closest integer value
   * @param {Object} [options]
   * @returns {Color|null}
   */
  wavelengthToColor: function( wavelength, options ) {

    options = merge( {
      irColor: null, // {Color|string|null} color to use for IR wavelengths
      uvColor: null,  // {Color|string|null} color to use for UV wavelengths
      reduceIntensityAtExtrema: true // {boolean} whether intensity should fall off at high and low wavelength
    }, options );

    let color = null;
    if ( wavelength === VisibleColor.WHITE_WAVELENGTH ) { // white light
      color = Color.WHITE;
    }
    else if ( wavelength < VisibleColor.MIN_WAVELENGTH ) { // IR
      color = Color.toColor( options.irColor );
    }
    else if ( wavelength > VisibleColor.MAX_WAVELENGTH ) { // UV
      color = Color.toColor( options.uvColor );
    }
    else { // lookup visible color
      const colorTable = VisibleColor.getColorTable( options.reduceIntensityAtExtrema );
      color = colorTable[ Utils.roundSymmetric( wavelength ) - VisibleColor.MIN_WAVELENGTH ];
    }

    assert && assert( color, `color not found for wavelength ${wavelength}` );
    return color;
  },

  /**
   * Converts a frequency (in Hz) to a visible color.
   *
   * @param {number} frequency - frequency in Hz
   * @param {Object} [options]
   * @returns {Color|null}
   */
  frequencyToColor: function( frequency, options ) {
    const wavelengthInMeters = SPEED_OF_LIGHT / frequency;
    const wavelengthInNanometers = wavelengthInMeters * 1E9;
    return VisibleColor.wavelengthToColor( wavelengthInNanometers, options );
  },

  /**
   * Determines which color table to use based on the options.  This assumes options have been filled in by the call
   * site, hence uses config instead of options.
   * @param {boolean} reduceIntensityAtExtrema
   * @returns {Color[]} the color table
   * @private
   */
  getColorTable: function( reduceIntensityAtExtrema ) {
    if ( reduceIntensityAtExtrema ) {

      // cache for future use
      REDUCED_INTENSITY_COLOR_TABLE = REDUCED_INTENSITY_COLOR_TABLE || createColorTable( true );
      return REDUCED_INTENSITY_COLOR_TABLE;
    }
    else {

      // cache for future use
      FULL_INTENSITY_COLOR_TABLE = FULL_INTENSITY_COLOR_TABLE || createColorTable( false );
      return FULL_INTENSITY_COLOR_TABLE;
    }
  },

  /**
   * Converts a Color to its corresponding wavelength. Relies on a color lookup table that is initialized the first
   * time that this method is called.  Color lookup is based on RGB component value; the alpha value is ignored.
   *
   * @param {Color|string} color - the color
   * @param {Object} [options]
   * @returns {number} the wavelength in nanometers
   * @public
   */
  colorToWavelength: function( color, options ) {

    options = merge( {
      reduceIntensityAtExtrema: true // {boolean} whether intensity should fall off at high and low wavelength
    }, options );

    color = Color.toColor( color );

    let wavelength = -1;

    if ( color.equals( Color.WHITE ) ) {
      wavelength = VisibleColor.WHITE_WAVELENGTH;
    }
    else {
      const colorTable = VisibleColor.getColorTable( options.reduceIntensityAtExtrema );
      for ( let i = 0; i < colorTable.length; i++ ) {
        if ( Math.abs( color.getRed() - colorTable[ i ].getRed() ) < COLOR_MATCH_DELTA &&
             Math.abs( color.getGreen() - colorTable[ i ].getGreen() ) < COLOR_MATCH_DELTA &&
             Math.abs( color.getBlue() - colorTable[ i ].getBlue() ) < COLOR_MATCH_DELTA ) {
          wavelength = VisibleColor.MIN_WAVELENGTH + i;
          break;
        }
      }
    }

    assert && assert( wavelength !== -1, `no wavelength found for color ${color.toString()}` );
    return wavelength;
  }
};

/**
 * Creates a table that is used to map wavelength in nanometers to Color.
 * @param {boolean} reduceIntensityAtExtrema - whether the intensity should be reduced and high and low wavelength
 * @returns {Color[]}
 */
function createColorTable( reduceIntensityAtExtrema ) {

  const colorTable = [];

  // Allocate the lookup table
  const numWavelengths = Math.floor( VisibleColor.MAX_WAVELENGTH - VisibleColor.MIN_WAVELENGTH + 1 );

  // Populate the lookup table
  let wavelength;
  let r;
  let g;
  let b;
  for ( let i = 0; i < numWavelengths; i++ ) {

    // Create the RGB component values.
    wavelength = VisibleColor.MIN_WAVELENGTH + i;
    r = g = b = 0;

    // Determine the RGB component values.
    if ( wavelength >= 380 && wavelength <= 440 ) {
      r = -1 * ( wavelength - 440 ) / ( 440 - 380 );
      g = 0;
      b = 1;
    }
    else if ( wavelength > 440 && wavelength <= 490 ) {
      r = 0;
      g = ( wavelength - 440 ) / ( 490 - 440 );
      b = 1;
    }
    else if ( wavelength > 490 && wavelength <= 510 ) {
      r = 0;
      g = 1;
      b = -1 * ( wavelength - 510 ) / ( 510 - 490 );
    }
    else if ( wavelength > 510 && wavelength <= 580 ) {
      r = ( wavelength - 510 ) / ( 580 - 510 );
      g = 1;
      b = 0;
    }
    else if ( wavelength > 580 && wavelength <= 645 ) {
      r = 1;
      g = -1 * ( wavelength - 645 ) / ( 645 - 580 );
      b = 0;
    }
    else if ( wavelength > 645 && wavelength <= 780 ) {
      r = 1;
      g = 0;
      b = 0;
    }

    // Let the intensity fall off near the vision limits.
    let intensity;
    if ( reduceIntensityAtExtrema && wavelength > 645 ) {
      intensity = 0.3 + 0.7 * ( 780 - wavelength ) / ( 780 - 645 );
    }
    else if ( reduceIntensityAtExtrema && wavelength < 420 ) {
      intensity = 0.3 + 0.7 * ( wavelength - 380 ) / ( 420 - 380 );
    }
    else {
      intensity = 1;
    }
    const red = Utils.roundSymmetric( 255 * ( intensity * r ) );
    const green = Utils.roundSymmetric( 255 * ( intensity * g ) );
    const blue = Utils.roundSymmetric( 255 * ( intensity * b ) );
    const alpha = 1;

    // Add the color to the lookup array.
    colorTable[ i ] = new Color( red, green, blue, alpha );
  }

  return colorTable;
}

sceneryPhet.register( 'VisibleColor', VisibleColor );
export default VisibleColor;