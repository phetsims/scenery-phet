// Copyright 2016, University of Colorado Boulder

/**
 * A key accumulator that collects user input for integer values.
 *
 * @author Aadish Gupta
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var AbstractKeyAccumulator = require( 'SCENERY_PHET/keypad/AbstractKeyAccumulator' );
  var inherit = require( 'PHET_CORE/inherit' );
  var DigitKey = require( 'SCENERY_PHET/keypad/DigitKey' );
  var PlusMinusKey = require( 'SCENERY_PHET/keypad/PlusMinusKey' );
  var Property = require( 'AXON/Property' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var Util = require( 'DOT/Util' );

  // constants
  var NEGATIVE_CHAR = '\u2212';

  /**
   * @param {Object} [options]
   * @constructor
   */
  function IntegerAccumulator( options ) {

    options = _.extend( {

      // max number of digits that can be accumulated, the minus sign is not included in this
      maxLength: Number.MAX_SAFE_INTEGER.toString().length
    }, options );

    //TODO saving the entire options is an anti-pattern. And the only option actually used is maxLength.
    this.options = options; // @private

    AbstractKeyAccumulator.call( this );

    //TODO @public (read-only) ?
    // @public - string representation of the keys entered by the user
    this.stringProperty = new Property( this.keysToString( this.accumulatedKeysProperty.get() ) );

    //TODO @public (read-only) ?
    // @public - numerical value of the keys entered by the user
    this.valueProperty = new Property( this.stringToInteger( this.stringProperty.get() ) );

    // @private - when true, the next key press (expect backspace) will clear the accumulated value
    this._clearOnNextKeyPress = false;
  }

  sceneryPhet.register( 'IntegerAccumulator', IntegerAccumulator );

  return inherit( AbstractKeyAccumulator, IntegerAccumulator, {

    /**
     * Validates a proposed set of keys and (if valid) updates the string and numeric Properties.
     * @param {AbstractKey[]} proposedKeys - the proposed set of keys, to be validated
     * @public
     * @override
     */
    validateAndUpdate: function( proposedKeys ) {
      if ( this.getNumberOfDigits( proposedKeys ) <= this.options.maxLength ) {
        this.accumulatedKeysProperty.set( proposedKeys );
        this.stringProperty.set( this.keysToString( this.accumulatedKeysProperty.get() ) );
        this.valueProperty.set( this.stringToInteger( this.stringProperty.get() ) );
      }
    },

    /**
     * Converts a set of keys to a string.
     * @param {AbstractKey[]} keys
     * @returns {string}
     * @private
     */
    keysToString: function( keys ) {

      var returnValue = '';
      var i = 0;

      // PlusMinusKey (if present) will be first key, and indicates that the number is negative
      if ( keys.length > 0 && keys[ i ] instanceof PlusMinusKey ) {
        returnValue = NEGATIVE_CHAR;
        i++;
      }

      // process remaining keys
      for ( ; i < keys.length; i++ ) {

        // PlusMinusKey (if present) should only be first
        assert && assert( keys[ i ] instanceof DigitKey, 'unexpected key type' );
        returnValue = returnValue + keys[ i ].identifier;
      }

      return returnValue;
    },

    /**
     * Converts a string representation to an integer.
     * @param {string} stringValue
     * @returns {number}
     * @private
     */
    stringToInteger: function( stringValue ) {
      var returnValue = 0; //TODO default should be null
      if ( stringValue.length > 0 && !( stringValue.length === 1 && stringValue[ 0 ] === NEGATIVE_CHAR ) ) {

        // replace Unicode negative sign with vanilla '-', or parseInt will fail for negative numbers
        returnValue = parseInt( stringValue.replace( NEGATIVE_CHAR, '-' ), 10 );
      }
      assert && assert( !isNaN( returnValue ) && Util.isInteger( returnValue ), 'invalid integer: ' + returnValue );
      return returnValue;
    },

    /**
     * Gets the number of digits in the accumulator.
     * @param {AbstractKey[]} keys
     * @returns {number}
     * @private
     */
    getNumberOfDigits: function( keys ) {
      var numberOfDigits = 0;
      for ( var i = 0; i < keys.length; i++ ) {
        if ( keys[ i ] instanceof DigitKey ) {
          numberOfDigits++;
        }
      }
      return numberOfDigits;
    },

    /**
     * clear the accumulator
     * @public
     */
    clear: function() {
      AbstractKeyAccumulator.prototype.clear.call( this );
      this.stringProperty.reset();
      this.valueProperty.reset();
      this.setClearOnNextKeyPress( false );
    },

    /**
     * Determines whether pressing a key (except for backspace) will clear the existing value.
     * @param {boolean} clearOnNextKeyPress
     * @public
     */
    setClearOnNextKeyPress: function( clearOnNextKeyPress ) {
      this._clearOnNextKeyPress = clearOnNextKeyPress;
    },
    set clearOnNextKeyPress( value ) { this.setClearOnNextKeyPress( value ); },

    /**
     * Will pressing a key (except for backspace) clear the existing value?
     * @returns {boolean}
     * @public
     */
    getClearOnNextKeyPress: function() {
      return this._clearOnNextKeyPress;
    },
    get clearOnNextKeyPress() { return this.getClearOnNextKeyPress(); }

  } );
} );