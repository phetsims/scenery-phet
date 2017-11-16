// Copyright 2017, University of Colorado Boulder

/**
 * Node that looks like a 'Caps Lock' key on a keyboard.  By default, the tab key is
 * more rectangular than a letter key, and the text content is aligned
 * in the left top corner.
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
  var keyCapsLockString = require( 'string!SCENERY_PHET/key.capsLock' );

  /**
   * Constructor.
   * 
   * @param {Object} [options]
   */
  function CapsLockKeyNode( options ) {
    TextKeyNode.call( this, keyCapsLockString, options );
  }

  sceneryPhet.register( 'CapsLockKeyNode', CapsLockKeyNode );

  return inherit( TextKeyNode, CapsLockKeyNode );

} );
