// Copyright 2025, University of Colorado Boulder

/**
 * Unit for liters (L)
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import PhetUnit from '../PhetUnit.js';
import SceneryPhetFluent from '../SceneryPhetFluent.js';
import sceneryPhet from '../sceneryPhet.js';
import ReadOnlyProperty from '../../../axon/js/ReadOnlyProperty.js';

export const litersUnit = new PhetUnit<ReadOnlyProperty<string>>( 'L', {
  visualSymbolStringProperty: SceneryPhetFluent.units.liters.symbolStringProperty,
  visualSymbolPatternStringProperty: SceneryPhetFluent.units.liters.symbolPatternStringProperty,
  accessiblePattern: SceneryPhetFluent.a11y.units.liters.pattern
} );

sceneryPhet.register( 'litersUnit', litersUnit );