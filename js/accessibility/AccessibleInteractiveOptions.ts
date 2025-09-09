// Copyright 2025, University of Colorado Boulder

/**
 * Options that you should apply to a Scenery Node that implements a custom interaction with the keyboard
 * and for accessibility. Applies ParallelDOM options that make the Node focusable, ensures
 * that the accessible name is read correctly, and forces the screen reader to send all keyboard events.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import { ParallelDOMOptions, PDOMValueType } from '../../../scenery/js/accessibility/pdom/ParallelDOM.js';
import Node from '../../../scenery/js/nodes/Node.js';

const AccessibleInteractiveOptions: ParallelDOMOptions = {
  tagName: 'div',
  focusable: true,

  // Application role tells the screen reader to provide access to arrow keys and switch to a 'forms' mode.
  ariaRole: 'application',

  // Use aria-label to enforce the accessible name. The application role can prevent the inner content from
  // being used as the accessible name on some platforms. On the other hand, VoiceOver requires innerContent to be set
  // for the component to be focusable and read correctly.
  accessibleNameBehavior: ( node: Node, options: ParallelDOMOptions, accessibleName: PDOMValueType ): ParallelDOMOptions => {
    options.ariaLabel = accessibleName;
    options.innerContent = accessibleName;

    return options;
  },

  // So that you can drag and drop this component on screen readers on mobile devices.
  positionInPDOM: true
} as const;

export default AccessibleInteractiveOptions;