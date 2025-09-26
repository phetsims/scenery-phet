// Copyright 2025, University of Colorado Boulder

/**
 * Unit for kilometers per second (km/s)
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import PhetUnit from '../PhetUnit.js';
import SceneryPhetFluent from '../SceneryPhetFluent.js';
import sceneryPhet from '../sceneryPhet.js';
import ReadOnlyProperty from '../../../axon/js/ReadOnlyProperty.js';

export const kilometersPerSecondUnit = new PhetUnit<ReadOnlyProperty<string>>( 'km/s', {
  visualSymbolStringProperty: SceneryPhetFluent.units.kilometersPerSecond.symbolStringProperty,
  visualSymbolPatternStringProperty: SceneryPhetFluent.units.kilometersPerSecond.symbolPatternStringProperty,
  accessiblePattern: SceneryPhetFluent.a11y.units.kilometersPerSecond.pattern
} );

sceneryPhet.register( 'kilometersPerSecondUnit', kilometersPerSecondUnit );