// Copyright 2025-2026, University of Colorado Boulder

/**
 * Unit for particles per picosecond (particles/ps)
 *
 * @author Jonathan Olson (PhET Interactive Simulations)
 */

import PhetUnit from '../PhetUnit.js';
import SceneryPhetFluent from '../SceneryPhetFluent.js';
import sceneryPhet from '../sceneryPhet.js';
import ReadOnlyProperty from '../../../axon/js/ReadOnlyProperty.js';

export const particlesPerPicosecondUnit = new PhetUnit<ReadOnlyProperty<string>>( 'particles/ps', {
  visualSymbolStringProperty: SceneryPhetFluent.units.particlesPerPicosecond.symbolStringProperty,
  visualSymbolPatternStringProperty: SceneryPhetFluent.units.particlesPerPicosecond.symbolPatternStringProperty,
  accessiblePattern: SceneryPhetFluent.a11y.units.particlesPerPicosecond.pattern
} );

sceneryPhet.register( 'particlesPerPicosecondUnit', particlesPerPicosecondUnit );