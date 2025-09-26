// Copyright 2025, University of Colorado Boulder

/**
 * Unit for degrees Fahrenheit (°F)
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import PhetUnit from '../PhetUnit.js';
import SceneryPhetFluent from '../SceneryPhetFluent.js';
import sceneryPhet from '../sceneryPhet.js';
import ReadOnlyProperty from '../../../axon/js/ReadOnlyProperty.js';

export const degreesFahrenheitUnit = new PhetUnit<ReadOnlyProperty<string>>( '°F', {
  visualSymbolStringProperty: SceneryPhetFluent.units.degreesFahrenheit.symbolStringProperty,
  visualSymbolPatternStringProperty: SceneryPhetFluent.units.degreesFahrenheit.symbolPatternStringProperty,
  accessiblePattern: SceneryPhetFluent.a11y.units.degreesFahrenheit.pattern
} );

sceneryPhet.register( 'degreesFahrenheitUnit', degreesFahrenheitUnit );