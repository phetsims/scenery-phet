// Copyright 2016, University of Colorado Boulder

/**
 * Base type for keys used in a keypad.
 *
 * @author Aadish Gupta
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var Tandem = require( 'TANDEM/Tandem' );
  Tandem.indicateUninstrumentedCode();

  /**
   * @param {Node} displayNode - node that will appear on the key
   * @param {number} value TODO document me
   * @param {string} identifier TODO document me
   * @constructor
   */
  function AbstractKey( displayNode, value, identifier ) {

    //TODO visibility annotations?
    this.displayNode = displayNode;
    this.value = value;
    this.identifier = identifier;
  }

  sceneryPhet.register( 'AbstractKey', AbstractKey );

  return inherit( Object, AbstractKey, {

    /**
     * Called by the key accumulator when this key is pressed.
     * @param {AbstractKeyAccumulator} keyAccumulator
     * @public
     * @abstract
     */
    handleKeyPressed: function( keyAccumulator ) {
      throw new Error( 'abstract function must be implemented by subtypes' );
    }
  } );
} );