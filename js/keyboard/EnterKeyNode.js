// Copyright 2017, University of Colorado Boulder

/**
 * Node that looks like a 'Enter' key on a keyboard.
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
  var keyEnterString = require( 'string!SCENERY_PHET/key.enter' );

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
