// Copyright 2017, University of Colorado Boulder

/**
 * Node that looks like a 'Page Down' key on a keyboard.
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
  var pageDownString = require( 'string!SCENERY_PHET/pageDown' );

  /**
   * Constructor.
   * 
   * @param {Object} [options]
   */
  function PageDownKeyNode( options ) {
    TextKeyNode.call( this, pageDownString, options );
  }

  sceneryPhet.register( 'PageDownKeyNode', PageDownKeyNode );

  return inherit( TextKeyNode, PageDownKeyNode );

} );
