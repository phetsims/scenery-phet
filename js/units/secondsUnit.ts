// Copyright 2025-2026, University of Colorado Boulder

/**
 * Unit for seconds.
 *
 * @author Jonathan Olson (PhET Interactive Simulations)
 */

import PhetUnit from '../PhetUnit.js';
import SceneryPhetFluent from '../SceneryPhetFluent.js';
import sceneryPhet from '../sceneryPhet.js';
import ReadOnlyProperty from '../../../axon/js/ReadOnlyProperty.js';

export const secondsUnit = new PhetUnit<ReadOnlyProperty<string>>( 's', {
  visualSymbolStringProperty: SceneryPhetFluent.units.seconds.symbolStringProperty,
  visualSymbolPatternStringProperty: SceneryPhetFluent.units.seconds.symbolPatternStringProperty,
  accessiblePattern: SceneryPhetFluent.a11y.units.seconds.pattern
} );

sceneryPhet.register( 'secondsUnit', secondsUnit );