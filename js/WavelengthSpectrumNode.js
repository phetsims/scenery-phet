// Copyright 2014-2019, University of Colorado Boulder

/**
 * WavelengthSpectrumNode displays a rectangle of the visible spectrum.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const merge = require( 'PHET_CORE/merge' );
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  const SpectrumNode = require( 'SCENERY_PHET/SpectrumNode' );
  const Tandem = require( 'TANDEM/Tandem' );
  const VisibleColor = require( 'SCENERY_PHET/VisibleColor' );

  /**
   * Slider track that displays the visible spectrum of light.
   *
   * @param {Object} [options]
   * @constructor
   */
  class WavelengthSpectrumNode extends SpectrumNode {

    constructor( options ) {

      options = merge( {
        valueToColor: value => VisibleColor.wavelengthToColor( value ),
        minWavelength: VisibleColor.MIN_WAVELENGTH,
        maxWavelength: VisibleColor.MAX_WAVELENGTH,
        tandem: Tandem.optional
      }, options );

      // validation
      assert && assert( options.minWavelength < options.maxWavelength );
      assert && assert( options.minWavelength >= VisibleColor.MIN_WAVELENGTH && options.minWavelength <= VisibleColor.MAX_WAVELENGTH );
      assert && assert( options.maxWavelength >= VisibleColor.MIN_WAVELENGTH && options.maxWavelength <= VisibleColor.MAX_WAVELENGTH );
      assert && assert( typeof options.minValue === 'undefined', 'minValue is supplied by WavelengthSlider' );
      assert && assert( typeof options.maxValue === 'undefined', 'maxValue is supplied by WavelengthSlider' );

      options.minValue = options.minWavelength;
      options.maxValue = options.maxWavelength;

      super( options );
    }
  }

  return sceneryPhet.register( 'WavelengthSpectrumNode', WavelengthSpectrumNode );
} );