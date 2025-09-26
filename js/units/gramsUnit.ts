// Copyright 2025, University of Colorado Boulder

/**
 * Unit for grams (g)
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import PhetUnit from '../PhetUnit.js';
import SceneryPhetFluent from '../SceneryPhetFluent.js';
import sceneryPhet from '../sceneryPhet.js';
import ReadOnlyProperty from '../../../axon/js/ReadOnlyProperty.js';

export const gramsUnit = new PhetUnit<ReadOnlyProperty<string>>( 'g', {
  visualSymbolStringProperty: SceneryPhetFluent.units.grams.symbolStringProperty,
  visualSymbolPatternStringProperty: SceneryPhetFluent.units.grams.symbolPatternStringProperty,
  accessiblePattern: SceneryPhetFluent.a11y.units.grams.pattern
} );

sceneryPhet.register( 'gramsUnit', gramsUnit );