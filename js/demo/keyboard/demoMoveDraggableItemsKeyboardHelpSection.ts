// Copyright 2026, University of Colorado Boulder

/**
 * Demo for MoveDraggableItemsKeyboardHelpSection.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import MoveDraggableItemsKeyboardHelpSection from '../../keyboard/help/MoveDraggableItemsKeyboardHelpSection.js';

export default function demoMoveDraggableItemsKeyboardHelpSection( layoutBounds: Bounds2 ): Node {
  const section = new MoveDraggableItemsKeyboardHelpSection();
  section.center = layoutBounds.center;
  return section;
}