// Copyright 2017, University of Colorado Boulder

/**
 * Node that represents a 'Space' key on a keyboard.
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
  var keySpaceString = require( 'string!SCENERY_PHET/key.space' );

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
