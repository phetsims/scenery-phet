// Copyright 2018-2022, University of Colorado Boulder

/**
 * Unit tests for scenery-phet. Please run once in phet brand and once in brand=phet-io to cover all functionality.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Michael Kauzmann (PhET Interactive Simulations)
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import qunitStart from '../../chipper/js/sim-tests/qunitStart.js';
import './accessibility/GrabDragInteractionTests.js';
import './ScientificNotationNodeTests.js';
import './StopwatchNodeTests.js';

// Since our tests are loaded asynchronously, we must direct QUnit to begin the tests
qunitStart();