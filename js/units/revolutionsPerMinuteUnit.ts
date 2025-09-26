// Copyright 2025, University of Colorado Boulder

/**
 * Unit for revolutions per minute (rpm)
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import PhetUnit from '../PhetUnit.js';
import SceneryPhetFluent from '../SceneryPhetFluent.js';
import sceneryPhet from '../sceneryPhet.js';
import ReadOnlyProperty from '../../../axon/js/ReadOnlyProperty.js';

export const revolutionsPerMinuteUnit = new PhetUnit<ReadOnlyProperty<string>>( 'rpm', {
  visualSymbolStringProperty: SceneryPhetFluent.units.revolutionsPerMinute.symbolStringProperty,
  visualSymbolPatternStringProperty: SceneryPhetFluent.units.revolutionsPerMinute.symbolPatternStringProperty,
  accessiblePattern: SceneryPhetFluent.a11y.units.revolutionsPerMinute.pattern
} );

sceneryPhet.register( 'revolutionsPerMinuteUnit', revolutionsPerMinuteUnit );