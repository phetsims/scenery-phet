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
  var capsLockString = require( 'string!SCENERY_PHET/capsLock' );

  /**
   * Constructor.
   * 
   * @param {Object} [options]
   */
  function CapsLockKeyNode( options ) {

    options = _.extend( {
      minKeyWidth: 60, // in ScreenView coordinates
      maxKeyWidth: 60
    }, options );

    TextKeyNode.call( this, capsLockString, options );
  }

  sceneryPhet.register( 'CapsLockKeyNode', CapsLockKeyNode );

  return inherit( TextKeyNode, CapsLockKeyNode );

} );
