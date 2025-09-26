// Copyright 2025, University of Colorado Boulder

/**
 * Unit for astronomical units (AU)
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import PhetUnit from '../PhetUnit.js';
import SceneryPhetFluent from '../SceneryPhetFluent.js';
import sceneryPhet from '../sceneryPhet.js';
import ReadOnlyProperty from '../../../axon/js/ReadOnlyProperty.js';

export const astronomicalUnitsUnit = new PhetUnit<ReadOnlyProperty<string>>( 'AU', {
  visualSymbolStringProperty: SceneryPhetFluent.units.astronomicalUnits.symbolStringProperty,
  visualSymbolPatternStringProperty: SceneryPhetFluent.units.astronomicalUnits.symbolPatternStringProperty,
  accessiblePattern: SceneryPhetFluent.a11y.units.astronomicalUnits.pattern
} );

sceneryPhet.register( 'astronomicalUnitsUnit', astronomicalUnitsUnit );