// Copyright 2019-2020, University of Colorado Boulder

/**
 * NumberControl that shows a spectrum of colors for selecting a wavelength.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Dimension2 from '../../dot/js/Dimension2.js';
import Range from '../../dot/js/Range.js';
import merge from '../../phet-core/js/merge.js';
import NumberControl from './NumberControl.js';
import PhetFont from './PhetFont.js';
import sceneryPhetStrings from './scenery-phet-strings.js';
import sceneryPhet from './sceneryPhet.js';
import SpectrumSliderThumb from './SpectrumSliderThumb.js';
import SpectrumSliderTrack from './SpectrumSliderTrack.js';
import VisibleColor from './VisibleColor.js';

const wavelengthNMValuePatternString = sceneryPhetStrings.wavelengthNMValuePattern;
const wavelengthString = sceneryPhetStrings.wavelength;

// constants
const DEFAULT_RANGE = new Range( VisibleColor.MIN_WAVELENGTH, VisibleColor.MAX_WAVELENGTH );

/**
 * @param {Property.<number>} wavelengthProperty - wavelength, in nm
 * @param {Object} [options]
 * @constructor
 */
class WavelengthNumberControl extends NumberControl {

  /**
   * @param {Property.<number>} property - for the wavelength, in nm
   * @param {Object} [options]
   */
  constructor( property, options ) {

    options = merge( {
      trackHeight: 20, // in view coordinates
      title: wavelengthString,
      range: DEFAULT_RANGE // in nm
    }, options );

    const trackHeight = options.trackHeight;

    super( options.title, property, options.range, merge( {
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
        trackNode: new SpectrumSliderTrack( property, options.range, {
          valueToColor: VisibleColor.wavelengthToColor,
          size: new Dimension2( 160, trackHeight )
        } ),
        thumbNode: new SpectrumSliderThumb( property, {
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