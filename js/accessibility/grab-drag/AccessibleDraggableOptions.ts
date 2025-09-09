// Copyright 2025, University of Colorado Boulder

/**
 * Options that you should apply to a Scenery Node that is draggable with a keyboard.
 * Applies ParallelDOM options that make the Node focusable, ensures that the accessible name
 * is read correctly, and forces the screen reader to send all keyboard events.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import { combineOptions } from '../../../../phet-core/js/optionize.js';
import { ParallelDOMOptions } from '../../../../scenery/js/accessibility/pdom/ParallelDOM.js';
import SceneryPhetStrings from '../../SceneryPhetStrings.js';
import AccessibleInteractiveOptions from '../AccessibleInteractiveOptions.js';

// constants
const movableStringProperty = SceneryPhetStrings.a11y.grabDrag.movableStringProperty;

const AccessibleDraggableOptions: ParallelDOMOptions = combineOptions<ParallelDOMOptions>(
  {},
  AccessibleInteractiveOptions,
  {

    // The screen reader will call this a 'movable', which is more intuitive for the user.
    accessibleRoleDescription: movableStringProperty
  }
);

export default AccessibleDraggableOptions;