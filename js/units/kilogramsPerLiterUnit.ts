// Copyright 2025, University of Colorado Boulder

/**
 * Unit for kilograms per liter (kg/L)
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import PhetUnit from '../PhetUnit.js';
import SceneryPhetFluent from '../SceneryPhetFluent.js';
import sceneryPhet from '../sceneryPhet.js';
import ReadOnlyProperty from '../../../axon/js/ReadOnlyProperty.js';

export const kilogramsPerLiterUnit = new PhetUnit<ReadOnlyProperty<string>>( 'kg/L', {
  visualSymbolStringProperty: SceneryPhetFluent.units.kilogramsPerLiter.symbolStringProperty,
  visualSymbolPatternStringProperty: SceneryPhetFluent.units.kilogramsPerLiter.symbolPatternStringProperty,
  accessiblePattern: SceneryPhetFluent.a11y.units.kilogramsPerLiter.pattern
} );

sceneryPhet.register( 'kilogramsPerLiterUnit', kilogramsPerLiterUnit );