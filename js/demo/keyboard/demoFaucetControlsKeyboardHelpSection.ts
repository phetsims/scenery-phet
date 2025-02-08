// Copyright 2024-2025, University of Colorado Boulder

/**
 * Demo for FaucetControlsKeyboardHelpSection.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import { SunDemoOptions } from '../../../../sun/js/demo/DemosScreenView.js';
import FaucetControlsKeyboardHelpSection from '../../keyboard/help/FaucetControlsKeyboardHelpSection.js';

export default function demoFaucetControlsKeyboardHelpSection( layoutBounds: Bounds2, providedOptions?: SunDemoOptions ): Node {
  return new HBox( {
    children: [
      new FaucetControlsKeyboardHelpSection(),
      new FaucetControlsKeyboardHelpSection( {
        tapToDispenseEnabled: true // use this option if your FaucetNode has tapToDispenseEnabled: true
      } )
    ],
    spacing: 100,
    align: 'top',
    center: layoutBounds.center
  } );
}