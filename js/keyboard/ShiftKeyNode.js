// Copyright 2017-2019, University of Colorado Boulder

/**
 * Node that looks like a 'Shift' key on a keyboard.
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
  const keyShiftString = require( 'string!SCENERY_PHET/key.shift' );

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
