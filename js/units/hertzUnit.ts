// Copyright 2025-2026, University of Colorado Boulder

/**
 * Unit for hertz.
 *
 * @author Jonathan Olson (PhET Interactive Simulations)
 */

import PhetUnit from '../PhetUnit.js';
import SceneryPhetFluent from '../SceneryPhetFluent.js';
import sceneryPhet from '../sceneryPhet.js';
import ReadOnlyProperty from '../../../axon/js/ReadOnlyProperty.js';

export const hertzUnit = new PhetUnit<ReadOnlyProperty<string>>( 'Hz', {
  visualSymbolStringProperty: SceneryPhetFluent.units.hertz.symbolStringProperty,
  visualSymbolPatternStringProperty: SceneryPhetFluent.units.hertz.symbolPatternStringProperty,
  accessiblePattern: SceneryPhetFluent.a11y.units.hertz.pattern
} );

sceneryPhet.register( 'hertzUnit', hertzUnit );