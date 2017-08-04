// Copyright 2017, University of Colorado Boulder

/**
 * An enum that defines the keys supported by the common-code keypad. If a new type of key is needed, it must be added
 * here.
 *
 * @author Aadish Gupta
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );

  var KeyID = {
    ZERO: '0',
    ONE: '1',
    TWO: '2',
    THREE: '3',
    FOUR: '4',
    FIVE: '5',
    SIX: '6',
    SEVEN: '7',
    EIGHT: '8',
    NINE: '9',
    BACKSPACE: 'BACKSPACE',
    DECIMAL: 'DECIMAL',
    PLUS_MINUS: 'PLUS_MINUS',
    X: 'X',
    X_SQUARED: 'X_SQUARED'
  };

  // verify that enum is immutable, without the runtime penalty in production code
  if ( assert ) { Object.freeze( KeyID ); }

  sceneryPhet.register( 'KeyID', KeyID );

  return KeyID;
} );