// Copyright 2016, University of Colorado Boulder

/**
 * A key accumulator that collects user input for integer values.
 *
 * @author Aadish Gupta
 * @author John Blanco
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var AbstractKeyAccumulator = require( 'SCENERY_PHET/keypad/AbstractKeyAccumulator' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Keys = require( 'SCENERY_PHET/keypad/Keys' );
  //var PlusMinusKey = require( 'SCENERY_PHET/keypad/PlusMinusKey' );
  var Property = require( 'AXON/Property' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var Util = require( 'DOT/Util' );
  var Tandem = require( 'TANDEM/Tandem' );

  // constants
  var NEGATIVE_CHAR = '\u2212';


  /**
   * @param {Object} [options]
   * @constructor
   */
  function IntegerAccumulator( options ) {
    Tandem.indicateUninstrumentedCode();

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

  }

  sceneryPhet.register( 'IntegerAccumulator', IntegerAccumulator );

  return inherit( AbstractKeyAccumulator, IntegerAccumulator, {

    handleKeyPressed: function( keyIdentifier ) {
      var newArray = this.handleClearOnNextKeyPress( keyIdentifier );
      if ( this.isDigit( keyIdentifier ) ) {
        this.removeLeadingZero( newArray );
        newArray.push( keyIdentifier );

      } else if ( keyIdentifier === Keys.BACKSPACE ){
        newArray.pop();

      } else if ( keyIdentifier === Keys.PLUSMINUS ){
        // check if first element of array is instance of this class
        if ( newArray.length > 0 && newArray[ 0 ] === Keys.PLUSMINUS ) {
          newArray.shift();
        }
        else {
          newArray.unshift( keyIdentifier );
        }
      }
      else{
        assert && assert( false, 'This type of Key is not supported for Integer Keypad' );
      }

      this.validateAndUpdate( newArray );
    },

    removeLeadingZero: function( array ){
      if ( this.valueProperty.get() === 0 ){
        array.pop();
      }
    },
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
      if ( keys.length > 0 && keys[ i ] === Keys.PLUSMINUS ) {
        returnValue = NEGATIVE_CHAR;
        i++;
      }

      // process remaining keys
      for ( ; i < keys.length; i++ ) {

        // PlusMinusKey (if present) should only be first
        assert && assert( this.isDigit( keys[ i ] ), 'unexpected key type' );
        returnValue = returnValue + keys[ i ];
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
      var returnValue = null;

      // if stringValue contains something other than just a minus sign...
      if ( stringValue.length > 0 && !( stringValue.length === 1 && stringValue[ 0 ] === NEGATIVE_CHAR ) ) {

        // replace Unicode minus with vanilla '-', or parseInt will fail for negative numbers
        returnValue = parseInt( stringValue.replace( NEGATIVE_CHAR, '-' ), 10 );
        assert && assert( !isNaN( returnValue ) && Util.isInteger( returnValue ), 'invalid integer: ' + returnValue );
      }

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
        if ( this.isDigit( keys[ i ] ) ) {
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
    }

  } );
} );