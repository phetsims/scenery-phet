// Copyright 2015-2016, University of Colorado Boulder

/**
 * A scenery node that looks like a key pad and allows the user to enter a number. The entered number is not
 * displayed by this node - it is intended to be used in conjunction with a separate display of some sort.
 *
 * @author John Blanco
 * @author Andrey Zelenkov (MLearner)
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var BackspaceIcon = require( 'SCENERY_PHET/BackspaceIcon' );
  var inherit = require( 'PHET_CORE/inherit' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // string
  var decimalPointString = '.'; //TODO localize, https://github.com/phetsims/scenery-phet/issues/279

  /**
   * @param {Object} [options]
   * @constructor
   */
  function NumberKeypad( options ) {

    options = _.extend( {
      buttonFont: new PhetFont( { size: 20 } ),
      minButtonWidth: 35,
      minButtonHeight: 35,
      decimalPointKey: false,
      xSpacing: 10,
      ySpacing: 10,
      keyColor: 'white',
      valueStringProperty: new Property( '' ),

      // {function(string, string)} validates a key press, see example and documentation in validateMaxDigits
      validateKey: validateMaxDigits( { maxDigits: 8 } )
    }, options );

    var self = this;

    // @public (read only) - sequence of key values entered by the user
    this.valueStringProperty = options.valueStringProperty;

    // @private - when true, the next key press will clear valueStringProperty
    this.armedForNewEntry = false;

    // options for keys
    var keyOptions = {
      minWidth: options.minButtonWidth,
      minHeight: options.minButtonHeight,
      baseColor: options.keyColor,
      font: options.buttonFont
    };

    // create the backspace key
    var backspaceIcon = new BackspaceIcon();
    backspaceIcon.scale( Math.min( options.minButtonWidth / backspaceIcon.width * 0.7, ( options.minButtonHeight * 0.65 ) / backspaceIcon.height ) );
    var backspaceKey = new RectangularPushButton( {
      content: backspaceIcon,
      minWidth: keyOptions.minWidth,
      minHeight: keyOptions.minHeight,
      xMargin: 1,
      baseColor: keyOptions.baseColor,
      listener: function() {
        if ( self.valueStringProperty.value.length > 0 ) {

          // The backspace key ignores and resets the armedForNewEntry flag. The rationale is that if a user has
          // entered an incorrect value and wants to correct it by using the backspace, then it should work like
          // the backspace always does instead of clearing the display.
          self.armedForNewEntry = false;

          // Remove the last character
          self.valueStringProperty.set( self.valueStringProperty.get().slice( 0, -1 ) );
        }
      }
    } );

    /**
     * Called when a key is pressed.
     * @param {string} keyString - string associated with the key that was pressed
     */
    var keyCallback = function( keyString ) {

      // If armed for new entry, clear the existing string.
      if ( self.armedForNewEntry ) {
        self.valueStringProperty.value = '';
        self.armedForNewEntry = false;
      }

      // process the keyString
      self.valueStringProperty.value = options.validateKey( keyString, self.valueStringProperty.value );
    };

    // create the bottom row of keys, which can vary based on options
    var bottomRowChildren = [];
    if ( options.decimalPointKey ) {

      // add a decimal point key plus a normal width zero key
      bottomRowChildren.push( createKey( decimalPointString, keyCallback, keyOptions ) );
      bottomRowChildren.push( createKey( '0', keyCallback, keyOptions ) );
    }
    else {

      // add a double-width zero key instead of the decimal point key
      var doubleRowButtonKeySpec = _.extend( {}, keyOptions, { minWidth: keyOptions.minWidth * 2 + options.xSpacing } );
      bottomRowChildren.push( createKey( '0', keyCallback, doubleRowButtonKeySpec ) );
    }
    bottomRowChildren.push( backspaceKey );

    // add the rest of the keys
    VBox.call( this, {
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

    this.mutate( options );
  }

  sceneryPhet.register( 'NumberKeypad', NumberKeypad );

  /**
   * Creates a key for the keypad.
   *
   * @param {string} keyString - string that appears on the key
   * @param {function(string)} callback - called when the key is pressed
   * @param {Object} keyOptions - see RectangularPushButton.options
   * @returns {*}
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

  /**
   * Creates a validation function that constrains the value to a maximum number of digits, with 1 leading zero.
   *
   * @param {Object} [options]
   * @returns {function(string, string)}
   */
  var validateMaxDigits = function( options ) {

    options = _.extend( {
      maxDigits: 8 // {number} the maximum number of digits (numbers)
    }, options );
    assert && assert( options.maxDigits > 0, 'invalid maxDigits: ' + options.maxDigits );

    /**
     * Creates the new string that results from pressing a key.
     * @param {string} keyString - string associated with the key that was pressed
     * @param {string} valueString - string that corresponds to the sequence of keys that have been pressed
     * @returns {string} the result
     */
    return function( keyString, valueString ) {

      var hasDecimalPoint = valueString.indexOf( decimalPointString ) !== -1;
      var numberOfDigits = hasDecimalPoint ? valueString.length - 1 : valueString.length;

      var newValueString;
      if ( valueString === '0' && keyString === '0' ) {

        // ignore multiple leading zeros
        newValueString = valueString;
      }
      else if ( valueString === '0' && keyString !== '0' && keyString !== decimalPointString ) {

        // replace a leading 0 that's not followed by a decimal point with this key
        newValueString = keyString;
      }
      else if ( keyString !== decimalPointString && numberOfDigits < options.maxDigits ) {

        // constrain to maxDigits
        newValueString = valueString + keyString;
      }
      else if ( keyString === decimalPointString && valueString.indexOf( decimalPointString ) === -1 ) {

        // allow one decimal point
        newValueString = valueString + keyString;
      }
      else {

        // ignore keyString
        newValueString = valueString;
      }

      return newValueString;
    };
  };

  return inherit( VBox, NumberKeypad, {

    /**
     * Clear anything that has been accumulated in the valueStringProperty field.
     * @public
     */
    clear: function() {
      this.valueStringProperty.value = '';
    },

    /**
     * Set the keypad such that any new digit entry will clear the existing string and start over.
     * @public
     */
    armForNewEntry: function() {
      this.armedForNewEntry = true;
    }
  }, {

    // Functions for creating useful values for options.validateKey
    validateMaxDigits: validateMaxDigits
  } );
} );
