// Copyright 2016, University of Colorado Boulder

/**
 * a key accumulator the works in conjunction with a keypad to collect user input for integer values
 *
 * @author Aadish Gupta
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var AbstractKeyAccumulator = require( 'SCENERY_PHET/keypad/AbstractKeyAccumulator' );
  var inherit = require( 'PHET_CORE/inherit' );
  var DigitKey = require( 'SCENERY_PHET/keypad/DigitKey' );
  var PlusMinusKey = require( 'SCENERY_PHET/keypad/PlusMinusKey' );
  var Property = require( 'AXON/Property' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );

  /**
   * @param {Object} options
   * @constructor
   */
  function IntegerAccumulator( options ) {

    AbstractKeyAccumulator.call( this );

    options = _.extend( {

      // max number of digits that can be accumulated, the minus sign is not included in this
      maxLength: Number.MAX_SAFE_INTEGER.toString().length
    }, options );

    this.options = options; // @private

    // @public - string representation of the keys entered by the user
    this.stringProperty = new Property( this.updateStringValue( this.accumulatedKeysProperty.get(), 0 ) );

    // @public - numerical value of the keys entered by the user
    this.valueProperty = new Property( this.updateNumericalValue( this.accumulatedKeysProperty.get(), 0 ) );

    // @private - flag that controls whether the next key entry should clear the accumulated value
    this._clearOnNextKeyPress = false;
  }

  sceneryPhet.register( 'IntegerAccumulator', IntegerAccumulator );

  return inherit( AbstractKeyAccumulator, IntegerAccumulator, {

    // @private
    updateStringValue: function( accumulatedKeys, index ) {
      var returnValue = '';
      for ( var i = index; i < accumulatedKeys.length; i++ ) {
        assert && assert( accumulatedKeys[ i ] instanceof DigitKey, 'this accumulator only supports keys associated with integer values' );
        returnValue = returnValue.concat( accumulatedKeys[ i ].identifier );
      }
      return returnValue;
    },

    // @private
    updateNumericalValue: function( accumulatedKeys, index ) {
      if ( accumulatedKeys.length === 0 ) {
        return 0;
      }

      var stringRepresentation = this.updateStringValue( accumulatedKeys, index );
      return stringRepresentation.length > 0 ? parseInt( stringRepresentation, 10 ) : 0;
    },

    validateAndProcessInput: function( accumulatedKeys ) {
      var length = accumulatedKeys.length;
      var multiplier = 1;
      var maxLength = this.options.maxLength;
      var startIndex = 0;
      var startString = '';
      if ( length > 0 && accumulatedKeys[ 0 ] instanceof PlusMinusKey ) {
        multiplier = -1;
        maxLength += 1;
        startIndex = 1;
        startString = '-';
      }
      if ( accumulatedKeys.length <= maxLength ) {
        this.accumulatedKeysProperty.set( accumulatedKeys );
        this.stringProperty.set( startString.concat( this.updateStringValue( this.accumulatedKeysProperty.get(), startIndex ) ) );
        this.valueProperty.set( this.updateNumericalValue( this.accumulatedKeysProperty.get(), startIndex ) * multiplier );
      }
    },

    /**
     * clear the accumulator
     * @public
     */
    clear: function(){
      AbstractKeyAccumulator.prototype.clear.call( this );
      this.stringProperty.reset();
      this.valueProperty.reset();
      this.setClearOnNextKeyPress( false );
    },

    /**
     * set a flag that will cause the accumulator to be cleared on the entry of the next non-backspace key
     * @param {boolean} clearOnNextKeyPress
     * @public
     */
    setClearOnNextKeyPress: function( clearOnNextKeyPress ) {
      this._clearOnNextKeyPress = clearOnNextKeyPress;
    },
    set clearOnNextKeyPress( value ) { this.setClearOnNextKeyPress( value ); },

    /**
     * @returns {boolean}
     * @public
     */
    getClearOnNextKeyPress: function() {
      return this._clearOnNextKeyPress;
    },
    get clearOnNextKeyPress() { return this.getClearOnNextKeyPress(); }

  } );
} );