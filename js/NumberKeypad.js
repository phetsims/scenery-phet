// Copyright 2015, University of Colorado Boulder

/**
 * A scenery node that looks like a key pad and allows the user to enter a number. The entered number is not
 * displayed by this node - it is intended to be used in conjunction with a separate display of some sort.
 *
 * @author John Blanco
 * @author Andrey Zelenkov (MLearner)
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
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );

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

      //TODO replace with a function that accepts or rejects entry
      maxDigits: 8, // Maximum number of digits that the user may enter
      digitStringProperty: new Property( '' ) // create a digit string property or use the one supplied by the client
    }, options );

    var self = this;

    //TODO bad name. Numbers contain more than 'digits' - decimal point, sign, ...
    // @public, read only - string of digits entered by the user
    this.digitStringProperty = options.digitStringProperty;

    //TODO I've read this 5 times and have no idea what it does
    // @private - flag used when arming the keypad to start over on the next key stroke
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
        if ( self.digitStringProperty.value.length > 0 ) {

          // remove the last digit from the current digit string
          var shortenedDigitString = self.digitStringProperty.value.slice( 0, -1 );

          if ( self.armedForNewEntry ) {
            self.digitStringProperty.reset(); // this reset will trigger the state change that we want in the game
            self.armedForNewEntry = false;
          }

          // set the new shortened value
          self.digitStringProperty.value = shortenedDigitString;
        }
      }
    } );

    // Called when a key is pressed.
    var keyCallback = function( keyString ) {

      var decimalIndex = self.digitStringProperty.value.indexOf( '.' );

      //TODO bug here? Type '5.67' and digitLength is 2
      var digitLength = ( decimalIndex === -1 ) ?
                        self.digitStringProperty.value.length :
                        self.digitStringProperty.value.length - 1;

      // If armed for new entry, clear the existing string.
      if ( self.armedForNewEntry ) {
        self.digitStringProperty.reset();
        self.armedForNewEntry = false;
      }

      // Add the digit to the string, but limit the length and prevent multiple leading zeros.
      if ( self.digitStringProperty.value === '0' ) {
        if ( keyString !== '0' ) {
          // Replace the leading 0 with this digit.
          self.digitStringProperty.value = keyString;
        }
        // else ignore the additional zero
      }
      else if ( digitLength < keyOptions.maxDigits ) {

        // only allow a single decimal point
        if ( keyString !== '.' || self.digitStringProperty.value.indexOf( '.' ) === -1 ) {
          self.digitStringProperty.value += keyString;
        }
      }
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

    /**
     * Clear anything that has been accumulated in the digitString field.
     * @public
     */
    clear: function() {
      this.digitStringProperty.reset();
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
