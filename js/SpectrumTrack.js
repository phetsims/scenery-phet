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

  class SpectrumTrack extends SliderTrack {

    /**
     * @param {Property.<number>} property
     * @param {Object} [options]
     */
    constructor( property, options ) {
      options = _.extend( {
        size: new Dimension2( 150, 30 ),
        valueToColor: SpectrumNode.DEFAULT_VALUE_TO_COLOR, // Defaults to a black to white gradient
        minValue: 0,
        maxValue: 1
      }, options );

      super( new SpectrumNode( {
        minValue: options.minValue,
        maxValue: options.maxValue,
        size: options.size,
        valueToColor: options.valueToColor
      } ), property, options );
    }

    /**
     * no-op like in the parent class.  Not supported, but also not an error.  Will hopefully be
     * improved in https://github.com/phetsims/scenery-phet/issues/506
     *
     * @param {number} minX - x value for the min position of the enabled range of the track
     * @param {number} maxX - x value for the max position of the enabled range of the track
     * @public
     */
    updateEnabledTrackWidth( minX, maxX ) {
    }
  }

  return sceneryPhet.register( 'SpectrumTrack', SpectrumTrack );
} );