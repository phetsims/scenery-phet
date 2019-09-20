// Copyright 2017-2019, University of Colorado Boulder

/**
 * Node that looks like a 'function' key on a keyboard.  By default, the function key is
 * more rectangular than a letter key, and the text content is aligned
 * in the left top corner.
 * 
 * @author Michael Barlow
 */

define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  const TextKeyNode = require( 'SCENERY_PHET/keyboard/TextKeyNode' );

  // strings (a11y strings are not translatable yet, see SceneryPhetA11yStrings for more details)
  const keyFnString = require( 'string!SCENERY_PHET/key.fn' );

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
