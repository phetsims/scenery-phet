// Copyright 2016, University of Colorado Boulder

/**
 * IntegerAccumulator class contains the keys pressed by user and process over those inputs to get logical value and
 * display value
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var DigitKey = require( 'SCENERY_PHET/keypad/DigitKey' );
  var PlusMinusKey = require( 'SCENERY_PHET/keypad/PlusMinusKey' );
  var Property = require( 'AXON/Property' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );

  function IntegerAccumulator( options ) {
    options = _.extend( {
      allowedLength: Number.MAX_SAFE_INTEGER.toString().length
    }, options );

    this.options = options;
    this.accumulatedArrayProperty = new Property( [] );
    this.displayProperty = new Property( this.displayValue( this.accumulatedArrayProperty.get(), 0 ) );
    this.valueProperty = new Property( this.logicalValue( this.accumulatedArrayProperty.get(), 0 ) );
    this._clearOnNextKeyPress = false; //@private
  }

  sceneryPhet.register( 'IntegerAccumulator', IntegerAccumulator );

  return inherit( Object, IntegerAccumulator, {

    displayValue: function( accumulatedArray, index ){
      var returnValue = '';
      for( var i = index; i < accumulatedArray.length; i++ ){
        assert && assert( accumulatedArray[ i ] instanceof DigitKey, 'This Accumulator Only Supports Integer Key' );
        returnValue = returnValue.concat( accumulatedArray[ i ].identifier );
      }
      return returnValue;
    },

    logicalValue: function( accumulatedArray, index ){
      if ( accumulatedArray.length === 0 ){
        return 0;
      }

      var stringRepresentation = this.displayValue( accumulatedArray, index );
      return stringRepresentation.length > 0 ? parseInt( stringRepresentation, 10 ) : 0;
    },

    validateAndProcessInput: function( accumulatedArray ){
      var length = accumulatedArray.length;
      var multiplier = 1;
      var allowedLength = this.options.allowedLength;
      var startIndex = 0;
      var startString = '';
      if( length > 0  && accumulatedArray[0] instanceof PlusMinusKey ){
        multiplier = -1;
        allowedLength += 1;
        startIndex = 1;
        startString = '-';
      }
      if ( accumulatedArray.length <= allowedLength ){
        this.accumulatedArrayProperty.set( accumulatedArray );
        this.displayProperty.set( startString.concat( this.displayValue( this.accumulatedArrayProperty.get(), startIndex ) ) );
        this.valueProperty.set( this.logicalValue( this.accumulatedArrayProperty.get(), startIndex ) * multiplier );
      }
    },

    clear: function(){
      this.accumulatedArrayProperty.reset();
      this.displayProperty.reset();
      this.valueProperty.reset();
      this.setClearOnNextKeyPress( false );
    },

    /**
     * Determines whether pressing a key (except for the backspace) will clear the existing value.
     * @param {boolean} clearOnNextKeyPress
     * @public
     */
    setClearOnNextKeyPress: function( clearOnNextKeyPress ) {
      this._clearOnNextKeyPress = clearOnNextKeyPress;
    },
    set clearOnNextKeyPress( value ) { this.setClearOnNextKeyPress( value ); },


    /**
     * Will pressing a key (except for the backspace point) clear the existing value?
     * @returns {boolean}
     */
    getClearOnNextKeyPress: function() {
      return this._clearOnNextKeyPress;
    },
    get clearOnNextKeyPress() { return this.getClearOnNextKeyPress(); }

  } );
} );