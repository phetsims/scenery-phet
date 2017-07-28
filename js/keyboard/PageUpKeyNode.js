// Copyright 2017, University of Colorado Boulder

/**
 * Node that looks like a 'Page Up' key on a keyboard.  By default, the Page Up key is
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
  var pageUpString = require( 'string!SCENERY_PHET/pageUp' );

  /**
   * Constructor.
   * 
   * @param {Object} [options]
   */
  function PageUpKeyNode( options ) {

    // options = _.extend( {
    //   minKeyWidth: 75, // in ScreenView coordinates, function key is usually longer than other keys
    //   maxKeyWidth: 75,
    // }, options );

    TextKeyNode.call( this, pageUpString, options );
  }

  sceneryPhet.register( 'PageUpKeyNode', PageUpKeyNode );

  return inherit( TextKeyNode, PageUpKeyNode );

} );
