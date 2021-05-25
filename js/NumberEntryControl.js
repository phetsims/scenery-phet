// Copyright 2016-2021, University of Colorado Boulder

/**
 * A composite Scenery node that brings together a keypad and a box where the entered values are displayed.  Kind of
 * looks like a calculator, though it doesn't behave as one.
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import merge from '../../phet-core/js/merge.js';
import Node from '../../scenery/js/nodes/Node.js';
import Rectangle from '../../scenery/js/nodes/Rectangle.js';
import Text from '../../scenery/js/nodes/Text.js';
import NumberKeypad from './NumberKeypad.js';
import PhetFont from './PhetFont.js';
import sceneryPhet from './sceneryPhet.js';

class NumberEntryControl extends Node {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {
      maxDigits: 5, //TODO replace with validateKey, see https://github.com/phetsims/scenery-phet/issues/272
      readoutFont: new PhetFont( 20 )
    }, options );

    super();

    // Add the keypad.
    this.keypad = new NumberKeypad( {
      validateKey: NumberKeypad.validateMaxDigits( { maxDigits: options.maxDigits } )
    } );
    this.addChild( this.keypad );

    // Add the number readout background.
    const testString = new Text( '', { font: options.readoutFont } );
    _.times( options.maxDigits, () => { testString.text = `${testString.text}9`; } );
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
      digits.text = valueString;
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

  //TODO https://github.com/phetsims/scenery-phet/issues/272 add ES5 setter/getter, ala NumberKeypad?
  /**
   * Determines whether pressing a key (except for the backspace) will clear the existing value.
   * @public
   *
   * @param {boolean} clearOnNextKeyPress
   */
  setClearOnNextKeyPress( clearOnNextKeyPress ) {
    this.keypad.clearOnNextKeyPress = clearOnNextKeyPress;
  }
}

sceneryPhet.register( 'NumberEntryControl', NumberEntryControl );
export default NumberEntryControl;