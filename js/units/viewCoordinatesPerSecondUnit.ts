// Copyright 2025-2026, University of Colorado Boulder

/**
 * Unit for view-coordinates per second (view-coordinates/s)
 *
 * @author Jonathan Olson (PhET Interactive Simulations)
 */

import PhetUnit from '../PhetUnit.js';
import SceneryPhetFluent from '../SceneryPhetFluent.js';
import sceneryPhet from '../sceneryPhet.js';
import ReadOnlyProperty from '../../../axon/js/ReadOnlyProperty.js';

export const viewCoordinatesPerSecondUnit = new PhetUnit<ReadOnlyProperty<string>>( 'view-coordinates/s', {
  visualSymbolStringProperty: SceneryPhetFluent.units.viewCoordinatesPerSecond.symbolStringProperty,
  visualSymbolPatternStringProperty: SceneryPhetFluent.units.viewCoordinatesPerSecond.symbolPatternStringProperty,
  accessiblePattern: SceneryPhetFluent.a11y.units.viewCoordinatesPerSecond.pattern
} );

sceneryPhet.register( 'viewCoordinatesPerSecondUnit', viewCoordinatesPerSecondUnit );