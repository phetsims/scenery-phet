// Copyright 2019-2020, University of Colorado Boulder

/**
 * This SliderTrack depicts a spectrum of colors in the track.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Dimension2 from '../../dot/js/Dimension2.js';
import merge from '../../phet-core/js/merge.js';
import Rectangle from '../../scenery/js/nodes/Rectangle.js';
import SliderTrack from '../../sun/js/SliderTrack.js';
import sceneryPhet from './sceneryPhet.js';
import SpectrumNode from './SpectrumNode.js';

class SpectrumSliderTrack extends SliderTrack {

  /**
   * @param {Property.<number>} property
   * @param {Range} range
   * @param {Object} [options]
   */
  constructor( property, range, options ) {
    options = merge( {
      size: new Dimension2( 150, 30 ),
      valueToColor: SpectrumNode.DEFAULT_VALUE_TO_COLOR // Defaults to a black to white gradient
    }, options );

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
    super( spectrumNode, property, range, options );
  }
}

sceneryPhet.register( 'SpectrumSliderTrack', SpectrumSliderTrack );
export default SpectrumSliderTrack;