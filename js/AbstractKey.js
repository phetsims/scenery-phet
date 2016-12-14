// Copyright 2016, University of Colorado Boulder

/**
 * Base class for the key which specifies that key should contain display node for display, value if any identifier for
 * internal use
 * All they keys are derived from this class and have to implement onKeyPressed function
 *
 * @author Aadish Gupta
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );

  function AbstractKey( displayNode, value, identifier ) {
    this.displayNode = displayNode;
    this.value = value;
    this.identifier = identifier;
  }

  sceneryPhet.register( 'AbstractKey', AbstractKey );

  return inherit( Object, AbstractKey, {

    onKeyPressed: function(){
      assert && assert( false, 'Derived class should implement this function' );
    }



  } );
} );