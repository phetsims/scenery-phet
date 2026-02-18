// Copyright 2025-2026, University of Colorado Boulder

/**
 * Unit for picometers per second (pm/s)
 *
 * @author Jonathan Olson (PhET Interactive Simulations)
 */

import PhetUnit from '../PhetUnit.js';
import SceneryPhetFluent from '../SceneryPhetFluent.js';
import sceneryPhet from '../sceneryPhet.js';
import ReadOnlyProperty from '../../../axon/js/ReadOnlyProperty.js';

export const picometersPerSecondUnit = new PhetUnit<ReadOnlyProperty<string>>( 'pm/s', {
  visualSymbolStringProperty: SceneryPhetFluent.units.picometersPerSecond.symbolStringProperty,
  visualSymbolPatternStringProperty: SceneryPhetFluent.units.picometersPerSecond.symbolPatternStringProperty,
  accessiblePattern: SceneryPhetFluent.a11y.units.picometersPerSecond.pattern
} );

sceneryPhet.register( 'picometersPerSecondUnit', picometersPerSecondUnit );