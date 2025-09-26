// Copyright 2025, University of Colorado Boulder

/**
 * Unit for degrees (°)
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import PhetUnit from '../PhetUnit.js';
import SceneryPhetFluent from '../SceneryPhetFluent.js';
import sceneryPhet from '../sceneryPhet.js';
import ReadOnlyProperty from '../../../axon/js/ReadOnlyProperty.js';

export const degreesUnit = new PhetUnit<ReadOnlyProperty<string>>( '°', {
  visualSymbolStringProperty: SceneryPhetFluent.units.degrees.symbolStringProperty,
  visualSymbolPatternStringProperty: SceneryPhetFluent.units.degrees.symbolPatternStringProperty,
  accessiblePattern: SceneryPhetFluent.a11y.units.degrees.pattern
} );

sceneryPhet.register( 'degreesUnit', degreesUnit );