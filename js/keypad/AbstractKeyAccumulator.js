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
   * @constructor
   */
  function AbstractKeyAccumulator() {
    Tandem.indicateUninstrumentedCode();

    //TODO what is the type of the array elements? Document like {Property.<[]?>}
    // @public - array property that tracks the accumulated key presses
    this.accumulatedKeysProperty = new Property( [] );

    // @private - when true, the next key press (expect backspace) will clear the accumulated value
    this._clearOnNextKeyPress = false;
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
     * @param {AbstractKey[]} proposedKeys - the proposed set of keys, to be validated
     * @public
     * @abstract
     */
    validateAndUpdate: function( proposedKeys ) {
      throw new Error( 'abstract function must be implemented by subtypes' );
    },

    /**
     * Called by the key accumulator when this key is pressed.
     * @param {AbstractKeyAccumulator} keyAccumulator
     * @public
     * @abstract
     */
    handleKeyPressed: function( keyIdentifier ) {
      throw new Error( 'abstract function must be implemented by subtypes' );
    },

    isDigit: function( char ) {
      return !isNaN( char ) && char >= '0' && char <= 9;
    },

    handleClearOnNextKeyPress: function( keyIdentifier ) {
      var newArray;
      if ( !this.getClearOnNextKeyPress() || keyIdentifier === Keys.BACKSPACE ) {
        newArray = _.clone( this.accumulatedKeysProperty.get() );
      }
      else {
        newArray = [];
      }
      this.setClearOnNextKeyPress( false );
      return newArray;
    }
  } );
} );