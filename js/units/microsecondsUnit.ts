// Copyright 2026, University of Colorado Boulder

/**
 * Unit for microseconds (μs)
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import ReadOnlyProperty from '../../../axon/js/ReadOnlyProperty.js';
import PhetUnit from '../PhetUnit.js';
import SceneryPhetFluent from '../SceneryPhetFluent.js';
import sceneryPhet from '../sceneryPhet.js';

export const microsecondsUnit = new PhetUnit<ReadOnlyProperty<string>>( 'μs', {
  visualSymbolStringProperty: SceneryPhetFluent.units.microseconds.symbolStringProperty,
  visualSymbolPatternStringProperty: SceneryPhetFluent.units.microseconds.symbolPatternStringProperty,
  accessiblePattern: SceneryPhetFluent.a11y.units.microseconds.pattern
} );

sceneryPhet.register( 'microsecondsUnit', microsecondsUnit );
