// Copyright 2023, University of Colorado Boulder
/**
 * A demo of the Grab or Release keyboard help section.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import { SunDemoOptions } from '../../../../sun/js/demo/DemosScreenView.js';
import { Node } from '../../../../scenery/js/imports.js';
import GrabReleaseKeyboardHelpSection from '../../keyboard/help/GrabReleaseKeyboardHelpSection.js';
import StringProperty from '../../../../axon/js/StringProperty.js';


export default function demoGrabReleaseKeyboardHelpSection( layoutBounds: Bounds2, providedOptions?: SunDemoOptions ): Node {
  return new Node( {
    children: [
      new GrabReleaseKeyboardHelpSection( new StringProperty( 'Item' ), new StringProperty( 'item' ) )
    ],
    center: layoutBounds.center
  } );
}