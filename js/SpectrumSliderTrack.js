// Copyright 2019, University of Colorado Boulder

/**
 * This SliderTrack depicts a spectrum of colors in the track.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Dimension2 = require( 'DOT/Dimension2' );
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  const SliderTrack = require( 'SUN/SliderTrack' );
  const SpectrumNode = require( 'SCENERY_PHET/SpectrumNode' );

  class SpectrumSliderTrack extends SliderTrack {

    /**
     * @param {Property.<number>} property
     * @param {Range} range
     * @param {Object} [options]
     */
    constructor( property, range, options ) {
      options = _.extend( {
        size: new Dimension2( 150, 30 ),
        valueToColor: SpectrumNode.DEFAULT_VALUE_TO_COLOR // Defaults to a black to white gradient
      }, options );

      super( new SpectrumNode( {
        minValue: range.min,
        maxValue: range.max,
        size: options.size,
        valueToColor: options.valueToColor
      } ), property, range, options );
    }
  }

  return sceneryPhet.register( 'SpectrumSliderTrack', SpectrumSliderTrack );
} );