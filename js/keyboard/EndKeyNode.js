// Copyright 2017, University of Colorado Boulder

/**
 * Node that is meant to represent the 'End' key on a keyboard.
 * 
 * @author Michael Barlow
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var TextKeyNode = require( 'SCENERY_PHET/keyboard/TextKeyNode' );

  // strings
  var keyEndString = require( 'string!SCENERY_PHET/key.end' );

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
