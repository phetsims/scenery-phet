// Copyright 2025, University of Colorado Boulder

/**
 * Unit for astronomical units squared (AU^2)
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import PhetUnit from '../PhetUnit.js';
import SceneryPhetFluent from '../SceneryPhetFluent.js';
import sceneryPhet from '../sceneryPhet.js';
import ReadOnlyProperty from '../../../axon/js/ReadOnlyProperty.js';

export const astronomicalUnitsSquaredUnit = new PhetUnit<ReadOnlyProperty<string>>( 'AU^2', {
  visualSymbolStringProperty: SceneryPhetFluent.units.astronomicalUnitsSquared.symbolStringProperty,
  visualSymbolPatternStringProperty: SceneryPhetFluent.units.astronomicalUnitsSquared.symbolPatternStringProperty,
  accessiblePattern: SceneryPhetFluent.a11y.units.astronomicalUnitsSquared.pattern
} );

sceneryPhet.register( 'astronomicalUnitsSquaredUnit', astronomicalUnitsSquaredUnit );