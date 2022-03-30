// Copyright 2019-2022, University of Colorado Boulder

/**
 * NumberControl that shows a spectrum of colors for selecting a wavelength.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Dimension2 from '../../dot/js/Dimension2.js';
import Range from '../../dot/js/Range.js';
import NumberControl, { NumberControlOptions } from './NumberControl.js';
import PhetFont from './PhetFont.js';
import sceneryPhetStrings from './sceneryPhetStrings.js';
import sceneryPhet from './sceneryPhet.js';
import SpectrumSliderThumb from './SpectrumSliderThumb.js';
import SpectrumSliderTrack from './SpectrumSliderTrack.js';
import VisibleColor from './VisibleColor.js';
import IProperty from '../../axon/js/IProperty.js';
import optionize from '../../phet-core/js/optionize.js';

const wavelengthNMValuePatternString = sceneryPhetStrings.wavelengthNMValuePattern;
const wavelengthString = sceneryPhetStrings.wavelength;

// constants
const DEFAULT_RANGE = new Range( VisibleColor.MIN_WAVELENGTH, VisibleColor.MAX_WAVELENGTH );

type SelfOptions = {
  title?: string;
  range?: Range; // in nm
  trackHeight?: number; // in view coordinates
};

export type WavelengthNumberControlOptions = SelfOptions & NumberControlOptions;

/**
 * @param {Property.<number>} wavelengthProperty - wavelength, in nm
 * @param {Object} [options]
 * @constructor
 */
class WavelengthNumberControl extends NumberControl {

  /**
   * @param wavelengthProperty - in nm
   * @param providedOptions
   */
  constructor( wavelengthProperty: IProperty<number>, providedOptions?: WavelengthNumberControlOptions ) {

    const options = optionize<WavelengthNumberControlOptions, SelfOptions, NumberControlOptions>( {
      title: wavelengthString,
      range: DEFAULT_RANGE, // in nm
      trackHeight: 20 // in view coordinates
    }, providedOptions );

    const trackHeight = options.trackHeight;

    super( options.title, wavelengthProperty, options.range,
      optionize<NumberControlOptions, {}, NumberControlOptions>( {
        titleNodeOptions: {
          font: new PhetFont( 15 ),
          maxWidth: 175
        },
        numberDisplayOptions: {
          textOptions: {
            font: new PhetFont( 14 )
          },
          valuePattern: wavelengthNMValuePatternString,
          maxWidth: 120
        },
        sliderOptions: {
          trackNode: new SpectrumSliderTrack( wavelengthProperty, options.range, {
            valueToColor: VisibleColor.wavelengthToColor,
            size: new Dimension2( 160, trackHeight )
          } ),
          thumbNode: new SpectrumSliderThumb( wavelengthProperty, {
            valueToColor: VisibleColor.wavelengthToColor,
            width: 25,
            height: 25,
            cursorHeight: trackHeight
          } )
        },
        layoutFunction: NumberControl.createLayoutFunction3()
      }, options ) );
  }
}

sceneryPhet.register( 'WavelengthNumberControl', WavelengthNumberControl );
export default WavelengthNumberControl;