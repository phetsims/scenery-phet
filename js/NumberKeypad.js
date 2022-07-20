// Copyright 2015-2022, University of Colorado Boulder

/**
 * A scenery node that looks like a number key pad and allows the user to enter a number. The entered number is not
 * displayed by this node - it is intended to be used in conjunction with a separate display of some sort.
 *
 * @author John Blanco
 * @author Andrey Zelenkov (MLearner)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../axon/js/Property.js';
import deprecationWarning from '../../phet-core/js/deprecationWarning.js';
import InstanceRegistry from '../../phet-core/js/documentation/InstanceRegistry.js';
import merge from '../../phet-core/js/merge.js';
import { HBox, Node, Text, VBox } from '../../scenery/js/imports.js';
import RectangularPushButton from '../../sun/js/buttons/RectangularPushButton.js';
import BackspaceIcon from './BackspaceIcon.js';
import PhetFont from './PhetFont.js';
import sceneryPhet from './sceneryPhet.js';

// string
const DECIMAL_POINT = '.'; //TODO localize, https://github.com/phetsims/scenery-phet/issues/333

/**
 * @deprecated - This keypad has been replaced by a more flexible and general version.
 * While there are no plans to go back and replace existing usages, new implementations should use Keypad.js.
 * See https://github.com/phetsims/scenery-phet/issues/283 for the history of this. -jbphet, Aug 2017
 */
class NumberKeypad extends Node {

  /**
   * @param {Object} [options]
   * @deprecated
   */
  constructor( options ) {
    assert && deprecationWarning( 'NumberKeypad is deprecated, please use Keypad instead' );

    options = merge( {
      buttonFont: new PhetFont( { size: 20 } ),
      minButtonWidth: 35,
      minButtonHeight: 35,
      decimalPointKey: false,
      xSpacing: 10,
      ySpacing: 10,
      keyColor: 'white',
      valueStringProperty: new Property( '' ),

      // {function(string, string)} validates a key press, see example and documentation in validateMaxDigits
      validateKey: NumberKeypad.validateMaxDigits( { maxDigits: 8 } )
    }, options );

    super();

    // @public (read-only) - sequence of key values entered by the user
    this.valueStringProperty = options.valueStringProperty;

    // @private - when true, the next key press will clear valueStringProperty
    this._clearOnNextKeyPress = false;

    // options for keys
    const keyOptions = {
      minWidth: options.minButtonWidth,
      minHeight: options.minButtonHeight,
      baseColor: options.keyColor,
      font: options.buttonFont
    };

    // create the backspace key
    const backspaceIcon = new BackspaceIcon();
    backspaceIcon.scale( Math.min( options.minButtonWidth / backspaceIcon.width * 0.7, ( options.minButtonHeight * 0.65 ) / backspaceIcon.height ) );
    const backspaceKey = new RectangularPushButton( {
      content: backspaceIcon,
      minWidth: keyOptions.minWidth,
      minHeight: keyOptions.minHeight,
      xMargin: 1,
      baseColor: keyOptions.baseColor,
      listener: () => {
        if ( this.valueStringProperty.value.length > 0 ) {

          // The backspace key ignores and resets the clearOnNextKeyPress flag. The rationale is that if a user has
          // entered an incorrect value and wants to correct it by using the backspace, then it should work like
          // the backspace always does instead of clearing the display.
          this._clearOnNextKeyPress = false;

          // Remove the last character
          this.valueStringProperty.set( this.valueStringProperty.get().slice( 0, -1 ) );
        }
      }
    } );

    /**
     * Called when a key is pressed.
     * @param {string} keyString - string associated with the key that was pressed
     */
    const keyCallback = keyString => {

      // If set to clear the value on the next key press, clear the existing string.
      if ( this._clearOnNextKeyPress ) {
        this.valueStringProperty.value = '';
        this._clearOnNextKeyPress = false;
      }

      // process the keyString
      this.valueStringProperty.value = options.validateKey( keyString, this.valueStringProperty.value );
    };

    // create the bottom row of keys, which can vary based on options
    const bottomRowChildren = [];
    if ( options.decimalPointKey ) {

      // add a decimal point key plus a normal width zero key
      bottomRowChildren.push( createKey( DECIMAL_POINT, keyCallback, keyOptions ) );
      bottomRowChildren.push( createKey( '0', keyCallback, keyOptions ) );
    }
    else {

      // add a double-width zero key instead of the decimal point key
      const doubleRowButtonKeySpec = merge( {}, keyOptions, { minWidth: keyOptions.minWidth * 2 + options.xSpacing } );
      bottomRowChildren.push( createKey( '0', keyCallback, doubleRowButtonKeySpec ) );
    }
    bottomRowChildren.push( backspaceKey );

    // add the rest of the keys
    const vBox = new VBox( {
      spacing: options.ySpacing,
      children: [
        new HBox( {
          spacing: options.xSpacing,
          children: [
            createKey( '7', keyCallback, keyOptions ),
            createKey( '8', keyCallback, keyOptions ),
            createKey( '9', keyCallback, keyOptions )
          ]
        } ),
        new HBox( {
          spacing: options.xSpacing,
          children: [
            createKey( '4', keyCallback, keyOptions ),
            createKey( '5', keyCallback, keyOptions ),
            createKey( '6', keyCallback, keyOptions )
          ]
        } ),
        new HBox( {
          spacing: options.xSpacing,
          children: [
            createKey( '1', keyCallback, keyOptions ),
            createKey( '2', keyCallback, keyOptions ),
            createKey( '3', keyCallback, keyOptions )
          ]
        } ),
        new HBox( {
          spacing: options.xSpacing,
          children: bottomRowChildren
        } )
      ]
    } );

    assert && assert( !options.children, 'NumberKeyPad sets children' );
    options.children = [ vBox ];

    this.mutate( options );

    // support for binder documentation, stripped out in builds and only runs when ?binder is specified
    assert && phet.chipper.queryParameters.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'NumberKeypad', this );
  }

  get clearOnNextKeyPress() { return this.getClearOnNextKeyPress(); }

  set clearOnNextKeyPress( value ) { this.setClearOnNextKeyPress( value ); }

  /**
   * Creates a validation function that constrains the value to a maximum number of digits, with 1 leading zero.
   * @param {Object} [options]
   * @returns {function(string, string)}
   * @public
   */
  static validateMaxDigits( options ) {

    options = merge( {
      maxDigits: 8 // {number} the maximum number of digits (numbers)
    }, options );
    assert && assert( options.maxDigits > 0, `invalid maxDigits: ${options.maxDigits}` );

    /**
     * Creates the new string that results from pressing a key.
     * @param {string} keyString - string associated with the key that was pressed
     * @param {string} valueString - string that corresponds to the sequence of keys that have been pressed
     * @returns {string} the result
     */
    return function( keyString, valueString ) {

      const hasDecimalPoint = valueString.indexOf( DECIMAL_POINT ) !== -1;
      const numberOfDigits = hasDecimalPoint ? valueString.length - 1 : valueString.length;

      let newValueString;
      if ( valueString === '0' && keyString === '0' ) {

        // ignore multiple leading zeros
        newValueString = valueString;
      }
      else if ( valueString === '0' && keyString !== '0' && keyString !== DECIMAL_POINT ) {

        // replace a leading 0 that's not followed by a decimal point with this key
        newValueString = keyString;
      }
      else if ( keyString !== DECIMAL_POINT && numberOfDigits < options.maxDigits ) {

        // constrain to maxDigits
        newValueString = valueString + keyString;
      }
      else if ( keyString === DECIMAL_POINT && valueString.indexOf( DECIMAL_POINT ) === -1 ) {

        // allow one decimal point
        newValueString = valueString + keyString;
      }
      else {

        // ignore keyString
        newValueString = valueString;
      }

      return newValueString;
    };
  }

  /**
   * Clear anything that has been accumulated in the valueStringProperty field.
   * @public
   */
  clear() {
    this.valueStringProperty.value = '';
  }

  /**
   * Determines whether pressing a key (except for the backspace) will clear the existing value.
   * @param {boolean} clearOnNextKeyPress
   * @public
   */
  setClearOnNextKeyPress( clearOnNextKeyPress ) {
    this._clearOnNextKeyPress = clearOnNextKeyPress;
  }

  /**
   * Will pressing a key (except for the backspace point) clear the existing value?
   * @returns {boolean}
   * @public
   */
  getClearOnNextKeyPress() {
    return this._clearOnNextKeyPress;
  }
}

/**
 * Creates a key for the keypad.
 * @param {string} keyString - string that appears on the key
 * @param {function(string)} callback - called when the key is pressed
 * @param {Object} keyOptions - see RectangularPushButton.options
 * @returns {Node}
 */
function createKey( keyString, callback, keyOptions ) {
  return new RectangularPushButton( {
    content: new Text( keyString, { font: keyOptions.font } ),
    baseColor: keyOptions.baseColor,
    minWidth: keyOptions.minWidth,
    minHeight: keyOptions.minHeight,
    xMargin: 5,
    yMargin: 5,
    listener: function() { callback( keyString ); }
  } );
}

// @public
NumberKeypad.DECIMAL_POINT = DECIMAL_POINT;

sceneryPhet.register( 'NumberKeypad', NumberKeypad );
export default NumberKeypad;