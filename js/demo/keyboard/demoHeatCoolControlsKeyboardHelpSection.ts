// Copyright 2024-2025, University of Colorado Boulder

/**
 * Demo for HeatCoolControlsKeyboardHelpSection.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import HeatCoolControlsKeyboardHelpSection from '../../keyboard/help/HeatCoolControlsKeyboardHelpSection.js';

export default function demoHeatCoolControlsKeyboardHelpSection( layoutBounds: Bounds2 ): Node {
  const section = new HeatCoolControlsKeyboardHelpSection();
  section.center = layoutBounds.center;
  return section;
}