// Copyright 2026, University of Colorado Boulder

/**
 * Unit for microamperes (μA)
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import PhetUnit from '../PhetUnit.js';
import SceneryPhetFluent from '../SceneryPhetFluent.js';
import sceneryPhet from '../sceneryPhet.js';
import ReadOnlyProperty from '../../../axon/js/ReadOnlyProperty.js';

export const microamperesUnit = new PhetUnit<ReadOnlyProperty<string>>( 'μA', {
  visualSymbolStringProperty: SceneryPhetFluent.units.microamperes.symbolStringProperty,
  visualSymbolPatternStringProperty: SceneryPhetFluent.units.microamperes.symbolPatternStringProperty,
  accessiblePattern: SceneryPhetFluent.a11y.units.microamperes.pattern
} );

sceneryPhet.register( 'microamperesUnit', microamperesUnit );