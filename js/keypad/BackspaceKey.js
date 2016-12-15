// Copyright 2016, University of Colorado Boulder

/**
 * backspace key for use in the keypad - when this key is presses it removes the last object from the accumulated keys
 * array and returns the new array
 *
 * @author Aadish Gupta
 */
define( function( require ) {
  'use strict';

  // modules
  var AbstractKey = require( 'SCENERY_PHET/keypad/AbstractKey' );
  var BackspaceIcon = require( 'SCENERY_PHET/BackspaceIcon' );
  var inherit = require( 'PHET_CORE/inherit' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );

  /**
   * @param {number} width
   * @param {number} height
   * @constructor
   */
  function BackspaceKey( width, height ) {
    var backSpaceIcon = new BackspaceIcon();
    backSpaceIcon.scale(
      Math.min( width / backSpaceIcon.width * 0.7, ( height * 0.65 ) / backSpaceIcon.height )
    ); //TODO Figure how to do without specifying height and width
    AbstractKey.call( this, backSpaceIcon, null, 'Backspace' );
  }

  sceneryPhet.register( 'BackspaceKey', BackspaceKey);

  return inherit( AbstractKey, BackspaceKey, {

    /**
     * @override
     * @param accumulator
     * @returns {*}
     * @public
     */
    handleKeyPressed: function( accumulator ){
      var newArray = _.clone( accumulator.accumulatedArrayProperty.get() );
      if ( accumulator.getClearOnNextKeyPress() ){
        accumulator.setClearOnNextKeyPress( false );
      }
      newArray.pop( );
      return newArray;
    }
  } );
} );