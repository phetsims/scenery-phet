// Copyright 2013-2018, University of Colorado Boulder

/**
 * Slider that shows a spectrum of colors for selecting a wavelength.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var SpectrumSlider = require( 'SCENERY_PHET/SpectrumSlider' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Util = require( 'DOT/Util' );
  var VisibleColor = require( 'SCENERY_PHET/VisibleColor' );

  // strings
  var unitsNmString = require( 'string!SCENERY_PHET/units_nm' );
  var wavelengthSliderPattern0Wavelength1UnitsString = require( 'string!SCENERY_PHET/WavelengthSlider.pattern_0wavelength_1units' );

  /**
   * @param {Property.<number>} wavelengthProperty - wavelength, in nm
   * @param {Object} [options]
   * @constructor
   */
  function WavelengthSlider( wavelengthProperty, options ) {

    // options that are specific to this type
    options = _.extend( {

      minWavelength: VisibleColor.MIN_WAVELENGTH,
      maxWavelength: VisibleColor.MAX_WAVELENGTH,
      valueToString: function( value ) {
        return StringUtils.format( wavelengthSliderPattern0Wavelength1UnitsString, Util.toFixed( value, 0 ), unitsNmString );
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