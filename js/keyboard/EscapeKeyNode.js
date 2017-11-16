// Copyright 2017, University of Colorado Boulder

/**
 * Node that looks like an 'Esc' key on a keyboard.
 * 
 * @author Jesse Greenberg
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var TextKeyNode = require( 'SCENERY_PHET/keyboard/TextKeyNode' );

  // strings
  var keyEscString = require( 'string!SCENERY_PHET/key.esc' );

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
