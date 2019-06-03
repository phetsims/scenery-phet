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

        // Defaults to a black to white gradient
        valueToColor: SpectrumNode.DEFAULT_VALUE_TO_COLOR,
        minValue: 0,
        maxValue: 1
      }, options );
      super( property, options );
      this.addChild( new SpectrumNode( {
        minValue: options.minValue,
        maxValue: options.maxValue,
        size: options.size,
        pickable: false, // so events pass through to the SliderTrack
        valueToColor: options.valueToColor
      } ) );

      this.mutate( options );
    }
  }

  return sceneryPhet.register( 'SpectrumTrack', SpectrumTrack );
} );