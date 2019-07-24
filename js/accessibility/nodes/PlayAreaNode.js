// Copyright 2018, University of Colorado Boulder

/**
 *
 * A node that creates a "Play Area" accessible section in the PDOM. This organizational Node should have accessible
 * content to be displayed under it in the PDOM. This content can be added as a child, or added via `accessibleOrder`.
 * Items in this section are designed to be the "main interaction and pedagogical learning" to be had for the screen.
 * See ScreenView for more documentation and usage explanation.
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

define( function( require ) {
  'use strict';

  // modules
  var AccessibleSectionNode = require( 'SCENERY_PHET/accessibility/AccessibleSectionNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var SceneryPhetA11yStrings = require( 'SCENERY_PHET/SceneryPhetA11yStrings' );

  // A11y strings
  var playAreaString = SceneryPhetA11yStrings.playArea.value;

  /**
   * @constructor
   * @param {Object} options
   */
  function PlayAreaNode( options ) {

    // options for accessibility, but others can be passed to Node call
    options = _.extend( options );

    AccessibleSectionNode.call( this, playAreaString, options );
  }

  sceneryPhet.register( 'PlayAreaNode', PlayAreaNode );

  return inherit( AccessibleSectionNode, PlayAreaNode );
} );
