// Copyright 2025, University of Colorado Boulder

/**
 * Unit for joules (J)
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import PhetUnit from '../PhetUnit.js';
import SceneryPhetFluent from '../SceneryPhetFluent.js';
import sceneryPhet from '../sceneryPhet.js';
import ReadOnlyProperty from '../../../axon/js/ReadOnlyProperty.js';

export const joulesUnit = new PhetUnit<ReadOnlyProperty<string>>( 'J', {
  visualSymbolStringProperty: SceneryPhetFluent.units.joules.symbolStringProperty,
  visualSymbolPatternStringProperty: SceneryPhetFluent.units.joules.symbolPatternStringProperty,
  accessiblePattern: SceneryPhetFluent.a11y.units.joules.pattern
} );

sceneryPhet.register( 'joulesUnit', joulesUnit );