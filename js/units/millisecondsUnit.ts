// Copyright 2026, University of Colorado Boulder

/**
 * Unit for milliseconds (ms)
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import ReadOnlyProperty from '../../../axon/js/ReadOnlyProperty.js';
import PhetUnit from '../PhetUnit.js';
import SceneryPhetFluent from '../SceneryPhetFluent.js';
import sceneryPhet from '../sceneryPhet.js';

export const millisecondsUnit = new PhetUnit<ReadOnlyProperty<string>>( 'ms', {
  visualSymbolStringProperty: SceneryPhetFluent.units.milliseconds.symbolStringProperty,
  visualSymbolPatternStringProperty: SceneryPhetFluent.units.milliseconds.symbolPatternStringProperty,
  accessiblePattern: SceneryPhetFluent.a11y.units.milliseconds.pattern
} );

sceneryPhet.register( 'millisecondsUnit', millisecondsUnit );
