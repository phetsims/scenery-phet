// Copyright 2024-2025, University of Colorado Boulder

/**
 * A demo of the Grab or Release keyboard help section.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 */

import StringProperty from '../../../../axon/js/StringProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import GrabReleaseKeyboardHelpSection from '../../keyboard/help/GrabReleaseKeyboardHelpSection.js';

export default function demoGrabReleaseKeyboardHelpSection( layoutBounds: Bounds2 ): Node {
  return new Node( {
    children: [
      new GrabReleaseKeyboardHelpSection( new StringProperty( 'Item' ), new StringProperty( 'item' ) )
    ],
    center: layoutBounds.center
  } );
}