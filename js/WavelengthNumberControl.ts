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
import SpectrumSliderThumb, { SpectrumSliderThumbOptions } from './SpectrumSliderThumb.js';
import SpectrumSliderTrack, { SpectrumSliderTrackOptions } from './SpectrumSliderTrack.js';
import VisibleColor from './VisibleColor.js';
import IProperty from '../../axon/js/IProperty.js';
import optionize from '../../phet-core/js/optionize.js';

const wavelengthNMValuePatternString = sceneryPhetStrings.wavelengthNMValuePattern;
const wavelengthString = sceneryPhetStrings.wavelength;

// constants
const DEFAULT_RANGE = new Range( VisibleColor.MIN_WAVELENGTH, VisibleColor.MAX_WAVELENGTH );
const DEFAULT_TRACK_SIZE = new Dimension2( 160, 20 );
const DEFAULT_THUMB_WIDTH = 25;
const DEFAULT_THUMB_HEIGHT = 25;
const DEFAULT_VALUE_TO_COLOR = VisibleColor.wavelengthToColor;

type SelfOptions = {
  title?: string;
  range?: Range; // in nm
  spectrumSliderTrackOptions?: SpectrumSliderTrackOptions;
  spectrumSliderThumbOptions?: SpectrumSliderThumbOptions;
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
      range: DEFAULT_RANGE,
      spectrumSliderTrackOptions: {
        valueToColor: DEFAULT_VALUE_TO_COLOR,
        size: DEFAULT_TRACK_SIZE
      },
      spectrumSliderThumbOptions: {
        valueToColor: DEFAULT_VALUE_TO_COLOR,
        width: DEFAULT_THUMB_WIDTH,
        height: DEFAULT_THUMB_HEIGHT,
        cursorHeight: DEFAULT_TRACK_SIZE.height
      }
    }, providedOptions );

    //TOD https://github.com/phetsims/scenery-phet/issues/730 it would be preferable to omit these from WavelengthNumberControlOptions
    if ( options.sliderOptions ) {
      assert && assert( !options.sliderOptions.trackNode, 'WavelengthNumberControl sets trackNode' );
      assert && assert( !options.sliderOptions.thumbNode, 'WavelengthNumberControl sets thumbNode' );
    }

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
          trackNode: new SpectrumSliderTrack( wavelengthProperty, options.range, options.spectrumSliderTrackOptions ),
          thumbNode: new SpectrumSliderThumb( wavelengthProperty, options.spectrumSliderThumbOptions )
        },
        layoutFunction: NumberControl.createLayoutFunction3()
      }, options ) );
  }
}

sceneryPhet.register( 'WavelengthNumberControl', WavelengthNumberControl );
export default WavelengthNumberControl;