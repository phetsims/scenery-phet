// Copyright 2017, University of Colorado Boulder

/**
 * Node that looks like a 'Home' key on a keyboard.
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
  var keyHomeString = require( 'string!SCENERY_PHET/key.home' );

  /**
   * Constructor.
   * 
   * @param {Object} [options]
   */
  function HomeKeyNode( options ) {
    TextKeyNode.call( this, keyHomeString, options );
  }

  sceneryPhet.register( 'HomeKeyNode', HomeKeyNode );

  return inherit( TextKeyNode, HomeKeyNode );

} );
