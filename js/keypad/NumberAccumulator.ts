// Copyright 2017-2022, University of Colorado Boulder

/**
 * A key accumulator that collects user input for integer and floating point values, intended for use in conjunction
 * with the common-code keypad.
 *
 * @author Aadish Gupta
 * @author John Blanco
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../axon/js/DerivedProperty.js';
import ReadOnlyProperty from '../../../axon/js/ReadOnlyProperty.js';
import optionize from '../../../phet-core/js/optionize.js';
import Tandem from '../../../tandem/js/Tandem.js';
import NullableIO from '../../../tandem/js/types/NullableIO.js';
import NumberIO from '../../../tandem/js/types/NumberIO.js';
import StringIO from '../../../tandem/js/types/StringIO.js';
import sceneryPhet from '../sceneryPhet.js';
import AbstractKeyAccumulator from './AbstractKeyAccumulator.js';
import KeyID, { KeyIDValue } from './KeyID.js';

// constants
const NEGATIVE_CHAR = '\u2212';
const DECIMAL_CHAR = '.';

// Define the maximum integer that can be handled.  The portion with the explicit numeric value is necessary for IE11
// support, see https://github.com/phetsims/scenery-phet/issues/332.
const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || 9007199254740991;
const MAX_DIGITS = MAX_SAFE_INTEGER.toString().length - 1;

type SelfOptions = {
  maxDigitsRightOfMantissa?: number;
  maxDigits?: number;
  tandem?: Tandem;
  tandemNameSuffix?: string;
};

export type NumberAccumulatorOptions = SelfOptions;

class NumberAccumulator extends AbstractKeyAccumulator {

  // string representation of the keys entered by the user
  public readonly stringProperty: ReadOnlyProperty<string>;

  // numerical value of the keys entered by the user
  public readonly valueProperty: ReadOnlyProperty<number | null>;

  public constructor( providedOptions?: NumberAccumulatorOptions ) {

    const options = optionize<NumberAccumulatorOptions, SelfOptions>()( {
      maxDigitsRightOfMantissa: 0,
      maxDigits: MAX_DIGITS,
      tandem: Tandem.REQUIRED,
      tandemNameSuffix: 'NumberAccumulator'
    }, providedOptions );

    // verify option values
    assert && assert( options.maxDigits > 0 && options.maxDigits <= MAX_DIGITS,
      `maxDigits is out of range: ${options.maxDigits}` );
    assert && assert( options.maxDigitsRightOfMantissa >= 0 && options.maxDigitsRightOfMantissa <= options.maxDigits,
      `maxDigitsRightOfMantissa is out of range: ${options.maxDigitsRightOfMantissa}` );

    // Validators to be passed to AbstractKeyAccumulator
    const validators = [
      ( proposedKeys: KeyIDValue[] ) => {
        return this.getNumberOfDigits( proposedKeys ) <= options.maxDigits
               && !( this.getNumberOfDigits( proposedKeys ) === options.maxDigits
               && proposedKeys[ proposedKeys.length - 1 ] === KeyID.DECIMAL )
               && this.getNumberOfDigitsRightOfMantissa( proposedKeys ) <= options.maxDigitsRightOfMantissa;
      }
    ];

    super( validators );

    this.stringProperty = new DerivedProperty( [ this.accumulatedKeysProperty ], accumulatedKeys => {
      return this.keysToString( accumulatedKeys );
    }, {
      tandem: options.tandem.createTandem( 'stringProperty' ), // eslint-disable-line bad-sim-text
      phetioValueType: StringIO
    } );

    this.valueProperty = new DerivedProperty( [ this.stringProperty ], stringValue => {
      return this.stringToInteger( stringValue );
    }, {
      tandem: options.tandem.createTandem( 'valueProperty' ),
      phetioValueType: NullableIO( NumberIO )
    } );
  }

  /**
   * Invoked when a key is pressed and creates proposed set of keys to be passed to the validator
   * @param keyIdentifier - identifier for the key pressed
   */
  public override handleKeyPressed( keyIdentifier: KeyIDValue ): void {
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
   */
  private removeLeadingZero( array: KeyIDValue[] ): void {
    if ( this.valueProperty.get() === 0 && !this.containsFloatingPoint( array ) ) {
      array.pop();
    }
  }

  /**
   * Converts a set of keys to a string.
   */
  private keysToString( keys: KeyIDValue[] ): string {

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
   */
  private stringToInteger( stringValue: string ): number | null {
    let returnValue = null;

    // if stringValue contains something other than just a minus sign...
    if ( stringValue.length > 0
         && !( stringValue.length === 1 && stringValue.startsWith( NEGATIVE_CHAR ) )
         && ( this.getNumberOfDigitsLeftOfMantissa( this.accumulatedKeysProperty.get() ) > 0 ||
              this.getNumberOfDigitsRightOfMantissa( this.accumulatedKeysProperty.get() ) > 0 ) ) {

      // replace Unicode minus with vanilla '-', or parseInt will fail for negative numbers
      returnValue = Number( stringValue.replace( NEGATIVE_CHAR, '-' ).replace( DECIMAL_CHAR, '.' ) );
      assert && assert( !isNaN( returnValue ), `invalid number: ${returnValue}` );
    }

    return returnValue;
  }

  /**
   * Gets the number of digits to the left of mantissa in the accumulator.
   */
  private getNumberOfDigitsLeftOfMantissa( keys: KeyIDValue[] ): number {
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
   */
  private getNumberOfDigitsRightOfMantissa( keys: KeyIDValue[] ): number {
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
   */
  private getNumberOfDigits( keys: KeyIDValue[] ): number {
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
   */
  private containsFloatingPoint( keys: KeyIDValue[] ): boolean {
    return keys.includes( KeyID.DECIMAL );
  }

  /**
   * Returns whether the character is valid digit or not
   */
  private isDigit( char: KeyIDValue ): boolean {
    return char >= '0' && char <= '9';
  }

  /**
   * clear the accumulator
   */
  public override clear(): void {
    super.clear();
    this.setClearOnNextKeyPress( false );
  }

  public override dispose(): void {
    this.valueProperty.dispose();
    this.stringProperty.dispose();
    super.dispose();
  }
}

sceneryPhet.register( 'NumberAccumulator', NumberAccumulator );
export default NumberAccumulator;