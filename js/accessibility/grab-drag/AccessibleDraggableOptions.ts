// Copyright 2025, University of Colorado Boulder

/**
 * Options that you should apply to a Scenery Node that is draggable with a keyboard.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import { ParallelDOMOptions } from '../../../../scenery/js/imports.js';
import SceneryPhetStrings from '../../SceneryPhetStrings.js';

// constants
const movableStringProperty = SceneryPhetStrings.a11y.grabDrag.movableStringProperty;

const AccessibleDraggableOptions: ParallelDOMOptions = {
  tagName: 'div',
  focusable: true,

  // Application role tells the screen reader to provide access to arrow keys and switch to a 'forms' mode.
  ariaRole: 'application',

  // The screen reader will call this a 'movable', which is more intuitive for the user.
  pdomAttributes: [ { attribute: 'aria-roledescription', value: movableStringProperty } ]
} as const;

export default AccessibleDraggableOptions;