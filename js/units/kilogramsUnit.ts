// Copyright 2025, University of Colorado Boulder

/**
 * Unit for kilograms (kg)
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import PhetUnit from '../PhetUnit.js';
import SceneryPhetFluent from '../SceneryPhetFluent.js';
import sceneryPhet from '../sceneryPhet.js';
import ReadOnlyProperty from '../../../axon/js/ReadOnlyProperty.js';

export const kilogramsUnit = new PhetUnit<ReadOnlyProperty<string>>( 'kg', {
  visualSymbolStringProperty: SceneryPhetFluent.units.kilograms.symbolStringProperty,
  visualSymbolPatternStringProperty: SceneryPhetFluent.units.kilograms.symbolPatternStringProperty,
  accessiblePattern: SceneryPhetFluent.a11y.units.kilograms.pattern
} );

sceneryPhet.register( 'kilogramsUnit', kilogramsUnit );