// Copyright 2017-2018, University of Colorado Boulder

/**
 * Node that looks like a 'function' key on a keyboard.  By default, the function key is
 * more rectangular than a letter key, and the text content is aligned
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
  var keyFnString = require( 'string!SCENERY_PHET/key.fn' );

  /**
   * Constructor.
   * 
   * @param {Object} [options]
   */
  function FunctionKeyNode( options ) {

    options = _.extend( {
      minKeyWidth: 75, // in ScreenView coordinates, function key is usually longer than other keys
      maxKeyWidth: 75
    }, options );

    TextKeyNode.call( this, keyFnString, options );
  }

  sceneryPhet.register( 'FunctionKeyNode', FunctionKeyNode );

  return inherit( TextKeyNode, FunctionKeyNode );

} );
