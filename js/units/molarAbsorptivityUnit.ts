// Copyright 2025, University of Colorado Boulder

/**
 * Unit for molar absorptivity (1/(cm*M)).
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import PhetUnit from '../PhetUnit.js';
import SceneryPhetFluent from '../SceneryPhetFluent.js';
import sceneryPhet from '../sceneryPhet.js';
import ReadOnlyProperty from '../../../axon/js/ReadOnlyProperty.js';

export const molarAbsorptivityUnit = new PhetUnit<ReadOnlyProperty<string>>( '1/(cm*M)', {
  visualSymbolStringProperty: SceneryPhetFluent.units.molarAbsorptivity.symbolStringProperty,
  visualSymbolPatternStringProperty: SceneryPhetFluent.units.molarAbsorptivity.symbolPatternStringProperty,
  accessiblePattern: SceneryPhetFluent.a11y.units.molarAbsorptivity.pattern
} );

sceneryPhet.register( 'molarAbsorptivityUnit', molarAbsorptivityUnit );