// Copyright 2016, University of Colorado Boulder

/**
 * IntegerKey Class derived from AbstractKey class. Handles Single Digit only.
 *
 * When this key is pressed it adds the instance of the class at the end of the array
 *
 * @author Aadish Gupta
 */

define( function( require ) {
  'use strict';

  // modules
  var AbstractKey = require( 'SCENERY_PHET/AbstractKey' );
  var inherit = require( 'PHET_CORE/inherit' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );

  /**
   * @param {number} integer
   * @constructor
   */
  function IntegerKey( integer ) {
    assert && assert( integer.toString().length === 1, 'Integer Key Handles Single Digit Only' );
    AbstractKey.call( this, integer.toString(), integer, integer );
  }

  sceneryPhet.register( 'IntegerKey', IntegerKey );

  return inherit( AbstractKey, IntegerKey, {
    handleKeyPressed: function( accumulator ){
      var newArray;
      if ( accumulator.getClearOnNextKeyPress() ){
        newArray = [];
        accumulator.setClearOnNextKeyPress( false );
      }
      else{
        newArray = _.clone( accumulator.accumulatedArrayProperty.get() );
      }
      newArray.push( this );
      return newArray;
    }


  } );
} );