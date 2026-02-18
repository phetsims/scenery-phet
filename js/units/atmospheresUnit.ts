// Copyright 2025-2026, University of Colorado Boulder

/**
 * Unit for atmospheres (atm)
 *
 * @author Jonathan Olson (PhET Interactive Simulations)
 */

import PhetUnit from '../PhetUnit.js';
import SceneryPhetFluent from '../SceneryPhetFluent.js';
import sceneryPhet from '../sceneryPhet.js';
import ReadOnlyProperty from '../../../axon/js/ReadOnlyProperty.js';

export const atmospheresUnit = new PhetUnit<ReadOnlyProperty<string>>( 'atm', {
  visualSymbolStringProperty: SceneryPhetFluent.units.atmospheres.symbolStringProperty,
  visualSymbolPatternStringProperty: SceneryPhetFluent.units.atmospheres.symbolPatternStringProperty,
  accessiblePattern: SceneryPhetFluent.a11y.units.atmospheres.pattern
} );

sceneryPhet.register( 'atmospheresUnit', atmospheresUnit );