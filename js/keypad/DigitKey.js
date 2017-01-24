// Copyright 2016, University of Colorado Boulder

/**
 * Digit (integer) key for use in a keypad.
 *
 * @author Aadish Gupta
 */
define( function( require ) {
  'use strict';

  // modules
  var AbstractKey = require( 'SCENERY_PHET/keypad/AbstractKey' );
  var inherit = require( 'PHET_CORE/inherit' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var Tandem = require( 'TANDEM/Tandem' );

  /**
   * @param {number} digit
   * @constructor
   */
  function DigitKey( digit, options ) {
    Tandem.indicateUninstrumentedCode();

    //TODO should digit be an integer? i.e. DOT.Util.isInteger( digit )?
    assert && assert( !isNaN( digit ) && digit >= 0 && digit <= 9, 'digit must be a number between 0 and 9' );
    AbstractKey.call( this, digit.toString(), digit, digit, options );
  }

  sceneryPhet.register( 'DigitKey', DigitKey );

  return inherit( AbstractKey, DigitKey, {

    /**
     * @param {AbstractKeyAccumulator} keyAccumulator
     * @returns {Array.<AbstractKey>}
     * @override
     * @public
     */
    handleKeyPressed: function( keyAccumulator ) {
      var newArray;
      if ( keyAccumulator.getClearOnNextKeyPress() ) {
        newArray = [];
        keyAccumulator.setClearOnNextKeyPress( false );
      }
      else{
        newArray = _.clone( keyAccumulator.accumulatedKeysProperty.get() );
      }
      newArray.push( this );
      return newArray;
    }

  } );
} );