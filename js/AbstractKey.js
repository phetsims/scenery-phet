// Copyright 2016, University of Colorado Boulder
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
      // To Be Implemented by Derived Class
    }

    /*// helper functions

    convertIntegerArrayToLogicalValue: function(){
      var computedValue;
      var computedString = '';

    }*/

  } );
} );