// Copyright 2017-2021, University of Colorado Boulder

/**
 * A key accumulator that collects user input for integer and floating point values, intended for use in conjunction
 * with the common-code keypad.
 *
 * @author Aadish Gupta
 * @author John Blanco
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../axon/js/DerivedProperty.js';
import merge from '../../../phet-core/js/merge.js';
import Tandem from '../../../tandem/js/Tandem.js';
import NullableIO from '../../../tandem/js/types/NullableIO.js';
import NumberIO from '../../../tandem/js/types/NumberIO.js';
import StringIO from '../../../tandem/js/types/StringIO.js';
import sceneryPhet from '../sceneryPhet.js';
import AbstractKeyAccumulator from './AbstractKeyAccumulator.js';
import KeyID from './KeyID.js';

// constants
const NEGATIVE_CHAR = '\u2212';
const DECIMAL_CHAR = '.';

// Define the maximum integer that can be handled.  The portion with the explicit numeric value is necessary for IE11
// support, see https://github.com/phetsims/scenery-phet/issues/332.
const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || 9007199254740991;
const MAX_DIGITS = MAX_SAFE_INTEGER.toString().length - 1;

class NumberAccumulator extends AbstractKeyAccumulator {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {
      maxDigitsRightOfMantissa: 0,
      maxDigits: MAX_DIGITS,
      tandem: Tandem.REQUIRED
    }, options );

    // verify option values
    assert && assert( options.maxDigits > 0 && options.maxDigits <= MAX_DIGITS,
      `maxDigits is out of range: ${options.maxDigits}` );
    assert && assert( options.maxDigitsRightOfMantissa >= 0 && options.maxDigitsRightOfMantissa <= options.maxDigits,
      `maxDigitsRightOfMantissa is out of range: ${options.maxDigitsRightOfMantissa}` );

    // Validators to be passed to AbstractKeyAccumulator
    const validators = [
      proposedKeys => {
        return this.getNumberOfDigits( proposedKeys ) <= options.maxDigits
               && !( this.getNumberOfDigits( proposedKeys ) === options.maxDigits
               && proposedKeys[ proposedKeys.length - 1 ] === KeyID.DECIMAL )
               && this.getNumberOfDigitsRightOfMantissa( proposedKeys ) <= options.maxDigitsRightOfMantissa;
      }
    ];

    super( validators, options );

    // @public (read-only) - string representation of the keys entered by the user
    this.stringProperty = new DerivedProperty( [ this.accumulatedKeysProperty ], accumulatedKeys => {
      return this.keysToString( accumulatedKeys );
    }, {
      tandem: options.tandem.createTandem( 'stringProperty' ),
      phetioType: DerivedProperty.DerivedPropertyIO( StringIO )
    } );

    // @public (read-only) - numerical value of the keys entered by the user
    this.valueProperty = new DerivedProperty( [ this.stringProperty ], stringValue => {
      return this.stringToInteger( stringValue );
    }, {
      tandem: options.tandem.createTandem( 'valueProperty' ),
      phetioType: DerivedProperty.DerivedPropertyIO( NullableIO( NumberIO ) )
    } );
  }

  /**
   * Invoked when a key is pressed and creates proposed set of keys to be passed to the validator
   * @param {KeyID} keyIdentifier - identifier for the key pressed
   * @public
   * @override
   */
  handleKeyPressed( keyIdentifier ) {
    const newArray = this.handleClearOnNextKeyPress( keyIdentifier );
    if ( this.isDigit( keyIdentifier ) ) {
      this.removeLeadingZero( newArray );
      newArray.push( keyIdentifier );

    }
    else if ( keyIdentifier === KeyID.BACKSPACE ) {
      newArray.pop();

    }
    else if ( keyIdentifier === KeyID.PLUS_MINUS ) {
      // check if first element of array is instance of this class
      if ( newArray.length > 0 && newArray[ 0 ] === KeyID.PLUS_MINUS ) {
        newArray.shift();
      }
      else {
        newArray.unshift( keyIdentifier );
      }
    }
    else if ( keyIdentifier === KeyID.DECIMAL ) {
      if ( !this.containsFloatingPoint( newArray ) ) {
        newArray.push( keyIdentifier );
      }
    }
    else {
      assert && assert( false, `unsupported keyIdentifier: ${keyIdentifier}` );
    }

    // Validate and update the keys
    this.validateKeys( newArray ) && this.updateKeys( newArray );
  }

  /**
   * Removes leading zeros from the array.
   * @param {Array.<KeyID>} array
   * @private
   */
  removeLeadingZero( array ) {
    if ( this.valueProperty.get() === 0 && !this.containsFloatingPoint( array ) ) {
      array.pop();
    }
  }

  /**
   * Converts a set of keys to a string.
   * @param {Array.<KeyID>} keys
   * @returns {string}
   * @private
   */
  keysToString( keys ) {

    let returnValue = '';
    let i = 0;

    // the plus/minus key (if present) will be first key, and indicates that the number is negative
    if ( keys.length > 0 && keys[ i ] === KeyID.PLUS_MINUS ) {
      returnValue = NEGATIVE_CHAR;
      i++;
    }

    // process remaining keys
    for ( ; i < keys.length; i++ ) {

      if ( keys[ i ] === KeyID.DECIMAL ) {
        returnValue = returnValue + DECIMAL_CHAR;
      }
      else {

        // the plus/minus key should be first if present
        assert && assert( this.isDigit( keys[ i ] ), 'unexpected key type' );
        returnValue = returnValue + keys[ i ];
      }
    }

    return returnValue;
  }

  /**
   * Converts a string representation to a number.
   * @param {string} stringValue
   * @returns {number|null}
   * @private
   */
  stringToInteger( stringValue ) {
    let returnValue = null;

    // if stringValue contains something other than just a minus sign...
    if ( stringValue.length > 0
         && !( stringValue.length === 1 && stringValue[ 0 ] === NEGATIVE_CHAR )
         && ( this.getNumberOfDigitsLeftOfMantissa( this.accumulatedKeysProperty.get() ) > 0 ||
              this.getNumberOfDigitsRightOfMantissa( this.accumulatedKeysProperty.get() ) > 0 ) ) {

      // replace Unicode minus with vanilla '-', or parseInt will fail for negative numbers
      returnValue = parseFloat( stringValue.replace( NEGATIVE_CHAR, '-' ).replace( DECIMAL_CHAR, '.' ) );
      assert && assert( !isNaN( returnValue ), `invalid number: ${returnValue}` );
    }

    return returnValue;
  }

  /**
   * Gets the number of digits to the left of mantissa in the accumulator.
   * @param {Array.<KeyID>} keys
   * @returns {number}
   * @private
   */
  getNumberOfDigitsLeftOfMantissa( keys ) {
    let numberOfDigits = 0;
    for ( let i = 0; i < keys.length; i++ ) {
      if ( this.isDigit( keys[ i ] ) ) {
        numberOfDigits++;
      }

      if ( keys[ i ] === KeyID.DECIMAL ) {
        break;
      }
    }
    return numberOfDigits;
  }

  /**
   * Gets the number of digits to the right of mantissa in the accumulator.
   * @param {Array.<KeyID>} keys
   * @returns {number}
   * @private
   */
  getNumberOfDigitsRightOfMantissa( keys ) {
    const decimalKeyIndex = keys.indexOf( KeyID.DECIMAL );
    let numberOfDigits = 0;
    if ( decimalKeyIndex >= 0 ) {
      for ( let i = decimalKeyIndex; i < keys.length; i++ ) {
        if ( this.isDigit( keys[ i ] ) ) {
          numberOfDigits++;
        }
      }
    }
    return numberOfDigits;
  }

  /**
   * Gets the number of digits in the accumulator.
   * @param {Array.<KeyID>} keys
   * @returns {number}
   * @private
   */
  getNumberOfDigits( keys ) {
    let numberOfDigits = 0;
    for ( let i = 0; i < keys.length; i++ ) {
      if ( this.isDigit( keys[ i ] ) ) {
        numberOfDigits++;
      }
    }
    return numberOfDigits;
  }

  /**
   * Gets the number of digits in the accumulator.
   * @param {Array.<KeyID>} keys
   * @returns {boolean}
   * @private
   */
  containsFloatingPoint( keys ) {
    return ( keys.indexOf( KeyID.DECIMAL ) >= 0 );
  }

  /**
   * Returns weather the character is valid digit or not
   * @param char
   * @returns {boolean}
   * @private
   */
  isDigit( char ) {
    return !isNaN( char ) && char >= '0' && char <= '9';
  }

  /**
   * clear the accumulator
   * @public
   * @override
   */
  clear() {
    super.clear();
    this.setClearOnNextKeyPress( false );
  }

  /**
   * @public
   * @override
   */
  dispose() {
    this.valueProperty.dispose();
    this.stringProperty.dispose();
    super.dispose();
  }
}

sceneryPhet.register( 'NumberAccumulator', NumberAccumulator );
export default NumberAccumulator;