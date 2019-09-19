// Copyright 2017, University of Colorado Boulder

/**
 * Node that represents a 'Space' key on a keyboard.
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
  const keySpaceString = require( 'string!SCENERY_PHET/key.space' );

  /**
   * Constructor.
   * 
   * @param {Object} [options]
   */
  function SpaceKeyNode( options ) {
    TextKeyNode.call( this, keySpaceString, options );
  }

  sceneryPhet.register( 'SpaceKeyNode', SpaceKeyNode );

  return inherit( TextKeyNode, SpaceKeyNode );

} );
