// Copyright 2025, University of Colorado Boulder

/**
 * Unit for Kelvin (K)
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import PhetUnit from '../PhetUnit.js';
import SceneryPhetFluent from '../SceneryPhetFluent.js';
import sceneryPhet from '../sceneryPhet.js';
import ReadOnlyProperty from '../../../axon/js/ReadOnlyProperty.js';

export const kelvinUnit = new PhetUnit<ReadOnlyProperty<string>>( 'K', {
  visualSymbolStringProperty: SceneryPhetFluent.units.kelvin.symbolStringProperty,
  visualSymbolPatternStringProperty: SceneryPhetFluent.units.kelvin.symbolPatternStringProperty,
  accessiblePattern: SceneryPhetFluent.a11y.units.kelvin.pattern
} );

sceneryPhet.register( 'kelvinUnit', kelvinUnit );