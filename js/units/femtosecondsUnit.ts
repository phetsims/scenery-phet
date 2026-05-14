// Copyright 2026, University of Colorado Boulder

/**
 * Unit for femtoseconds (fs)
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import ReadOnlyProperty from '../../../axon/js/ReadOnlyProperty.js';
import PhetUnit from '../PhetUnit.js';
import SceneryPhetFluent from '../SceneryPhetFluent.js';
import sceneryPhet from '../sceneryPhet.js';

export const femtosecondsUnit = new PhetUnit<ReadOnlyProperty<string>>( 'fs', {
  visualSymbolStringProperty: SceneryPhetFluent.units.femtoseconds.symbolStringProperty,
  visualSymbolPatternStringProperty: SceneryPhetFluent.units.femtoseconds.symbolPatternStringProperty,
  accessiblePattern: SceneryPhetFluent.a11y.units.femtoseconds.pattern
} );

sceneryPhet.register( 'femtosecondsUnit', femtosecondsUnit );
