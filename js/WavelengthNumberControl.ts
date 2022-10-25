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
import SceneryPhetStrings from './SceneryPhetStrings.js';
import sceneryPhet from './sceneryPhet.js';
import SpectrumSliderThumb, { SpectrumSliderThumbOptions } from './SpectrumSliderThumb.js';
import SpectrumSliderTrack, { SpectrumSliderTrackOptions } from './SpectrumSliderTrack.js';
import VisibleColor from './VisibleColor.js';
import optionize, { combineOptions } from '../../phet-core/js/optionize.js';
import Tandem from '../../tandem/js/Tandem.js';
import Slider from '../../sun/js/Slider.js';
import Property from '../../axon/js/Property.js';
import NestedStrictOmit from '../../phet-core/js/types/NestedStrictOmit.js';
import TReadOnlyProperty from '../../axon/js/TReadOnlyProperty.js';

// constants
const DEFAULT_RANGE = new Range( VisibleColor.MIN_WAVELENGTH, VisibleColor.MAX_WAVELENGTH );
const DEFAULT_TRACK_SIZE = new Dimension2( 160, 20 );
const DEFAULT_THUMB_WIDTH = 25;
const DEFAULT_THUMB_HEIGHT = 25;
const DEFAULT_VALUE_TO_COLOR = VisibleColor.wavelengthToColor;

type SelfOptions = {
  title?: string | TReadOnlyProperty<string>;
  range?: Range; // in nm
  spectrumSliderTrackOptions?: SpectrumSliderTrackOptions;
  spectrumSliderThumbOptions?: SpectrumSliderThumbOptions;
};

export type WavelengthNumberControlOptions = SelfOptions &
  NestedStrictOmit<NumberControlOptions, 'sliderOptions', 'trackNode' | 'thumbNode'>;

/**
 * @param wavelengthProperty - wavelength, in nm
 * @param [options]
 * @constructor
 */
export default class WavelengthNumberControl extends NumberControl {

  /**
   * @param wavelengthProperty - in nm
   * @param providedOptions
   */
  public constructor( wavelengthProperty: Property<number>, providedOptions?: WavelengthNumberControlOptions ) {

    const options = optionize<WavelengthNumberControlOptions, SelfOptions, NumberControlOptions>()( {
      title: SceneryPhetStrings.wavelengthStringProperty,
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
      },
      tandem: Tandem.REQUIRED,
      tandemNameSuffix: 'Control'
    }, providedOptions );

    const trackNode = new SpectrumSliderTrack( wavelengthProperty, options.range,
      combineOptions<SpectrumSliderTrackOptions>( {
        tandem: options.tandem.createTandem( NumberControl.SLIDER_TANDEM_NAME ).createTandem( Slider.TRACK_NODE_TANDEM_NAME )
      }, options.spectrumSliderTrackOptions ) );

    const thumbNode = new SpectrumSliderThumb( wavelengthProperty,
      combineOptions<SpectrumSliderThumbOptions>( {
        tandem: options.tandem.createTandem( NumberControl.SLIDER_TANDEM_NAME ).createTandem( Slider.THUMB_NODE_TANDEM_NAME )
      }, options.spectrumSliderThumbOptions ) );

    super( options.title, wavelengthProperty, options.range, combineOptions<NumberControlOptions>( {
      titleNodeOptions: {
        font: new PhetFont( 15 ),
        maxWidth: 175
      },
      numberDisplayOptions: {
        textOptions: {
          font: new PhetFont( 14 )
        },
        valuePattern: SceneryPhetStrings.wavelengthNMValuePatternStringProperty,
        maxWidth: 120
      },
      sliderOptions: {
        trackNode: trackNode,
        thumbNode: thumbNode
      },
      layoutFunction: NumberControl.createLayoutFunction3()
    }, options ) );
  }
}

sceneryPhet.register( 'WavelengthNumberControl', WavelengthNumberControl );