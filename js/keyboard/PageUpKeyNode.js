// Copyright 2017-2019, University of Colorado Boulder

/**
 * Node that looks like a 'Page Up' key on a keyboard.
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
  const keyPageUpString = require( 'string!SCENERY_PHET/key.pageUp' );

  /**
   * Constructor.
   * 
   * @param {Object} [options]
   */
  function PageUpKeyNode( options ) {
    TextKeyNode.call( this, keyPageUpString, options );
  }

  sceneryPhet.register( 'PageUpKeyNode', PageUpKeyNode );

  return inherit( TextKeyNode, PageUpKeyNode );

} );
