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

      //TODO replace with a function that accepts or rejects entry, https://github.com/phetsims/scenery-phet/issues/272
      maxDigits: 8, // Maximum number of digits that the user may enter
      valueStringProperty: new Property( '' )
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
      font: options.buttonFont,
      maxDigits: options.maxDigits
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

          //TODO shouldn't this be done after armedForNewEntry?
          // remove the last digit from the current digit string
          var shortenedDigitString = self.valueStringProperty.value.slice( 0, -1 );

          //TODO duplicated code
          if ( self.armedForNewEntry ) {
            self.valueStringProperty.value = '';
            self.armedForNewEntry = false;
          }

          // set the new shortened value
          self.valueStringProperty.value = shortenedDigitString;
        }
      }
    } );

    //TODO allow client to provide this function, https://github.com/phetsims/scenery-phet/issues/272
    /**
     * Creates the new string that results from pressing a key.
     * @param {string} keyString - string associated with the key that was pressed
     * @param {string} valueString - string that corresponds to the sequence of keys that have been pressed
     * @returns {string} the result
     */
    var processKeyString = function( keyString, valueString ) {

      var hasDecimalPoint = valueString.indexOf( '.' ) !== -1;
      var numberOfDigits = hasDecimalPoint ? valueString.length - 1 : valueString.length;

      var newValueString;
      if ( self.valueStringProperty.value === '0' && keyString === '0' ) {
        // ignore multiple leading zeros
      }
      else if ( self.valueStringProperty.value === '0' && keyString !== '0' && keyString !== '.' ) {

        // replace a leading 0 that's not followed by a decimal point with this key
        newValueString = keyString;
      }
      else if ( keyString !== '.' && numberOfDigits < keyOptions.maxDigits ) {

        // constrain to maxDigits
        newValueString = valueString + keyString;
      }
      else if ( keyString === '.' && self.valueStringProperty.value.indexOf( '.' ) === -1 ) {

        // allow one decimal point
        newValueString = valueString + keyString;
      }
      else {

        // ignore keyString
        newValueString = valueString;
      }

      return newValueString;
    };

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
      self.valueStringProperty.value = processKeyString( keyString, self.valueStringProperty.value );
    };

    // create the bottom row of keys, which can vary based on options
    var bottomRowChildren = [];
    if ( options.decimalPointKey ) {

      // add a decimal point key plus a normal width zero key
      bottomRowChildren.push( createKey( '.', keyCallback, keyOptions ) );
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

  return inherit( VBox, NumberKeypad, {

    //TODO implement dispose

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
  } );
} );
