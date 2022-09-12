// Copyright 2017-2022, University of Colorado Boulder

/**
 * An enum that defines the keys supported by the common-code keypad. If a new type of key is needed, it must be added
 * here.
 *
 * @author Aadish Gupta
 * @author John Blanco
 */

import sceneryPhet from '../sceneryPhet.js';

const KeyID = {
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
} as const;

export type KeyIDValue = typeof KeyID[keyof typeof KeyID];

// verify that enum is immutable, without the runtime penalty in production code
if ( assert ) { Object.freeze( KeyID ); }

sceneryPhet.register( 'KeyID', KeyID );

export default KeyID;