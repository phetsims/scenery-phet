// Copyright 2017, University of Colorado Boulder

/**
 * enum that defines the type of keys supported by Keypad. If a new type of key is needed it has to be added here
 *
 * @author Aadish Gupta
 */
define( function( require ) {
  'use strict';

  // modules
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );

  var Keys = {
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
    PLUSMINUS: 'PLUSMINUS',
    X: 'X',
    XSQUARED: 'XSQUARED'
  };

  // verify that enum is immutable, without the runtime penalty in production code
  if ( assert ) { Object.freeze( Keys ); }

  sceneryPhet.register( 'Keys', Keys );

  return Keys;
} );