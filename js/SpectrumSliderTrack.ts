// Copyright 2019-2022, University of Colorado Boulder

/**
 * This SliderTrack depicts a spectrum of colors in the track.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Range from '../../dot/js/Range.js';
import Dimension2 from '../../dot/js/Dimension2.js';
import { Rectangle } from '../../scenery/js/imports.js';
import SliderTrack, { SliderTrackOptions } from '../../sun/js/SliderTrack.js';
import sceneryPhet from './sceneryPhet.js';
import SpectrumNode, { SpectrumNodeOptions } from './SpectrumNode.js';
import TProperty from '../../axon/js/TProperty.js';
import optionize from '../../phet-core/js/optionize.js';
import PickOptional from '../../phet-core/js/types/PickOptional.js';

type SelfOptions = PickOptional<SpectrumNodeOptions, 'valueToColor'>;

export type SpectrumSliderTrackOptions = SelfOptions & SliderTrackOptions;

export default class SpectrumSliderTrack extends SliderTrack {

  public constructor( property: TProperty<number>, range: Range, providedOptions?: SpectrumSliderTrackOptions ) {

    const options = optionize<SpectrumSliderTrackOptions, SelfOptions, SliderTrackOptions>()( {
      size: new Dimension2( 150, 30 ),
      valueToColor: SpectrumNode.DEFAULT_VALUE_TO_COLOR // Defaults to a black to white gradient
    }, providedOptions );

    const spectrumNode = new SpectrumNode( {
      minValue: range.min,
      maxValue: range.max,
      size: options.size,
      valueToColor: options.valueToColor
    } );

    // Show a thin black stroke around the border
    spectrumNode.addChild( new Rectangle( 0, 0, spectrumNode.width, spectrumNode.height, {
      stroke: 'black',
      lineWidth: 1
    } ) );

    super( property, spectrumNode, range, options );
  }
}

sceneryPhet.register( 'SpectrumSliderTrack', SpectrumSliderTrack );