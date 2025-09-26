// Copyright 2025, University of Colorado Boulder

/**
 * Unit for centimeters squared (cm^2).
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import PhetUnit from '../PhetUnit.js';
import SceneryPhetFluent from '../SceneryPhetFluent.js';
import sceneryPhet from '../sceneryPhet.js';
import ReadOnlyProperty from '../../../axon/js/ReadOnlyProperty.js';

export const centimetersSquaredUnit = new PhetUnit<ReadOnlyProperty<string>>( 'cm^2', {
  visualSymbolStringProperty: SceneryPhetFluent.units.centimetersSquared.symbolStringProperty,
  visualSymbolPatternStringProperty: SceneryPhetFluent.units.centimetersSquared.symbolPatternStringProperty,
  accessiblePattern: SceneryPhetFluent.a11y.units.centimetersSquared.pattern
} );

sceneryPhet.register( 'centimetersSquaredUnit', centimetersSquaredUnit );