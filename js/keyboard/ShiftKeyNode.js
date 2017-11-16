// Copyright 2017, University of Colorado Boulder

/**
 * Node that looks like a 'Shift' key on a keyboard.
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
  var keyShiftString = require( 'string!SCENERY_PHET/key.shift' );

  /**
   * Constructor.
   * 
   * @param {Object} [options]
   */
  function ShiftKeyNode( options ) {
    TextKeyNode.call( this, keyShiftString, options );
  }

  sceneryPhet.register( 'ShiftKeyNode', ShiftKeyNode );

  return inherit( TextKeyNode, ShiftKeyNode );

} );
