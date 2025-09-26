// Copyright 2025, University of Colorado Boulder

/**
 * Unit for radians per second squared (radians/s^2)
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import PhetUnit from '../PhetUnit.js';
import SceneryPhetFluent from '../SceneryPhetFluent.js';
import sceneryPhet from '../sceneryPhet.js';
import ReadOnlyProperty from '../../../axon/js/ReadOnlyProperty.js';

export const radiansPerSecondSquaredUnit = new PhetUnit<ReadOnlyProperty<string>>( 'radians/s^2', {
  visualSymbolStringProperty: SceneryPhetFluent.units.radiansPerSecondSquared.symbolStringProperty,
  visualSymbolPatternStringProperty: SceneryPhetFluent.units.radiansPerSecondSquared.symbolPatternStringProperty,
  accessiblePattern: SceneryPhetFluent.a11y.units.radiansPerSecondSquared.pattern
} );

sceneryPhet.register( 'radiansPerSecondSquaredUnit', radiansPerSecondSquaredUnit );