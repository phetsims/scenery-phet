// Copyright 2013-2020, University of Colorado Boulder

/**
 * Slider that shows a spectrum of colors for selecting a wavelength.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Utils from '../../dot/js/Utils.js';
import inherit from '../../phet-core/js/inherit.js';
import merge from '../../phet-core/js/merge.js';
import StringUtils from '../../phetcommon/js/util/StringUtils.js';
import sceneryPhetStrings from './sceneryPhetStrings.js';
import sceneryPhet from './sceneryPhet.js';
import SpectrumSlider from './SpectrumSlider.js';
import VisibleColor from './VisibleColor.js';

const unitsNmString = sceneryPhetStrings.units_nm;
const wavelengthSliderPattern0Wavelength1UnitsString = sceneryPhetStrings.WavelengthSlider.pattern_0wavelength_1units;

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

inherit( SpectrumSlider, WavelengthSlider );
export default WavelengthSlider;