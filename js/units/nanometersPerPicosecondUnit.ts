// Copyright 2025, University of Colorado Boulder

/**
 * Unit for nanometers per picosecond (nm/ps)
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import PhetUnit from '../PhetUnit.js';
import SceneryPhetFluent from '../SceneryPhetFluent.js';
import sceneryPhet from '../sceneryPhet.js';
import ReadOnlyProperty from '../../../axon/js/ReadOnlyProperty.js';

export const nanometersPerPicosecondUnit = new PhetUnit<ReadOnlyProperty<string>>( 'nm/ps', {
  visualSymbolStringProperty: SceneryPhetFluent.units.nanometersPerPicosecond.symbolStringProperty,
  visualSymbolPatternStringProperty: SceneryPhetFluent.units.nanometersPerPicosecond.symbolPatternStringProperty,
  accessiblePattern: SceneryPhetFluent.a11y.units.nanometersPerPicosecond.pattern
} );

sceneryPhet.register( 'nanometersPerPicosecondUnit', nanometersPerPicosecondUnit );