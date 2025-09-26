// Copyright 2025, University of Colorado Boulder

/**
 * Unit for liters per second (L/s)
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import PhetUnit from '../PhetUnit.js';
import SceneryPhetFluent from '../SceneryPhetFluent.js';
import sceneryPhet from '../sceneryPhet.js';
import ReadOnlyProperty from '../../../axon/js/ReadOnlyProperty.js';

export const litersPerSecondUnit = new PhetUnit<ReadOnlyProperty<string>>( 'L/s', {
  visualSymbolStringProperty: SceneryPhetFluent.units.litersPerSecond.symbolStringProperty,
  visualSymbolPatternStringProperty: SceneryPhetFluent.units.litersPerSecond.symbolPatternStringProperty,
  accessiblePattern: SceneryPhetFluent.a11y.units.litersPerSecond.pattern
} );

sceneryPhet.register( 'litersPerSecondUnit', litersPerSecondUnit );