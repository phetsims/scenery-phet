// Copyright 2025, University of Colorado Boulder

/**
 * Unit for picoseconds (ps)
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import PhetUnit from '../PhetUnit.js';
import SceneryPhetFluent from '../SceneryPhetFluent.js';
import sceneryPhet from '../sceneryPhet.js';
import ReadOnlyProperty from '../../../axon/js/ReadOnlyProperty.js';

export const picosecondsUnit = new PhetUnit<ReadOnlyProperty<string>>( 'ps', {
  visualSymbolStringProperty: SceneryPhetFluent.units.picoseconds.symbolStringProperty,
  visualSymbolPatternStringProperty: SceneryPhetFluent.units.picoseconds.symbolPatternStringProperty,
  accessiblePattern: SceneryPhetFluent.a11y.units.picoseconds.pattern
} );

sceneryPhet.register( 'picosecondsUnit', picosecondsUnit );