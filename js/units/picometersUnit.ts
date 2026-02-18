// Copyright 2025-2026, University of Colorado Boulder

/**
 * Unit for picometers (pm)
 *
 * @author Jonathan Olson (PhET Interactive Simulations)
 */

import PhetUnit from '../PhetUnit.js';
import SceneryPhetFluent from '../SceneryPhetFluent.js';
import sceneryPhet from '../sceneryPhet.js';
import ReadOnlyProperty from '../../../axon/js/ReadOnlyProperty.js';

export const picometersUnit = new PhetUnit<ReadOnlyProperty<string>>( 'pm', {
  visualSymbolStringProperty: SceneryPhetFluent.units.picometers.symbolStringProperty,
  visualSymbolPatternStringProperty: SceneryPhetFluent.units.picometers.symbolPatternStringProperty,
  accessiblePattern: SceneryPhetFluent.a11y.units.picometers.pattern
} );

sceneryPhet.register( 'picometersUnit', picometersUnit );