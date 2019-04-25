// Copyright 2014-2018, University of Colorado Boulder

/**
 * WavelengthSpectrumNode displays a rectangle of the visible spectrum.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var SpectrumNode = require( 'SCENERY_PHET/SpectrumNode' );
  var Tandem = require( 'TANDEM/Tandem' );
  var VisibleColor = require( 'SCENERY_PHET/VisibleColor' );

  /**
   * Slider track that displays the visible spectrum of light.
   *
   * @param {Object} [options]
   * @constructor
   */
  function WavelengthSpectrumNode( options ) {

    options = _.extend( {
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
    options.valueToColor = function( value ) {
      return VisibleColor.wavelengthToColor( value );
    };

    SpectrumNode.call( this, options );
  }

  sceneryPhet.register( 'WavelengthSpectrumNode', WavelengthSpectrumNode );

  return inherit( SpectrumNode, WavelengthSpectrumNode );
} );