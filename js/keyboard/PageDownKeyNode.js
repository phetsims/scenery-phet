// Copyright 2017-2019, University of Colorado Boulder

/**
 * Node that looks like a 'Page Down' key on a keyboard.
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
  const keyPageDownString = require( 'string!SCENERY_PHET/key.pageDown' );

  /**
   * Constructor.
   * 
   * @param {Object} [options]
   */
  function PageDownKeyNode( options ) {
    TextKeyNode.call( this, keyPageDownString, options );
  }

  sceneryPhet.register( 'PageDownKeyNode', PageDownKeyNode );

  return inherit( TextKeyNode, PageDownKeyNode );

} );
