// Copyright 2018-2020, University of Colorado Boulder

/**
 * Unit tests for scenery-phet. Please run once in phet brand and once in brand=phet-io to cover all functionality.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Michael Kauzmann (PhET Interactive Simulations)
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import './accessibility/GrabDragInteractionTests.js';
import './MultiLineTextTests.js';
import './StopwatchNodeTests.js';
import qunitStart from '../../chipper/js/sim-tests/qunitStart.js';

// Since our tests are loaded asynchronously, we must direct QUnit to begin the tests
qunitStart();