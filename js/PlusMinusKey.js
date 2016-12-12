// Copyright 2016, University of Colorado Boulder
define( function( require ) {
  'use strict';

  // modules
  var AbstractKey = require( 'SCENERY_PHET/AbstractKey' );
  var inherit = require( 'PHET_CORE/inherit' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );

  function PlusMinusKey( ) {
    AbstractKey.call( this, '+/-', null, 'PlusMinus' );
  }

  sceneryPhet.register( 'PlusMinusKey', PlusMinusKey);

  return inherit( AbstractKey, PlusMinusKey, {
    handleKeyPressed: function( array ){
      var newArray = _.clone( array );
      if ( newArray.length > 0 ){
        // check if first element of array is instance of this class
        if ( newArray[ 0 ].identifier === this.identifier ){
          newArray.shift();
        }
        else{
          newArray.unshift( this );
        }
      }
      return newArray;
    }
  } );
} );