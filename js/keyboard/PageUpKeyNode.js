// Copyright 2017, University of Colorado Boulder

/**
 * Node that looks like a 'Page Up' key on a keyboard.
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
  var pageUpString = require( 'string!SCENERY_PHET/pageUp' );

  /**
   * Constructor.
   * 
   * @param {Object} [options]
   */
  function PageUpKeyNode( options ) {
    TextKeyNode.call( this, pageUpString, options );
  }

  sceneryPhet.register( 'PageUpKeyNode', PageUpKeyNode );

  return inherit( TextKeyNode, PageUpKeyNode );

} );
