// Copyright 2016, University of Colorado Boulder

/**
 * A key accumulator that collects user input for integer values.
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
   * @param {Object} [options]
   * @constructor
   */
  function IntegerAccumulator( options ) {

    options = _.extend( {

      // max number of digits that can be accumulated, the minus sign is not included in this
      maxLength: Number.MAX_SAFE_INTEGER.toString().length
    }, options );

    //TODO saving the entire options is an anti-pattern. And the only option actually used is maxLength.
    this.options = options; // @private

    AbstractKeyAccumulator.call( this );

    //TODO @public (read-only) ?
    // @public - string representation of the keys entered by the user
    this.stringProperty = new Property( this.updateStringValue( this.accumulatedKeysProperty.get(), 0 ) );

    //TODO @public (read-only) ?
    // @public - numerical value of the keys entered by the user
    this.valueProperty = new Property( this.updateNumericalValue( this.accumulatedKeysProperty.get(), 0 ) );

    // @private - when true, the next key press (expect backspace) will clear the accumulated value
    this._clearOnNextKeyPress = false;
  }

  sceneryPhet.register( 'IntegerAccumulator', IntegerAccumulator );

  return inherit( AbstractKeyAccumulator, IntegerAccumulator, {

    //TODO document me
    // @private
    updateStringValue: function( accumulatedKeys, index ) {
      var returnValue = '';
      for ( var i = index; i < accumulatedKeys.length; i++ ) {
        assert && assert( accumulatedKeys[ i ] instanceof DigitKey, 'this accumulator only supports keys associated with integer values' );
        returnValue = returnValue.concat( accumulatedKeys[ i ].identifier );
      }
      return returnValue;
    },

    //TODO document me
    // @private
    updateNumericalValue: function( accumulatedKeys, index ) {
      var stringRepresentation = this.updateStringValue( accumulatedKeys, index );
      return stringRepresentation.length > 0 ? parseInt( stringRepresentation, 10 ) : 0;
    },

    /**
     * TODO document me
     * @public
     * @override
     */
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
    get clearOnNextKeyPress() { return this.getClearOnNextKeyPress(); }

  } );
} );