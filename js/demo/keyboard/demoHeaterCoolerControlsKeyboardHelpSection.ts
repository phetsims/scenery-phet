// Copyright 2024, University of Colorado Boulder

/**
 * Demo for HeaterCoolerControlsKeyboardHelpSection.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import { Node } from '../../../../scenery/js/imports.js';
import HeaterCoolerControlsKeyboardHelpSection from '../../keyboard/help/HeaterCoolerControlsKeyboardHelpSection.js';

export default function demoHeaterCoolerControlsKeyboardHelpSection( layoutBounds: Bounds2 ): Node {
  const section = new HeaterCoolerControlsKeyboardHelpSection();
  section.center = layoutBounds.center;
  return section;
}