// Copyright 2017-2019, University of Colorado Boulder

/**
 * Node that looks like an 'Esc' key on a keyboard.
 *
 * @author Jesse Greenberg
 */

define( require => {
  'use strict';

  // modules
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  const TextKeyNode = require( 'SCENERY_PHET/keyboard/TextKeyNode' );

  // strings
  const keyEscString = require( 'string!SCENERY_PHET/key.esc' );

  /**
   * Constructor.
   *
   */
  class EscapeKeyNode extends TextKeyNode {

    /**
     * @param {Object} [options]
     */
    constructor( options ) {
      super( keyEscString, options );
    }
  }

  return sceneryPhet.register( 'EscapeKeyNode', EscapeKeyNode );
} );
