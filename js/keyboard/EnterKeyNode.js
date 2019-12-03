// Copyright 2017-2019, University of Colorado Boulder

/**
 * Node that looks like a 'Enter' key on a keyboard.
 *
 * @author Jesse Greenberg
 */

define( require => {
  'use strict';

  // modules
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  const TextKeyNode = require( 'SCENERY_PHET/keyboard/TextKeyNode' );

  // strings
  const keyEnterString = require( 'string!SCENERY_PHET/key.enter' );

  class EnterKeyNode extends TextKeyNode {

    /**
     * @param {Object} [options]
     */
    constructor( options ) {
      super( keyEnterString, options );
    }
  }

  return sceneryPhet.register( 'EnterKeyNode', EnterKeyNode );
} );
