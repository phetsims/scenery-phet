// Copyright 2016-2019, University of Colorado Boulder

/**
 * base type for an object that accumulates key presses, works in conjunction with the common-code keypad
 *
 * @author John Blanco
 * @author Aadish Gupta
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var KeyID = require( 'SCENERY_PHET/keypad/KeyID' );
  var Property = require( 'AXON/Property' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var Tandem = require( 'TANDEM/Tandem' );

  /**
   * @param {Array.<function>} validators
   * @param {Object} [options]
   * @constructor
   */
  function AbstractKeyAccumulator( validators, options ) {
    Tandem.indicateUninstrumentedCode();

    options = _.extend( {

      // a function that, if non-null, is used in addition to the default validation function to validate the user input
      // type spec: additionalValidator(Array.<KeyID>) { return true/false }
      additionalValidator: null

    }, options );

    // @public (read-only) {Array.<Key>} - property that tracks the accumulated key presses as an array
    this.accumulatedKeysProperty = new Property( [] );

    // @private {boolean} - when true, the next key press (expect backspace) will clear the accumulated value
    this._clearOnNextKeyPress = false;

    // @private {function|null}
    this.additionalValidator = options.additionalValidator;

    // @protected {function}
    this.validators = validators;
  }

  sceneryPhet.register( 'AbstractKeyAccumulator', AbstractKeyAccumulator );

  return inherit( Object, AbstractKeyAccumulator, {

    /**
     * clears the accumulated keys
     * @public
     */
    clear: function() {
      this.accumulatedKeysProperty.reset();
    },

    /**
     * set/clear the flag that determines whether pressing a key (except for backspace) will clear the accumulated keys
     * @param {boolean} clearOnNextKeyPress
     * @public
     */
    setClearOnNextKeyPress: function( clearOnNextKeyPress ) {
      this._clearOnNextKeyPress = clearOnNextKeyPress;
    },
    set clearOnNextKeyPress( value ) {
      this.setClearOnNextKeyPress( value );
    },

    /**
     * get the value of the flag determines whether pressing a key (except for backspace) will clear the accumulated
     * keys
     * @returns {boolean}
     * @public
     */
    getClearOnNextKeyPress: function() {
      return this._clearOnNextKeyPress;
    },
    get clearOnNextKeyPress() {
      return this.getClearOnNextKeyPress();
    },

    /**
     * validates a proposed set of keys and (if valid) update the property that represents the accumulated keys
     * @param {Array.<KeyID>} proposedKeys - the proposed set of keys, to be validated
     * @protected
     *
     * @returns boolean
     */
    validateKeys: function( proposedKeys ) {

      // Ensures that proposedKeys exist before validation
      var valid = !!proposedKeys;

      // If any validator returns false then the proposedKey is not valid
      this.validators.forEach( function( validator ) {
        valid = valid && validator( proposedKeys );
      } );
      return valid;
    },
    /**
     * update the property that represents the accumulated keys
     * @param {Array.<KeyID>} proposedKeys - the proposed set of keys
     * @protected
     */
    updateKeys: function( proposedKeys ) {
      this.accumulatedKeysProperty.set( proposedKeys );
    },
    // TODO: Remove after changes are complete. See https://github.com/phetsims/scenery-phet/issues/283
    // validateAndUpdate: function( proposedKeys ) {
    //
    //   // if alternative validation is provided it is called here
    //   if ( this.alternativeValidator ) {
    //     if ( this.alternativeValidator( proposedKeys ) ) {
    //       this.accumulatedKeysProperty.set( proposedKeys );
    //     }
    //   }
    //   else {
    //
    //     // default validation for the accumulator
    //     if ( this.defaultValidator( proposedKeys ) ) {
    //
    //       // if additional validation is provided it is called here
    //       if ( this.additionalValidator ) {
    //         if ( this.additionalValidator( proposedKeys ) ) {
    //           this.accumulatedKeysProperty.set( proposedKeys );
    //         }
    //       }
    //       else {
    //         this.accumulatedKeysProperty.set( proposedKeys );
    //       }
    //     }
    //   }
    // },

    /**
     * Called by the key accumulator when this key is pressed.
     * @param {KeyID} keyIdentifier
     * @public
     * @abstract
     */
    handleKeyPressed: function( keyIdentifier ) {
      throw new Error( 'abstract function must be implemented by subtypes' );
    },

    /**
     * creates an empty array if clearOnNextKeyPress is true, the behavior differs if Backspace key is pressed
     * @param {KeyID} keyIdentifier
     * @returns {Array.<KeyID>} proposedArray
     * @private
     */
    handleClearOnNextKeyPress: function( keyIdentifier ) {
      var proposedArray;
      if ( !this.getClearOnNextKeyPress() || keyIdentifier === KeyID.BACKSPACE ) {
        proposedArray = _.clone( this.accumulatedKeysProperty.get() );
      }
      else {
        proposedArray = [];
      }
      this.setClearOnNextKeyPress( false );
      return proposedArray;
    },

    /**
     * Cleans up references.
     * @public
     */
    dispose: function() {
      this.accumulatedKeysProperty.dispose();
    }
  } );
} );