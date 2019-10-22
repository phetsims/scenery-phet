// Copyright 2018-2019, University of Colorado Boulder

/**
 * Unit tests for scenery-phet. Please run once in phet brand and once in brand=phet-io to cover all functionality.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Michael Kauzmann (PhET Interactive Simulations)
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  require( 'SCENERY_PHET/accessibility/GrabDragInteractionTests' );
  require( 'SCENERY_PHET/MultiLineTextTests' );

  // Since our tests are loaded asynchronously, we must direct QUnit to begin the tests
  QUnit.start();
} );