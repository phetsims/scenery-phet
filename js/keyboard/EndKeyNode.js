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
  var endString = require( 'string!SCENERY_PHET/end' );

  /**
   * Constructor.
   * 
   * @param {Object} [options]
   */
  function EndKeyNode( options ) {
    TextKeyNode.call( this, endString, options );
  }

  sceneryPhet.register( 'EndKeyNode', EndKeyNode );

  return inherit( TextKeyNode, EndKeyNode );

} );
