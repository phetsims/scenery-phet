// Copyright 2025-2026, University of Colorado Boulder

/**
 * Unit for cubic picometers (pm^3)
 *
 * @author Jonathan Olson (PhET Interactive Simulations)
 */

import PhetUnit from '../PhetUnit.js';
import SceneryPhetFluent from '../SceneryPhetFluent.js';
import sceneryPhet from '../sceneryPhet.js';
import ReadOnlyProperty from '../../../axon/js/ReadOnlyProperty.js';

export const cubicPicometersUnit = new PhetUnit<ReadOnlyProperty<string>>( 'pm^3', {
  visualSymbolStringProperty: SceneryPhetFluent.units.cubicPicometers.symbolStringProperty,
  visualSymbolPatternStringProperty: SceneryPhetFluent.units.cubicPicometers.symbolPatternStringProperty,
  accessiblePattern: SceneryPhetFluent.a11y.units.cubicPicometers.pattern
} );

sceneryPhet.register( 'cubicPicometersUnit', cubicPicometersUnit );