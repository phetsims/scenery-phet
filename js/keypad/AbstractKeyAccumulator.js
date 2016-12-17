// Copyright 2016, University of Colorado Boulder

/**
 * base type for an object that accumulates key presses, works in conjunction with a keypad
 *
 * @author John Blanco
 * @author Aadish Gupta
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );

  /**
   * @constructor
   */
  function AbstractKeyAccumulator() {

    // @public - array property that tracks the accumulated key presses
    this.accumulatedKeysProperty = new Property( [] );
  }

  sceneryPhet.register( 'AbstractKeyAccumulator', AbstractKeyAccumulator );

  return inherit( Object, AbstractKeyAccumulator, {

    /**
     * clear the accumulated keys
     * @public
     */
    clear: function() {
      this.accumulatedKeysProperty.reset();
    },

    /**
     * validate the accumulated keys, must be implemented in descendant types
     * @public
     */
    validateAndProcessInput: function( accumulatedKeys ) {
      assert && assert( false, 'this function must be implemented in descendant types' );
    }

  } );
} );