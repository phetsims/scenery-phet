// Copyright 2026, University of Colorado Boulder

/**
 * Unit for photons per second (photons/s)
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import PhetUnit from '../PhetUnit.js';
import SceneryPhetFluent from '../SceneryPhetFluent.js';
import sceneryPhet from '../sceneryPhet.js';
import ReadOnlyProperty from '../../../axon/js/ReadOnlyProperty.js';

export const photonsPerSecondUnit = new PhetUnit<ReadOnlyProperty<string>>( 'photons/s', {
  visualSymbolStringProperty: SceneryPhetFluent.units.photonsPerSecond.symbolStringProperty,
  visualSymbolPatternStringProperty: SceneryPhetFluent.units.photonsPerSecond.symbolPatternStringProperty,
  accessiblePattern: SceneryPhetFluent.a11y.units.photonsPerSecond.pattern
} );

sceneryPhet.register( 'photonsPerSecondUnit', photonsPerSecondUnit );
