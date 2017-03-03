// Copyright 2016, University of Colorado Boulder

/**
 * Base type for an object that accumulates key presses, works in conjunction with a keypad.
 *
 * @author John Blanco
 * @author Aadish Gupta
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Keys = require( 'SCENERY_PHET/keypad/Keys' );
  var Property = require( 'AXON/Property' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var Tandem = require( 'TANDEM/Tandem' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function AbstractKeyAccumulator( options ) {
    Tandem.indicateUninstrumentedCode();

    options = _.extend( {
      alternativeValidator: null,  // if non-null, called at the start of validateAndUpdate.
                                   // alternativeValidator( proposedKeys ) { return true/false }
      additionalValidator: null    // if non-null, called after default validation in validateAndUpdate.
                                   // additionalValidator( proposedKeys ) { return true/false }
    }, options );

    // @public - array property that tracks the accumulated key presses
    this.accumulatedKeysProperty = new Property( [] ); //{Array.<string>}

    // @private - when true, the next key press (expect backspace) will clear the accumulated value
    this._clearOnNextKeyPress = false;

    this.additionalValidator = options.additionalValidator; // @private
    this.alternativeValidator = options.alternativeValidator; // @private

    assert && assert( !( this.additionalValidator && this.alternativeValidator ),
      'Cannot provide additional and alternative validation simultaneously' );
  }

  sceneryPhet.register( 'AbstractKeyAccumulator', AbstractKeyAccumulator );

  return inherit( Object, AbstractKeyAccumulator, {

    /**
     * Clears the accumulated keys.
     * @public
     */
    clear: function() {
      this.accumulatedKeysProperty.reset();
    },

    /**
     * Determines whether pressing a key (except for backspace) will clear the existing value.
     * @param {boolean} clearOnNextKeyPress
     * @public
     */
    setClearOnNextKeyPress: function( clearOnNextKeyPress ) {
      this._clearOnNextKeyPress = clearOnNextKeyPress;
    },
    set clearOnNextKeyPress( value ) { this.setClearOnNextKeyPress( value ); },

    /**
     * Will pressing a key (except for backspace) clear the existing value?
     * @returns {boolean}
     * @public
     */
    getClearOnNextKeyPress: function() {
      return this._clearOnNextKeyPress;
    },
    get clearOnNextKeyPress() { return this.getClearOnNextKeyPress(); },

    /**
     * Validates a proposed set of keys and (if valid) updates other other state in the accumulator.
     * @param {Keys[]} proposedKeys - the proposed set of keys, to be validated
     * @public
     */
    validateAndUpdate: function( proposedKeys ) {
      // if alternative validation is provided it is called here
      if ( this.alternativeValidator ) {
        if ( this.alternativeValidator( proposedKeys ) ) {
          this.accumulatedKeysProperty.set( proposedKeys );
        }
      }
      else {
        // default validation for the accumulator
        if ( this.defaultValidator( proposedKeys ) ) {
          // if additional validation is provided it is called here
          if ( this.additionalValidator ) {
            if ( this.additionalValidator( proposedKeys ) ) {
              this.accumulatedKeysProperty.set( proposedKeys );
            }
          }
          else {
            this.accumulatedKeysProperty.set( proposedKeys );
          }
        }
      }
    },

    /**
     * Validates a proposed set of keys.
     * @param {Keys[]} proposedKeys - the proposed set of keys, to be validated
     * @return {boolean}
     * @private
     * @abstract
     */
    defaultValidator: function( proposedKeys ) {
      throw new Error( 'abstract function must be implemented by subtypes' );
    },

    /**
     * Called by the key accumulator when this key is pressed.
     * @param {Keys} keyIdentifier
     * @public
     * @abstract
     */
    handleKeyPressed: function( keyIdentifier ) {
      throw new Error( 'abstract function must be implemented by subtypes' );
    },

    /**
     * creates an empty array if clearOnNextKeyPress is true, the behavior differs if Backspace key is pressed
     * @param {Keys} keyIdentifier
     * @returns {Keys[]} proposedArray
     * @private
     */
    handleClearOnNextKeyPress: function( keyIdentifier ) {
      var proposedArray;
      if ( !this.getClearOnNextKeyPress() || keyIdentifier === Keys.BACKSPACE ) {
        proposedArray = _.clone( this.accumulatedKeysProperty.get() );
      }
      else {
        proposedArray = [];
      }
      this.setClearOnNextKeyPress( false );
      return proposedArray;
    }
  } );
} );