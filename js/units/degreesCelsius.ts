// Copyright 2025, University of Colorado Boulder

/**
 * Unit for degrees Celsius (°C)
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import PhetUnit from '../PhetUnit.js';
import SceneryPhetFluent from '../SceneryPhetFluent.js';
import sceneryPhet from '../sceneryPhet.js';
import ReadOnlyProperty from '../../../axon/js/ReadOnlyProperty.js';

export const degreesCelsiusUnit = new PhetUnit<ReadOnlyProperty<string>>( '°C', {
  visualSymbolStringProperty: SceneryPhetFluent.units.degreesCelsius.symbolStringProperty,
  visualSymbolPatternStringProperty: SceneryPhetFluent.units.degreesCelsius.symbolPatternStringProperty,
  accessiblePattern: SceneryPhetFluent.a11y.units.degreesCelsius.pattern
} );

sceneryPhet.register( 'degreesCelsiusUnit', degreesCelsiusUnit );