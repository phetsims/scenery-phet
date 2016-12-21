// Copyright 2016, University of Colorado Boulder

/**
 * Base type for an object that accumulates key presses, works in conjunction with a keypad.
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

    //TODO what is the type of the array elements? Document like {Property.<[]?>}
    // @public - array property that tracks the accumulated key presses
    this.accumulatedKeysProperty = new Property( [] );
  }

  sceneryPhet.register( 'AbstractKeyAccumulator', AbstractKeyAccumulator );

  return inherit( Object, AbstractKeyAccumulator, {

    /**
     * Clears the accumulated keys.
     * @public
     */
    clear: function() {
      this.accumulatedKeysProperty.reset();
    },

    /**
     * Validates the accumulated keys.
     * @public
     * @abstract
     */
    validateAndProcessInput: function( accumulatedKeys ) {
      throw new Error( 'abstract function must be implemented by subtypes' );
    }

  } );
} );