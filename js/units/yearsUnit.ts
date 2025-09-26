// Copyright 2025, University of Colorado Boulder

/**
 * Unit for years (years)
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import PhetUnit from '../PhetUnit.js';
import SceneryPhetFluent from '../SceneryPhetFluent.js';
import sceneryPhet from '../sceneryPhet.js';
import ReadOnlyProperty from '../../../axon/js/ReadOnlyProperty.js';

export const yearsUnit = new PhetUnit<ReadOnlyProperty<string>>( 'years', {
  visualSymbolStringProperty: SceneryPhetFluent.units.years.symbolStringProperty,
  visualSymbolPatternStringProperty: SceneryPhetFluent.units.years.symbolPatternStringProperty,
  accessiblePattern: SceneryPhetFluent.a11y.units.years.pattern
} );

sceneryPhet.register( 'yearsUnit', yearsUnit );