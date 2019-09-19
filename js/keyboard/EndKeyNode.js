// Copyright 2017, University of Colorado Boulder

/**
 * Node that is meant to represent the 'End' key on a keyboard.
 * 
 * @author Michael Barlow
 */
define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  const TextKeyNode = require( 'SCENERY_PHET/keyboard/TextKeyNode' );

  // strings
  const keyEndString = require( 'string!SCENERY_PHET/key.end' );

  /**
   * Constructor.
   * 
   * @param {Object} [options]
   */
  function EndKeyNode( options ) {
    TextKeyNode.call( this, keyEndString, options );
  }

  sceneryPhet.register( 'EndKeyNode', EndKeyNode );

  return inherit( TextKeyNode, EndKeyNode );

} );
