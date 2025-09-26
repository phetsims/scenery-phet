// Copyright 2025, University of Colorado Boulder

/**
 * Unit for kilograms per cubic meter (kg/m^3)
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import PhetUnit from '../PhetUnit.js';
import SceneryPhetFluent from '../SceneryPhetFluent.js';
import sceneryPhet from '../sceneryPhet.js';
import ReadOnlyProperty from '../../../axon/js/ReadOnlyProperty.js';

export const kilogramsPerCubicMeterUnit = new PhetUnit<ReadOnlyProperty<string>>( 'kg/m^3', {
  visualSymbolStringProperty: SceneryPhetFluent.units.kilogramsPerCubicMeter.symbolStringProperty,
  visualSymbolPatternStringProperty: SceneryPhetFluent.units.kilogramsPerCubicMeter.symbolPatternStringProperty,
  accessiblePattern: SceneryPhetFluent.a11y.units.kilogramsPerCubicMeter.pattern
} );

sceneryPhet.register( 'kilogramsPerCubicMeterUnit', kilogramsPerCubicMeterUnit );