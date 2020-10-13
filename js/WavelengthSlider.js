// Copyright 2013-2020, University of Colorado Boulder

/**
 * Slider that shows a spectrum of colors for selecting a wavelength.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Utils from '../../dot/js/Utils.js';
import merge from '../../phet-core/js/merge.js';
import StringUtils from '../../phetcommon/js/util/StringUtils.js';
import sceneryPhet from './sceneryPhet.js';
import sceneryPhetStrings from './sceneryPhetStrings.js';
import SpectrumSlider from './SpectrumSlider.js';
import VisibleColor from './VisibleColor.js';

class WavelengthSlider extends SpectrumSlider {

  /**
   * @param {Property.<number>} wavelengthProperty - wavelength, in nm
   * @param {Object} [options]
   */
  constructor( wavelengthProperty, options ) {

    // options that are specific to this type
    options = merge( {

      minWavelength: VisibleColor.MIN_WAVELENGTH,
      maxWavelength: VisibleColor.MAX_WAVELENGTH,
      valueToString: function( value ) {
        return StringUtils.format( sceneryPhetStrings.WavelengthSlider.pattern_0wavelength_1units,
          Utils.toFixed( value, 0 ), sceneryPhetStrings.units_nm );
      },
      valueToColor: function( value ) {
        return VisibleColor.wavelengthToColor( value );
      }
    }, options );
    assert && assert( options.minValue === undefined, 'minValue is supplied by WavelengthSlider' );
    assert && assert( options.maxValue === undefined, 'maxValue is supplied by WavelengthSlider' );
    options.minValue = options.minWavelength;
    options.maxValue = options.maxWavelength;

    super( wavelengthProperty, options );
  }
}

sceneryPhet.register( 'WavelengthSlider', WavelengthSlider );
export default WavelengthSlider;