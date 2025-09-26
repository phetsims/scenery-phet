// Copyright 2025, University of Colorado Boulder

/**
 * Unit for meters per second per second (m/s/s)
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import PhetUnit from '../PhetUnit.js';
import SceneryPhetFluent from '../SceneryPhetFluent.js';
import sceneryPhet from '../sceneryPhet.js';
import ReadOnlyProperty from '../../../axon/js/ReadOnlyProperty.js';

export const metersPerSecondPerSecondUnit = new PhetUnit<ReadOnlyProperty<string>>( 'm/s/s', {
  visualSymbolStringProperty: SceneryPhetFluent.units.metersPerSecondPerSecond.symbolStringProperty,
  visualSymbolPatternStringProperty: SceneryPhetFluent.units.metersPerSecondPerSecond.symbolPatternStringProperty,
  accessiblePattern: SceneryPhetFluent.a11y.units.metersPerSecondPerSecond.pattern
} );

sceneryPhet.register( 'metersPerSecondPerSecondUnit', metersPerSecondPerSecondUnit );