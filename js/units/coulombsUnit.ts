// Copyright 2025, University of Colorado Boulder

/**
 * Unit for coulombs (C)
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import PhetUnit from '../PhetUnit.js';
import SceneryPhetFluent from '../SceneryPhetFluent.js';
import sceneryPhet from '../sceneryPhet.js';
import ReadOnlyProperty from '../../../axon/js/ReadOnlyProperty.js';

export const coulombsUnit = new PhetUnit<ReadOnlyProperty<string>>( 'C', {
  visualSymbolStringProperty: SceneryPhetFluent.units.coulombs.symbolStringProperty,
  visualSymbolPatternStringProperty: SceneryPhetFluent.units.coulombs.symbolPatternStringProperty,
  accessiblePattern: SceneryPhetFluent.a11y.units.coulombs.pattern
} );

sceneryPhet.register( 'coulombsUnit', coulombsUnit );