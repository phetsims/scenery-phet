// Copyright 2025, University of Colorado Boulder

/**
 * Unit for molar (M)
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import PhetUnit from '../PhetUnit.js';
import SceneryPhetFluent from '../SceneryPhetFluent.js';
import sceneryPhet from '../sceneryPhet.js';
import ReadOnlyProperty from '../../../axon/js/ReadOnlyProperty.js';

export const molarUnit = new PhetUnit<ReadOnlyProperty<string>>( 'M', {
  visualSymbolStringProperty: SceneryPhetFluent.units.molar.symbolStringProperty,
  visualSymbolPatternStringProperty: SceneryPhetFluent.units.molar.symbolPatternStringProperty,
  accessiblePattern: SceneryPhetFluent.a11y.units.molar.pattern
} );

sceneryPhet.register( 'molarUnit', molarUnit );