// Copyright 2013-2022, University of Colorado Boulder

/**
 * Slider that shows a spectrum of colors for selecting a wavelength.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import TProperty from '../../axon/js/TProperty.js';
import StrictOmit from '../../phet-core/js/types/StrictOmit.js';
import Utils from '../../dot/js/Utils.js';
import optionize from '../../phet-core/js/optionize.js';
import StringUtils from '../../phetcommon/js/util/StringUtils.js';
import sceneryPhet from './sceneryPhet.js';
import sceneryPhetStrings from './sceneryPhetStrings.js';
import SpectrumSlider, { SpectrumSliderOptions } from './SpectrumSlider.js';
import VisibleColor from './VisibleColor.js';

type SelfOptions = {
  minWavelength?: number;
  maxWavelength?: number;
};

export type WavelengthSliderOptions = SelfOptions & StrictOmit<SpectrumSliderOptions, 'minValue' | 'maxValue'>;

/**
 * @deprecated use WavelengthNumberControl, or Slider.js with SpectrumSliderTrack and SpectrumSliderTrack,
 *   see https://github.com/phetsims/scenery-phet/issues/729
 */
export default class WavelengthSlider extends SpectrumSlider {

  /**
   * @param wavelengthProperty - wavelength, in nm
   * @param providedOptions
   */
  public constructor( wavelengthProperty: TProperty<number>, providedOptions?: WavelengthSliderOptions ) {

    // options that are specific to this type
    const options = optionize<WavelengthSliderOptions, SelfOptions, SpectrumSliderOptions>()( {

      // SelfOptions
      minWavelength: VisibleColor.MIN_WAVELENGTH,
      maxWavelength: VisibleColor.MAX_WAVELENGTH,

      // SpectrumSliderOptions
      valueToString: function( value: number ) {
        return StringUtils.format( sceneryPhetStrings.WavelengthSlider.pattern_0wavelength_1units,
          Utils.toFixed( value, 0 ), sceneryPhetStrings.units_nm );
      },
      valueToColor: function( value: number ) {
        return VisibleColor.wavelengthToColor( value );
      }
    }, providedOptions );

    options.minValue = options.minWavelength;
    options.maxValue = options.maxWavelength;

    super( wavelengthProperty, options );
  }
}

sceneryPhet.register( 'WavelengthSlider', WavelengthSlider );