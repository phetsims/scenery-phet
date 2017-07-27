// Copyright 2017, University of Colorado Boulder

/**
 * Node that looks like a 'Home' key on a keyboard.  By default, the Home key is
 * square, and the text content is aligned
 * in the left top corner.
 * 
 * @author Michael Barlow
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var TextKeyNode = require( 'SCENERY_PHET/keyboard/TextKeyNode' );

  // strings (a11y strings are not translatable yet, see SceneryPhetA11yStrings for more details)
  var homeString = require( 'string!SCENERY_PHET/home' );

  /**
   * Constructor.
   * 
   * @param {Object} [options]
   */
  function HomeKeyNode( options ) {

    // options = _.extend( {
    //   minKeyWidth: 75, // in ScreenView coordinates, function key is usually longer than other keys
    //   maxKeyWidth: 75,
    // }, options );

    TextKeyNode.call( this, homeString, options );
  }

  sceneryPhet.register( 'HomeKeyNode', HomeKeyNode );

  return inherit( TextKeyNode, HomeKeyNode );

} );
