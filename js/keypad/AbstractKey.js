// Copyright 2016, University of Colorado Boulder

/**
 * Base class for keys used in a keypad - specifies the node to be displayed on the key, value if any identifier for
 * internal use
 *
 * All keys are derived from this class and must implement onKeyPressed function.
 *
 * @author Aadish Gupta
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );

  /**
   * @param {Node} displayNode - node that will appear on the key
   * @param {number} value
   * @param identifier
   * @constructor
   */
  function AbstractKey( displayNode, value, identifier ) {
    this.displayNode = displayNode;
    this.value = value;
    this.identifier = identifier;
  }

  sceneryPhet.register( 'AbstractKey', AbstractKey );

  return inherit( Object, AbstractKey, {

    /**
     * Function that is called by the key accumulator when this key is pressed, must be implemented in descendant
     * classes.
     * @public
     */
    onKeyPressed: function(){
      assert && assert( false, 'Derived class should implement this function' );
    }
  } );
} );