// Copyright 2017-2019, University of Colorado Boulder

/**
 * Node that looks like a 'Home' key on a keyboard.
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
  const keyHomeString = require( 'string!SCENERY_PHET/key.home' );

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
