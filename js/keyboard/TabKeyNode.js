// Copyright 2017, University of Colorado Boulder

/**
 * Node that looks like a 'Tab' key on a keyboard.
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
  var tabString = require( 'string!SCENERY_PHET/tab' );

  /**
   * Constructor.
   * 
   * @param {Object} [options]
   */
  function TabKeyNode( options ) {
    TextKeyNode.call( this, tabString, options );
  }

  sceneryPhet.register( 'TabKeyNode', TabKeyNode );

  return inherit( TextKeyNode, TabKeyNode );

} );
