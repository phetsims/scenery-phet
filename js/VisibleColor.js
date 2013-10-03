// Copyright 2002-2013, University of Colorado Boulder

/**
 * Converts a wavelength to a visible color.
 * If the wavelength is not in the visible spectrum, null is returned.
 */
define( function( require ) {
  'use strict';

  // imports
  var Color = require( 'SCENERY/util/Color' );

  function VisibleColor() {}

  // public constants
  VisibleColor.MIN_WAVELENGTH = 380;
  VisibleColor.MAX_WAVELENGTH = 780;

  /**
   * Creates a table that is used to map wavelength to Color.
   * @return {Array<Color>}
   */
  var createColorTable = function() {

    var colorTable = [];

    // Allocate the color-lookup array.
    var numWavelengths = Math.floor( VisibleColor.MAX_WAVELENGTH - VisibleColor.MIN_WAVELENGTH + 1 );

    // Populate the color array.
    var wl;
    var r, g, b;
    for ( var i = 0; i < numWavelengths; i++ ) {
      // Create the RGB component values.
      wl = VisibleColor.MIN_WAVELENGTH + i;
      r = g = b = 0;

      // Determine the RGB component values.
      if ( wl >= 380 && wl <= 440 ) {
        r = -1 * ( wl - 440 ) / ( 440 - 380 );
        g = 0;
        b = 1;
      }
      else if ( wl > 440 && wl <= 490 ) {
        r = 0;
        g = ( wl - 440 ) / ( 490 - 440 );
        b = 1;
      }
      else if ( wl > 490 && wl <= 510 ) {
        r = 0;
        g = 1;
        b = -1 * ( wl - 510 ) / ( 510 - 490 );
      }
      else if ( wl > 510 && wl <= 580 ) {
        r = ( wl - 510 ) / ( 580 - 510 );
        g = 1;
        b = 0;
      }
      else if ( wl > 580 && wl <= 645 ) {
        r = 1;
        g = -1 * ( wl - 645 ) / ( 645 - 580 );
        b = 0;
      }
      else if ( wl > 645 && wl <= 780 ) {
        r = 1;
        g = 0;
        b = 0;
      }

      // Let the intensity fall off near the vision limits.
      var intensity;
      if ( wl > 645 ) {
        intensity = 0.3 + 0.7 * ( 780 - wl ) / ( 780 - 645 );
      }
      else if ( wl < 420 ) {
        intensity = 0.3 + 0.7 * ( wl - 380 ) / ( 420 - 380 );
      }
      else {
        intensity = 1;
      }
      var red = Math.round( 255 * ( intensity * r ) );
      var green = Math.round( 255 * ( intensity * g ) );
      var blue = Math.round( 255 * ( intensity * b ) );
      var alpha = 1;

      // Add the color to the lookup array.
      colorTable[i] = new Color( red, green, blue, alpha );
    }

    return colorTable;
  };

  // Eagerly create the color table.
  var COLOR_TABLE = createColorTable();

  /**
   * Converts a wavelength to a visible color.
   * @param {Number} wavelength will be rounded to the closest integer value
   * @return {Number|null} null if wavelength is not in the visible spectrum
   */
  VisibleColor.wavelengthToColor = function( wavelength ) {
    if ( wavelength < VisibleColor.MIN_WAVELENGTH || wavelength > VisibleColor.MAX_WAVELENGTH ) {
      return null; // Wavelength is not visible.
    }
    else {
      return COLOR_TABLE[ Math.round( wavelength ) - VisibleColor.MIN_WAVELENGTH ];
    }
  };

  return VisibleColor;
} );
