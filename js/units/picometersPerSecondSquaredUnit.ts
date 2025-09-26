// Copyright 2025, University of Colorado Boulder

/**
 * Unit for picometers per second squared (pm/s^2)
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import PhetUnit from '../PhetUnit.js';
import SceneryPhetFluent from '../SceneryPhetFluent.js';
import sceneryPhet from '../sceneryPhet.js';
import ReadOnlyProperty from '../../../axon/js/ReadOnlyProperty.js';

export const picometersPerSecondSquaredUnit = new PhetUnit<ReadOnlyProperty<string>>( 'pm/s^2', {
  visualSymbolStringProperty: SceneryPhetFluent.units.picometersPerSecondSquared.symbolStringProperty,
  visualSymbolPatternStringProperty: SceneryPhetFluent.units.picometersPerSecondSquared.symbolPatternStringProperty,
  accessiblePattern: SceneryPhetFluent.a11y.units.picometersPerSecondSquared.pattern
} );

sceneryPhet.register( 'picometersPerSecondSquaredUnit', picometersPerSecondSquaredUnit );