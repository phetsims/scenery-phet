// Copyright 2019, University of Colorado Boulder

/**
 * NumberControl that shows a spectrum of colors for selecting a wavelength.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Dimension2 = require( 'DOT/Dimension2' );
  const merge = require( 'PHET_CORE/merge' );
  const NumberControl = require( 'SCENERY_PHET/NumberControl' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Range = require( 'DOT/Range' );
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  const SpectrumSliderThumb = require( 'SCENERY_PHET/SpectrumSliderThumb' );
  const SpectrumSliderTrack = require( 'SCENERY_PHET/SpectrumSliderTrack' );
  const VisibleColor = require( 'SCENERY_PHET/VisibleColor' );

  // strings
  const wavelengthNMValuePatternString = require( 'string!SCENERY_PHET/wavelengthNMValuePattern' );
  const wavelengthString = require( 'string!SCENERY_PHET/wavelength' );

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
     * @param {Object} options
     */
    constructor( property, options ) {

      options = _.extend( {
        trackHeight: 20, // in view coordinates
        title: wavelengthString,
        range: DEFAULT_RANGE // in nm
      }, options );

      const trackHeight = options.trackHeight;

      super( options.title, property, options.range, merge( {
        arrowButtonOptions: {
          scale: trackHeight * 0.0315 // roughly the height of the track
        },
        titleNodeOptions: {
          font: new PhetFont( 15 ),
          maxWidth: 175
        },
        numberDisplayOptions: {
          font: new PhetFont( 14 ),
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

  return sceneryPhet.register( 'WavelengthNumberControl', WavelengthNumberControl );
} );