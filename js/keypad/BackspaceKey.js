// Copyright 2016, University of Colorado Boulder

/**
 * Backspace key for use in a keypad.
 * Removes the last item from the array of accumulated keys.
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
  var Tandem = require( 'TANDEM/Tandem' );

  /**
   * @param {number} width
   * @param {number} height
   * @constructor
   */
  function BackspaceKey( width, height ) {
    Tandem.indicateUninstrumentedCode();

    var backSpaceIcon = new BackspaceIcon();
    backSpaceIcon.scale(
      Math.min( width / backSpaceIcon.width * 0.7, ( height * 0.65 ) / backSpaceIcon.height )
    ); //TODO Figure how to do without specifying height and width
    AbstractKey.call( this, backSpaceIcon, null, 'Backspace' );
  }

  sceneryPhet.register( 'BackspaceKey', BackspaceKey);

  return inherit( AbstractKey, BackspaceKey, {

    /**
     * Removes the last item from the array of accumulated keys.
     * @param {AbstractKeyAccumulator} keyAccumulator
     * @returns {Array.<AbstractKey>}
     * @override
     * @public
     */
    handleKeyPressed: function( keyAccumulator ) {
      var newArray = _.clone( keyAccumulator.accumulatedKeysProperty.get() );
      if ( keyAccumulator.getClearOnNextKeyPress() ) {
        keyAccumulator.setClearOnNextKeyPress( false );
      }
      newArray.pop( );
      return newArray;
    }
  } );
} );