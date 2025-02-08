// Copyright 2019-2025, University of Colorado Boulder

/**
 * This SliderTrack depicts a spectrum of colors in the track.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import TProperty from '../../axon/js/TProperty.js';
import Dimension2 from '../../dot/js/Dimension2.js';
import Range from '../../dot/js/Range.js';
import { LineJoin } from '../../kite/js/util/LineStyles.js';
import optionize from '../../phet-core/js/optionize.js';
import PickOptional from '../../phet-core/js/types/PickOptional.js';
import Rectangle from '../../scenery/js/nodes/Rectangle.js';
import TColor from '../../scenery/js/util/TColor.js';
import SliderTrack, { SliderTrackOptions } from '../../sun/js/SliderTrack.js';
import sceneryPhet from './sceneryPhet.js';
import SpectrumNode, { SpectrumNodeOptions } from './SpectrumNode.js';

type SelfOptions = {
  borderRectangleOptions?: {
    stroke?: TColor;
    lineWidth?: number;
    lineDash?: number[];
    lineDashOffset?: number;
    lineJoin?: LineJoin;
  };
} & PickOptional<SpectrumNodeOptions, 'valueToColor'>;

export type SpectrumSliderTrackOptions = SelfOptions & SliderTrackOptions;

export default class SpectrumSliderTrack extends SliderTrack {

  public constructor( property: TProperty<number>, range: Range, providedOptions?: SpectrumSliderTrackOptions ) {

    const options = optionize<SpectrumSliderTrackOptions, SelfOptions, SliderTrackOptions>()( {
      size: new Dimension2( 150, 30 ),
      valueToColor: SpectrumNode.DEFAULT_VALUE_TO_COLOR, // Defaults to a black to white gradient,
      borderRectangleOptions: {
        stroke: 'black',
        lineWidth: 1
      }
    }, providedOptions );

    const spectrumNode = new SpectrumNode( {
      minValue: range.min,
      maxValue: range.max,
      size: options.size,
      valueToColor: options.valueToColor
    } );

    // Show a thin black stroke around the border
    spectrumNode.addChild( new Rectangle( 0, 0, spectrumNode.width, spectrumNode.height, options.borderRectangleOptions ) );

    super( property, spectrumNode, range, options );
  }
}

sceneryPhet.register( 'SpectrumSliderTrack', SpectrumSliderTrack );