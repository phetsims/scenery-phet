// Copyright 2018-2020, University of Colorado Boulder

/**
 *
 * A node that creates a "Control Area" accessible section in the PDOM. This organizational Node should have accessible
 * content to be displayed under it in the PDOM. This content can be added as a child, or added via `accessibleOrder`.
 * Items in this section are designed to be secondary to that in the PlayAreaNode. See ScreenView for more documentation
 * and usage explanation.
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import inherit from '../../../../phet-core/js/inherit.js';
import sceneryPhet from '../../sceneryPhet.js';
import sceneryPhetStrings from '../../scenery-phet-strings.js';
import AccessibleSectionNode from '../AccessibleSectionNode.js';

// constants
const controlAreaString = sceneryPhetStrings.a11y.simSection.controlArea;

/**
 * @constructor
 * @param {Object} [options]
 */
function ControlAreaNode( options ) {

  AccessibleSectionNode.call( this, controlAreaString, options );
}

sceneryPhet.register( 'ControlAreaNode', ControlAreaNode );

inherit( AccessibleSectionNode, ControlAreaNode );
export default ControlAreaNode;