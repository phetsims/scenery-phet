// Copyright 2025, University of Colorado Boulder

/**
 * Unit for nanoseconds (ns)
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import PhetUnit from '../PhetUnit.js';
import SceneryPhetFluent from '../SceneryPhetFluent.js';
import sceneryPhet from '../sceneryPhet.js';
import ReadOnlyProperty from '../../../axon/js/ReadOnlyProperty.js';

export const nanosecondsUnit = new PhetUnit<ReadOnlyProperty<string>>( 'ns', {
  visualSymbolStringProperty: SceneryPhetFluent.units.nanoseconds.symbolStringProperty,
  visualSymbolPatternStringProperty: SceneryPhetFluent.units.nanoseconds.symbolPatternStringProperty,
  accessiblePattern: SceneryPhetFluent.a11y.units.nanoseconds.pattern
} );

sceneryPhet.register( 'nanosecondsUnit', nanosecondsUnit );