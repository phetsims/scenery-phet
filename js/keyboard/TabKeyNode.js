// Copyright 2017-2019, University of Colorado Boulder

/**
 * Node that looks like a 'Tab' key on a keyboard.
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
  const keyTabString = require( 'string!SCENERY_PHET/key.tab' );

  /**
   * Constructor.
   * 
   * @param {Object} [options]
   */
  function TabKeyNode( options ) {
    TextKeyNode.call( this, keyTabString, options );
  }

  sceneryPhet.register( 'TabKeyNode', TabKeyNode );

  return inherit( TextKeyNode, TabKeyNode );

} );
