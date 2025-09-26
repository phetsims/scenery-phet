// Copyright 2025, University of Colorado Boulder

/**
 * Unit for picometers per picosecond (pm/ps)
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import PhetUnit from '../PhetUnit.js';
import SceneryPhetFluent from '../SceneryPhetFluent.js';
import sceneryPhet from '../sceneryPhet.js';
import ReadOnlyProperty from '../../../axon/js/ReadOnlyProperty.js';

export const picometersPerPicosecondUnit = new PhetUnit<ReadOnlyProperty<string>>( 'pm/ps', {
  visualSymbolStringProperty: SceneryPhetFluent.units.picometersPerPicosecond.symbolStringProperty,
  visualSymbolPatternStringProperty: SceneryPhetFluent.units.picometersPerPicosecond.symbolPatternStringProperty,
  accessiblePattern: SceneryPhetFluent.a11y.units.picometersPerPicosecond.pattern
} );

sceneryPhet.register( 'picometersPerPicosecondUnit', picometersPerPicosecondUnit );