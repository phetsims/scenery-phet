// Copyright 2017, University of Colorado Boulder

/**
 * Node that looks like a 'Shift' key on a keyboard.  By default, the shift key is
 * more rectangular than a letter key, and the text content is aligned
 * in the left top corner.
 * 
 * @author Jesse Greenberg
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var TextKeyNode = require( 'SCENERY_PHET/keyboard/TextKeyNode' );
  var SceneryPhetA11yStrings = require( 'SCENERY_PHET/SceneryPhetA11yStrings' );

  // strings (a11y strings are not translatable yet, see SceneryPhetA11yStrings for more details)
  var shiftString = SceneryPhetA11yStrings.shiftString;

  /**
   * Constructor.
   * 
   * @param {Object} [options]
   */
  function ShiftKeyNode( options ) {
    // Tandem.indicateUninstrumentedCode();  // see https://github.com/phetsims/phet-io/issues/986

    options = _.extend( {
      minKeyWidth: 75, // in ScreenView coordinates, shift key is usually longer than other keys
      maxKeyWidth: 75,
    }, options );

    TextKeyNode.call( this, shiftString, options );
  }

  sceneryPhet.register( 'ShiftKeyNode', ShiftKeyNode );

  return inherit( TextKeyNode, ShiftKeyNode );

} );
