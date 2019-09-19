// Copyright 2017, University of Colorado Boulder

/**
 * Node that looks like an 'Esc' key on a keyboard.
 * 
 * @author Jesse Greenberg
 */

define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  const TextKeyNode = require( 'SCENERY_PHET/keyboard/TextKeyNode' );

  // strings
  const keyEscString = require( 'string!SCENERY_PHET/key.esc' );

  /**
   * Constructor.
   * 
   * @param {Object} [options]
   */
  function EscapeKeyNode( options ) {
    TextKeyNode.call( this, keyEscString, options );
  }

  sceneryPhet.register( 'EscapeKeyNode', EscapeKeyNode );

  return inherit( TextKeyNode, EscapeKeyNode );

} );
