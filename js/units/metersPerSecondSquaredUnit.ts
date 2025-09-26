// Copyright 2025, University of Colorado Boulder

/**
 * Unit for meters per second squared (m/s^2)
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import PhetUnit from '../PhetUnit.js';
import SceneryPhetFluent from '../SceneryPhetFluent.js';
import sceneryPhet from '../sceneryPhet.js';
import ReadOnlyProperty from '../../../axon/js/ReadOnlyProperty.js';

export const metersPerSecondSquaredUnit = new PhetUnit<ReadOnlyProperty<string>>( 'm/s^2', {
  visualSymbolStringProperty: SceneryPhetFluent.units.metersPerSecondSquared.symbolStringProperty,
  visualSymbolPatternStringProperty: SceneryPhetFluent.units.metersPerSecondSquared.symbolPatternStringProperty,
  accessiblePattern: SceneryPhetFluent.a11y.units.metersPerSecondSquared.pattern
} );

sceneryPhet.register( 'metersPerSecondSquaredUnit', metersPerSecondSquaredUnit );