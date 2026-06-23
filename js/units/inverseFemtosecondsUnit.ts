// Copyright 2026, University of Colorado Boulder

/**
 * Unit for inverse femtoseconds (fs^-1)
 *
 * @author @author Chris Malley (PixelZoom, Inc.)
 */

import ReadOnlyProperty from '../../../axon/js/ReadOnlyProperty.js';
import PhetUnit from '../PhetUnit.js';
import SceneryPhetFluent from '../SceneryPhetFluent.js';

export const inverseFemtosecondsUnit = new PhetUnit<ReadOnlyProperty<string>>( 'fs^-1', {
  visualSymbolStringProperty: SceneryPhetFluent.units.inverseFemtoseconds.symbolStringProperty,
  visualSymbolPatternStringProperty: SceneryPhetFluent.units.inverseFemtoseconds.symbolPatternStringProperty,
  accessiblePattern: SceneryPhetFluent.a11y.units.inverseFemtoseconds.pattern
} );
