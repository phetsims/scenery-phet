// Copyright 2025, University of Colorado Boulder

/**
 * Unit for meters per second (m/s)
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import PhetUnit from '../PhetUnit.js';
import SceneryPhetFluent from '../SceneryPhetFluent.js';
import sceneryPhet from '../sceneryPhet.js';
import ReadOnlyProperty from '../../../axon/js/ReadOnlyProperty.js';

export const metersPerSecondUnit = new PhetUnit<ReadOnlyProperty<string>>( 'm/s', {
  visualSymbolStringProperty: SceneryPhetFluent.units.metersPerSecond.symbolStringProperty,
  visualSymbolPatternStringProperty: SceneryPhetFluent.units.metersPerSecond.symbolPatternStringProperty,
  accessiblePattern: SceneryPhetFluent.a11y.units.metersPerSecond.pattern
} );

sceneryPhet.register( 'metersPerSecondUnit', metersPerSecondUnit );