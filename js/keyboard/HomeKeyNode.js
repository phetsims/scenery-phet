// Copyright 2017-2020, University of Colorado Boulder

/**
 * Node that looks like a 'Home' key on a keyboard.
 *
 * @author Michael Barlow
 */

import inherit from '../../../phet-core/js/inherit.js';
import sceneryPhetStrings from '../scenery-phet-strings.js';
import sceneryPhet from '../sceneryPhet.js';
import TextKeyNode from './TextKeyNode.js';

const keyHomeString = sceneryPhetStrings.key.home;

/**
 * Constructor.
 *
 * @param {Object} [options]
 */
function HomeKeyNode( options ) {
  TextKeyNode.call( this, keyHomeString, options );
}

sceneryPhet.register( 'HomeKeyNode', HomeKeyNode );

inherit( TextKeyNode, HomeKeyNode );
export default HomeKeyNode;