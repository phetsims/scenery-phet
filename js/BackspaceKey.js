// Copyright 2016, University of Colorado Boulder
define( function( require ) {
  'use strict';

  // modules
  var AbstractKey = require( 'SCENERY_PHET/AbstractKey' );
  var BackspaceIcon = require( 'SCENERY_PHET/BackspaceIcon' );
  var inherit = require( 'PHET_CORE/inherit' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );

  function BackspaceKey( width, height ) {
    var backSpaceIcon = new BackspaceIcon();
    backSpaceIcon.scale(
      Math.min( width / backSpaceIcon.width * 0.7, ( height * 0.65 ) / backSpaceIcon.height )
    );
    AbstractKey.call( this, backSpaceIcon, null, 'Backspace' );
  }

  sceneryPhet.register( 'BackspaceKey', BackspaceKey);

  return inherit( AbstractKey, BackspaceKey, {
    handleKeyPressed: function( array ){
      var newArray = _.clone( array );
      newArray.pop( );
      return newArray;
    }
  } );
} );