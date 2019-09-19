// Copyright 2017, University of Colorado Boulder

/**
 * Node that looks like a 'Enter' key on a keyboard.
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
  const keyEnterString = require( 'string!SCENERY_PHET/key.enter' );

  /**
   * Constructor.
   * 
   * @param {Object} [options]
   */
  function EnterKeyNode( options ) {
    TextKeyNode.call( this, keyEnterString, options );
  }

  sceneryPhet.register( 'EnterKeyNode', EnterKeyNode );

  return inherit( TextKeyNode, EnterKeyNode );

} );
