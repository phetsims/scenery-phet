// Copyright 2025, University of Colorado Boulder

/**
 * Unit for moles (mol)
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import PhetUnit from '../PhetUnit.js';
import SceneryPhetFluent from '../SceneryPhetFluent.js';
import sceneryPhet from '../sceneryPhet.js';
import ReadOnlyProperty from '../../../axon/js/ReadOnlyProperty.js';

export const molesUnit = new PhetUnit<ReadOnlyProperty<string>>( 'mol', {
  visualSymbolStringProperty: SceneryPhetFluent.units.moles.symbolStringProperty,
  visualSymbolPatternStringProperty: SceneryPhetFluent.units.moles.symbolPatternStringProperty,
  accessiblePattern: SceneryPhetFluent.a11y.units.moles.pattern
} );

sceneryPhet.register( 'molesUnit', molesUnit );