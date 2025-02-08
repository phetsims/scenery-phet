// Copyright 2022-2025, University of Colorado Boulder

/**
 * Demo for BasicActionsKeyboardHelpSection
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import { SunDemoOptions } from '../../../../sun/js/demo/DemosScreenView.js';
import BasicActionsKeyboardHelpSection from '../../keyboard/help/BasicActionsKeyboardHelpSection.js';

export default function demoBasicActionsKeyboardHelpSection( layoutBounds: Bounds2, providedOptions?: SunDemoOptions ): Node {
  return new HBox( {
    children: [
      new BasicActionsKeyboardHelpSection(),
      new BasicActionsKeyboardHelpSection( {
        withCheckboxContent: true,
        withKeypadContent: true
      } )
    ],
    spacing: 100,
    align: 'top',
    center: layoutBounds.center
  } );
}