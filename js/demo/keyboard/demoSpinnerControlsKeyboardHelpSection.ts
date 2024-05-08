// Copyright 2024, University of Colorado Boulder

/**
 * Demo for SpinnerControlsKeyboardHelpSection.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import { Node } from '../../../../scenery/js/imports.js';
import SpinnerControlsKeyboardHelpSection from '../../keyboard/help/SpinnerControlsKeyboardHelpSection.js';

export default function demoSpinnerControlsKeyboardHelpSection( layoutBounds: Bounds2 ): Node {
  const spinnerSection = new SpinnerControlsKeyboardHelpSection();
  spinnerSection.center = layoutBounds.center;
  return spinnerSection;
}