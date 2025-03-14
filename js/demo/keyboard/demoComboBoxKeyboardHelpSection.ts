// Copyright 2022-2025, University of Colorado Boulder

/**
 * Demo for ComboBoxKeyboardHelpSection
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import { SunDemoOptions } from '../../../../sun/js/demo/DemosScreenView.js';
import ComboBoxKeyboardHelpSection from '../../keyboard/help/ComboBoxKeyboardHelpSection.js';

export default function demoComboBoxKeyboardHelpSection( layoutBounds: Bounds2, providedOptions?: SunDemoOptions ): Node {
  return new ComboBoxKeyboardHelpSection( {
    center: layoutBounds.center
  } );
}