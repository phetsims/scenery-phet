// Copyright 2025-2026, University of Colorado Boulder

/**
 * Unit for percent.
 *
 * @author Jonathan Olson (PhET Interactive Simulations)
 */

import ReadOnlyProperty from '../../../axon/js/ReadOnlyProperty.js';
import PhetUnit from '../PhetUnit.js';
import SceneryPhetFluent from '../SceneryPhetFluent.js';
import sceneryPhet from '../sceneryPhet.js';

export const percentUnit = new PhetUnit<ReadOnlyProperty<string>>( '%', {
  visualSymbolStringProperty: SceneryPhetFluent.units.percent.symbolStringProperty,
  visualSymbolPatternStringProperty: SceneryPhetFluent.units.percent.symbolPatternStringProperty,
  accessiblePattern: SceneryPhetFluent.a11y.units.percent.pattern
} );

sceneryPhet.register( 'percentUnit', percentUnit );