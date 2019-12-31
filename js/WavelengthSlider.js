// Copyright 2013-2019, University of Colorado Boulder

/**
 * Slider that shows a spectrum of colors for selecting a wavelength.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const merge = require( 'PHET_CORE/merge' );
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  const SpectrumSlider = require( 'SCENERY_PHET/SpectrumSlider' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Utils = require( 'DOT/Utils' );
  const VisibleColor = require( 'SCENERY_PHET/VisibleColor' );

  // strings
  const unitsNmString = require( 'string!SCENERY_PHET/units_nm' );
  const wavelengthSliderPattern0Wavelength1UnitsString = require( 'string!SCENERY_PHET/WavelengthSlider.pattern_0wavelength_1units' );

  /**
   * @param {Property.<number>} wavelengthProperty - wavelength, in nm
   * @param {Object} [options]
   * @constructor
   */
  function WavelengthSlider( wavelengthProperty, options ) {

    // options that are specific to this type
    options = merge( {

      minWavelength: VisibleColor.MIN_WAVELENGTH,
      maxWavelength: VisibleColor.MAX_WAVELENGTH,
      valueToString: function( value ) {
        return StringUtils.format( wavelengthSliderPattern0Wavelength1UnitsString, Utils.toFixed( value, 0 ), unitsNmString );
      },
      valueToColor: function( value ) {
        return VisibleColor.wavelengthToColor( value );
      }
    }, options );
    assert && assert( options.minValue === undefined, 'minValue is supplied by WavelengthSlider' );
    assert && assert( options.maxValue === undefined, 'maxValue is supplied by WavelengthSlider' );
    options.minValue = options.minWavelength;
    options.maxValue = options.maxWavelength;

    SpectrumSlider.call( this, wavelengthProperty, options );
  }

  sceneryPhet.register( 'WavelengthSlider', WavelengthSlider );

  return inherit( SpectrumSlider, WavelengthSlider );
} );