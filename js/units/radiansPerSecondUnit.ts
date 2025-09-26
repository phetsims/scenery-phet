// Copyright 2025, University of Colorado Boulder

/**
 * Unit for radians per second (radians/s)
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import PhetUnit from '../PhetUnit.js';
import SceneryPhetFluent from '../SceneryPhetFluent.js';
import sceneryPhet from '../sceneryPhet.js';
import ReadOnlyProperty from '../../../axon/js/ReadOnlyProperty.js';

export const radiansPerSecondUnit = new PhetUnit<ReadOnlyProperty<string>>( 'radians/s', {
  visualSymbolStringProperty: SceneryPhetFluent.units.radiansPerSecond.symbolStringProperty,
  visualSymbolPatternStringProperty: SceneryPhetFluent.units.radiansPerSecond.symbolPatternStringProperty,
  accessiblePattern: SceneryPhetFluent.a11y.units.radiansPerSecond.pattern
} );

sceneryPhet.register( 'radiansPerSecondUnit', radiansPerSecondUnit );