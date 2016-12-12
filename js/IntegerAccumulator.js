// Copyright 2016, University of Colorado Boulder
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var IntegerKey = require( 'SCENERY_PHET/IntegerKey' );
  var PlusMinusKey = require( 'SCENERY_PHET/PlusMinusKey' );
  var Property = require( 'AXON/Property' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );

  function IntegerAccumulator( allowedLength ) {
    this.allowedLength = allowedLength;
    this.accumulatedArrayProperty = new Property( [] );
    this.displayProperty = new Property( this.displayValue( this.accumulatedArrayProperty.get(), 0 ) );
    this.valueProperty = new Property( this.logicalValue( this.accumulatedArrayProperty.get(), 0 ) );
    
  }

  sceneryPhet.register( 'IntegerAccumulator', IntegerAccumulator );

  return inherit( Object, IntegerAccumulator, {
    displayValue: function( accumulatedArray, index ){
      var returnValue = '';
      for( var i = index; i < accumulatedArray.length; i++ ){
        assert && assert( accumulatedArray[i] instanceof IntegerKey, 'This Accumulator Only Supports Integer Key' );
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

    validateInput: function( accumulatedArray ){
      var length = accumulatedArray.length;
      var multiplier = 1;
      var allowedLength = this.allowedLength;
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
    }
  } );
} );