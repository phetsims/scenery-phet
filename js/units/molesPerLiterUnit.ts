// Copyright 2025, University of Colorado Boulder

/**
 * Unit for moles per liter (mol/L)
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import PhetUnit from '../PhetUnit.js';
import SceneryPhetFluent from '../SceneryPhetFluent.js';
import sceneryPhet from '../sceneryPhet.js';
import ReadOnlyProperty from '../../../axon/js/ReadOnlyProperty.js';

export const molesPerLiterUnit = new PhetUnit<ReadOnlyProperty<string>>( 'mol/L', {
  visualSymbolStringProperty: SceneryPhetFluent.units.molesPerLiter.symbolStringProperty,
  visualSymbolPatternStringProperty: SceneryPhetFluent.units.molesPerLiter.symbolPatternStringProperty,
  accessiblePattern: SceneryPhetFluent.a11y.units.molesPerLiter.pattern
} );

sceneryPhet.register( 'molesPerLiterUnit', molesPerLiterUnit );