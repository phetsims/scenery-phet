// Copyright 2016-2023, University of Colorado Boulder

/**
 * A composite Scenery node that brings together a keypad and a box where the entered values are displayed.  Kind of
 * looks like a calculator, though it doesn't behave as one.
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import merge from '../../phet-core/js/merge.js';
import { Node, Rectangle, Text } from '../../scenery/js/imports.js';
import NumberKeypad from './NumberKeypad.js';
import PhetFont from './PhetFont.js';
import sceneryPhet from './sceneryPhet.js';
import deprecationWarning from '../../phet-core/js/deprecationWarning.js';

/**
 * @deprecated depends on NumberKeypad, which is deprecated. Modify this to use Keypad, or create something new.
 */
class NumberEntryControl extends Node {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {
    assert && deprecationWarning( 'NumberEntryControl is deprecated, a rewrite is needed' );

    options = merge( {
      maxDigits: 5, // Used for spacing of the readout, and for the default validateKey.
      readoutFont: new PhetFont( 20 )
    }, options );

    // options that depend on other options
    options = merge( {

      // See NumberKeypad for details, if specifying this, make sure that it works with the provided maxDigits, as that
      // is used to create to display background.
      validateKey: NumberKeypad.validateMaxDigits( { maxDigits: options.maxDigits } )
    }, options );

    super();

    assert && assert( typeof options.maxDigits === 'number', 'maxDigits must be a number' );

    // {NumberKeypad} Add the keypad.
    this.keypad = new NumberKeypad( {
      validateKey: options.validateKey
    } );
    this.addChild( this.keypad );

    // Add the number readout background.
    const testString = new Text( '', { font: options.readoutFont } );
    _.times( options.maxDigits, () => { testString.string = `${testString.string}9`; } );
    const readoutBackground = new Rectangle( 0, 0, testString.width * 1.2, testString.height * 1.2, 4, 4, {
      fill: 'white',
      stroke: '#777777',
      lineWidth: 1.5,
      centerX: this.keypad.width / 2
    } );
    this.addChild( readoutBackground );

    // Add the digits.
    const digits = new Text( '', { font: options.readoutFont } );
    this.addChild( digits );
    this.value = 0; // @private
    this.keypad.valueStringProperty.link( valueString => {
      digits.string = valueString;
      digits.center = readoutBackground.center;
      this.value = Number( valueString );
    } );

    // Layout
    this.keypad.top = readoutBackground.bottom + 10;

    // Pass options through to parent class.
    this.mutate( options );
  }

  /**
   * Returns the numeric value of the currently entered number (0 for nothing entered).
   * @public
   *
   * @returns {number}
   */
  getValue() {
    return this.value;
  }

  /**
   * Sets the currently entered number.
   * @public
   *
   * @param {number} number
   */
  setValue( number ) {
    assert && assert( typeof number === 'number' );
    assert && assert( number % 1 === 0, 'Only supports integers currently' );

    this.keypad.valueStringProperty.set( `${number}` );
  }

  /**
   * Clears the keypad, so nothing is entered
   * @public
   */
  clear() {
    this.keypad.clear();
  }

  /**
   * Will pressing a key (except for the backspace point) clear the existing value?
   * @returns {boolean}
   * @public
   */
  getClearOnNextKeyPress() {
    return this.keypad.getClearOnNextKeyPress();
  }

  get clearOnNextKeyPress() { return this.getClearOnNextKeyPress(); }

  /**
   * Determines whether pressing a key (except for the backspace) will clear the existing value.
   * @public
   *
   * @param {boolean} clearOnNextKeyPress
   */
  setClearOnNextKeyPress( clearOnNextKeyPress ) {
    this.keypad.clearOnNextKeyPress = clearOnNextKeyPress;
  }

  set clearOnNextKeyPress( clearOnNextKeyPress ) { this.setClearOnNextKeyPress( clearOnNextKeyPress ); }
}

sceneryPhet.register( 'NumberEntryControl', NumberEntryControl );
export default NumberEntryControl;