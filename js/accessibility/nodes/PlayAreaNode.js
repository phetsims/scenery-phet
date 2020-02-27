// Copyright 2018-2020, University of Colorado Boulder

/**
 *
 * A node that creates a "Play Area" accessible section in the PDOM. This organizational Node should have accessible
 * content to be displayed under it in the PDOM. This content can be added as a child, or added via `accessibleOrder`.
 * Items in this section are designed to be the "main interaction and pedagogical learning" to be had for the screen.
 * See ScreenView for more documentation and usage explanation.
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import inherit from '../../../../phet-core/js/inherit.js';
import sceneryPhet from '../../sceneryPhet.js';
import SceneryPhetA11yStrings from '../../SceneryPhetA11yStrings.js';
import AccessibleSectionNode from '../AccessibleSectionNode.js';

// A11y strings
const playAreaString = SceneryPhetA11yStrings.playArea.value;

/**
 * @constructor
 * @param {Object} [options]
 */
function PlayAreaNode( options ) {
  AccessibleSectionNode.call( this, playAreaString, options );
}

sceneryPhet.register( 'PlayAreaNode', PlayAreaNode );

inherit( AccessibleSectionNode, PlayAreaNode );
export default PlayAreaNode;