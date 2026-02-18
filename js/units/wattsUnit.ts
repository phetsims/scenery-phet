// Copyright 2025-2026, University of Colorado Boulder

/**
 * Unit for watts (W)
 *
 * @author Jonathan Olson (PhET Interactive Simulations)
 */

import PhetUnit from '../PhetUnit.js';
import SceneryPhetFluent from '../SceneryPhetFluent.js';
import sceneryPhet from '../sceneryPhet.js';
import ReadOnlyProperty from '../../../axon/js/ReadOnlyProperty.js';

export const wattsUnit = new PhetUnit<ReadOnlyProperty<string>>( 'W', {
  visualSymbolStringProperty: SceneryPhetFluent.units.watts.symbolStringProperty,
  visualSymbolPatternStringProperty: SceneryPhetFluent.units.watts.symbolPatternStringProperty,
  accessiblePattern: SceneryPhetFluent.a11y.units.watts.pattern
} );

sceneryPhet.register( 'wattsUnit', wattsUnit );