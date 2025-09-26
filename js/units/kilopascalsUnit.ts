// Copyright 2025, University of Colorado Boulder

/**
 * Unit for kilopascals (kPa)
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import PhetUnit from '../PhetUnit.js';
import SceneryPhetFluent from '../SceneryPhetFluent.js';
import sceneryPhet from '../sceneryPhet.js';
import ReadOnlyProperty from '../../../axon/js/ReadOnlyProperty.js';

export const kilopascalsUnit = new PhetUnit<ReadOnlyProperty<string>>( 'kPa', {
  visualSymbolStringProperty: SceneryPhetFluent.units.kilopascals.symbolStringProperty,
  visualSymbolPatternStringProperty: SceneryPhetFluent.units.kilopascals.symbolPatternStringProperty,
  accessiblePattern: SceneryPhetFluent.a11y.units.kilopascals.pattern
} );

sceneryPhet.register( 'kilopascalsUnit', kilopascalsUnit );