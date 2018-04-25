// Copyright 2018, University of Colorado Boulder

/**
 * Slider that shows a spectrum of colors for selecting a frequency.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var SpectrumSlider = require( 'SCENERY_PHET/SpectrumSlider' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Util = require( 'DOT/Util' );
  var VisibleColor = require( 'SCENERY_PHET/VisibleColor' );

  // strings
  var frequencyUnitsPatternString = require( 'string!SCENERY_PHET/frequencyUnitsPattern' );

  // constants
  var TERA = 1E12; // by default, the FrequencySlider uses terahertz (THz), which is 1E12 Hz

  /**
   * @param {Property.<number>} frequencyProperty - frequency in Hz
   * @param {Object} [options]
   * @constructor
   */
  function FrequencySlider( frequencyProperty, options ) {

    // options that are specific to this type
    options = _.extend( {

      minFrequency: VisibleColor.MIN_FREQUENCY,
      maxFrequency: VisibleColor.MAX_FREQUENCY,

      // By default the values are displayed in tera Hz (THz)
      valueToString: function( value ) {
        return StringUtils.fillIn( frequencyUnitsPatternString, {
          frequency: Util.toFixed( value / TERA, 0 )
        } );
      },
      valueToColor: function( value ) {
        return VisibleColor.frequencyToColor( value );
      },

      tweakerValueDelta: TERA // Since the value is shown in TeraHz
    }, options );
    assert && assert( options.minValue === undefined, 'minValue is supplied by FrequencySlider' );
    assert && assert( options.maxValue === undefined, 'maxValue is supplied by FrequencySlider' );
    options.minValue = options.minFrequency;
    options.maxValue = options.maxFrequency;

    SpectrumSlider.call( this, frequencyProperty, options );
  }

  sceneryPhet.register( 'FrequencySlider', FrequencySlider );

  return inherit( SpectrumSlider, FrequencySlider );
} );