// Copyright 2025, University of Colorado Boulder

/**
 * Unit for kilogram-meters per second (kg·m/s)
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import PhetUnit from '../PhetUnit.js';
import SceneryPhetFluent from '../SceneryPhetFluent.js';
import sceneryPhet from '../sceneryPhet.js';
import ReadOnlyProperty from '../../../axon/js/ReadOnlyProperty.js';

export const kilogramMetersPerSecondUnit = new PhetUnit<ReadOnlyProperty<string>>( 'kg·m/s', {
  visualSymbolStringProperty: SceneryPhetFluent.units.kilogramMetersPerSecond.symbolStringProperty,
  visualSymbolPatternStringProperty: SceneryPhetFluent.units.kilogramMetersPerSecond.symbolPatternStringProperty,
  accessiblePattern: SceneryPhetFluent.a11y.units.kilogramMetersPerSecond.pattern
} );

sceneryPhet.register( 'kilogramMetersPerSecondUnit', kilogramMetersPerSecondUnit );