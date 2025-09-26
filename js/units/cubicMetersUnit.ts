// Copyright 2025, University of Colorado Boulder

/**
 * Unit for cubic meters (m^3)
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import PhetUnit from '../PhetUnit.js';
import SceneryPhetFluent from '../SceneryPhetFluent.js';
import sceneryPhet from '../sceneryPhet.js';
import ReadOnlyProperty from '../../../axon/js/ReadOnlyProperty.js';

export const cubicMetersUnit = new PhetUnit<ReadOnlyProperty<string>>( 'm^3', {
  visualSymbolStringProperty: SceneryPhetFluent.units.cubicMeters.symbolStringProperty,
  visualSymbolPatternStringProperty: SceneryPhetFluent.units.cubicMeters.symbolPatternStringProperty,
  accessiblePattern: SceneryPhetFluent.a11y.units.cubicMeters.pattern
} );

sceneryPhet.register( 'cubicMetersUnit', cubicMetersUnit );