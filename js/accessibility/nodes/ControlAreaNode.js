// Copyright 2018, University of Colorado Boulder

/**
 *
 * A node that creates a "Play Area" accessible section in the PDOM.
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
  var controlAreaString = SceneryPhetA11yStrings.controlArea.value;

  /**
   * @constructor
   * @param {Object} [options]
   */
  function ControlAreaNode( options ) {

    AccessibleSectionNode.call( this, controlAreaString, options );
  }

  sceneryPhet.register( 'ControlAreaNode', ControlAreaNode );

  return inherit( AccessibleSectionNode, ControlAreaNode );
} );
