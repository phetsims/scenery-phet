// Copyright 2025, University of Colorado Boulder

/**
 * Options that you should apply to a Scenery Node that is draggable with a keyboard.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import { ParallelDOMOptions, PDOMValueType } from '../../../../scenery/js/accessibility/pdom/ParallelDOM.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import SceneryPhetStrings from '../../SceneryPhetStrings.js';

// constants
const movableStringProperty = SceneryPhetStrings.a11y.grabDrag.movableStringProperty;

const AccessibleDraggableOptions: ParallelDOMOptions = {
  tagName: 'div',
  focusable: true,

  // Application role tells the screen reader to provide access to arrow keys and switch to a 'forms' mode.
  ariaRole: 'application',

  // Use aria-label to enforce the accessible name. The application role can prevent the inner content from
  // being used as the accessible name on some platforms.
  accessibleNameBehavior: ( node: Node, options: ParallelDOMOptions, accessibleName: PDOMValueType ): ParallelDOMOptions => {
    options.ariaLabel = accessibleName;
    options.innerContent = accessibleName;

    return options;
  },

  // So that you can drag and drop this component on screen readers on mobile devices.
  positionInPDOM: true,

  // The screen reader will call this a 'movable', which is more intuitive for the user.
  accessibleRoleDescription: movableStringProperty
} as const;

export default AccessibleDraggableOptions;