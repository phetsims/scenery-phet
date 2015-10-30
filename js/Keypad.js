// Copyright 2002-2015, University of Colorado Boulder

/**
 * A scenery node that looks like a key pad and allows the user to enter digits.  The entered digits are not displayed
 * by this node - it is intended to be used in conjunction with a separate display of some sort.
 *
 * @author John Blanco
 * @author Andrey Zelenkov (MLearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var HStrut = require( 'SCENERY/nodes/HStrut' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var BackspaceIcon = require( 'SCENERY_PHET/BackspaceIcon' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function Keypad( options ) {

    options = _.extend( {
      buttonFont: new PhetFont( { size: 20 } ),
      minButtonWidth: 35,
      minButtonHeight: 35,
      doubleWideZeroKey: true,
      xSpacing: 10,
      ySpacing: 10,
      keyColor: 'white',
      maxDigits: 8, // Maximum number of digits that the user may enter
      digitStringProperty: new Property( '' ) // create a digit string property or use the one supplied by the client
    }, options );

    var self = this;

    // @public, read only - string of digits entered by the user
    this.digitStringProperty = options.digitStringProperty;

    // @private - flag used when arming the keypad to start over on the next key stroke
    this.armedForNewEntry = false;

    // bundle the various options that control the button appearance into a "button specification" or buttonKeySpec
    var buttonKeySpec = {
      minWidth: options.minButtonWidth,
      minHeight: options.minButtonHeight,
      baseColor: options.keyColor,
      font: options.buttonFont,
      maxDigits: options.maxDigits
    };

    // create the backspace button
    var backspaceIcon = new BackspaceIcon();
    backspaceIcon.scale( Math.min( options.minButtonWidth / backspaceIcon.width * 0.7, ( options.minButtonHeight * 0.65 ) / backspaceIcon.height ) );
    var backspaceButton = new RectangularPushButton( {
      content: backspaceIcon,
      minWidth: buttonKeySpec.minWidth,
      minHeight: buttonKeySpec.minHeight,
      xMargin: 1,
      baseColor: buttonKeySpec.baseColor,
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

    // create the bottom row of buttons, which can vary based on options
    var bottomButtonRowChildren = [];
    if ( options.doubleWideZeroKey ) {
      // add a double-width zero key
      var doubleRowButtonKeySpec = _.extend( {}, buttonKeySpec, { minWidth: buttonKeySpec.minWidth * 2 + options.xSpacing } );
      bottomButtonRowChildren.push( createNumberKey( 0, this, doubleRowButtonKeySpec ) );
    }
    else {
      // add a normal width zero key plus a spacer to keep the layout looking good
      bottomButtonRowChildren.push( createNumberKey( 0, this, buttonKeySpec ) );
      bottomButtonRowChildren.push( new HStrut( options.minButtonWidth ) );
    }
    bottomButtonRowChildren.push( backspaceButton );

    // add the rest of the keys
    VBox.call( this, {
      spacing: options.ySpacing, children: [
        new HBox( {
          spacing: options.xSpacing, children: [
            createNumberKey( 7, this, buttonKeySpec ),
            createNumberKey( 8, this, buttonKeySpec ),
            createNumberKey( 9, this, buttonKeySpec )
          ]
        } ),
        new HBox( {
          spacing: options.xSpacing, children: [
            createNumberKey( 4, this, buttonKeySpec ),
            createNumberKey( 5, this, buttonKeySpec ),
            createNumberKey( 6, this, buttonKeySpec )
          ]
        } ),
        new HBox( {
          spacing: options.xSpacing, children: [
            createNumberKey( 1, this, buttonKeySpec ),
            createNumberKey( 2, this, buttonKeySpec ),
            createNumberKey( 3, this, buttonKeySpec )
          ]
        } ),
        new HBox( { spacing: options.xSpacing, children: bottomButtonRowChildren } )
      ]
    } );

    // Pass options through to parent class
    this.mutate( options );
  }

  // convenience function for creating the buttons that act as the individual keys
  function createNumberKey( number, parentKeypad, buttonSpec ) {
    return new RectangularPushButton( {
      content: new Text( number.toString(), { font: buttonSpec.font } ),
      baseColor: buttonSpec.baseColor,
      minWidth: buttonSpec.minWidth,
      minHeight: buttonSpec.minHeight,
      xMargin: 5,
      yMargin: 5,
      listener: function() {

        // If armed for new entry, clear the existing string.
        if ( parentKeypad.armedForNewEntry ) {
          parentKeypad.digitStringProperty.reset();
          parentKeypad.armedForNewEntry = false;
        }

        // Add the digit to the string, but limit the length and prevent multiple leading zeros.
        if ( parentKeypad.digitStringProperty.value === '0' ) {
          if ( number.toString !== 0 ) {
            // Replace the leading 0 with this digit.
            parentKeypad.digitStringProperty.value = number.toString();
          }
          // else ignore the additional zero
        }
        else if ( parentKeypad.digitStringProperty.value.length < buttonSpec.maxDigits ) {
          parentKeypad.digitStringProperty.value += number.toString();
        }
      }
    } );
  }

  return inherit( VBox, Keypad, {

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
