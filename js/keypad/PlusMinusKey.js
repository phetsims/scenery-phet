// Copyright 2016, University of Colorado Boulder

/**
 * Plus/minus key for use in a keypad, for toggling the sign.
 *
 * @author Aadish Gupta
 */
define( function( require ) {
  'use strict';

  // modules
  var AbstractKey = require( 'SCENERY_PHET/keypad/AbstractKey' );
  var inherit = require( 'PHET_CORE/inherit' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );

  /**
   * @constructor
   */
  function PlusMinusKey( ) {
    AbstractKey.call( this, '+/-', null, 'PlusMinus' ); //TODO Check how to represent this node
  }

  sceneryPhet.register( 'PlusMinusKey', PlusMinusKey);

  return inherit( AbstractKey, PlusMinusKey, {

    /**
     * When this key is pressed it adds the instance of the class at the beginning of the array
     * if it does not exist, or removes it if it does. This effectively toggles the sign.
     * @param {AbstractKeyAccumulator} keyAccumulator
     * @returns {Array.<AbstractKey>}
     * @override
     * @public
     */
    handleKeyPressed: function( keyAccumulator ) {

      var newArray;
      if ( keyAccumulator.getClearOnNextKeyPress() ) {
        newArray = [];
        keyAccumulator.setClearOnNextKeyPress( false );
      }
      else{
        newArray = _.clone( keyAccumulator.accumulatedKeysProperty.get() );
      }
      // check if first element of array is instance of this class
      if ( newArray.length > 0 && newArray[ 0 ].identifier === this.identifier ){
        newArray.shift();
      }
      else{
        newArray.unshift( this );
      }
      return newArray;
    }
  } );
} );