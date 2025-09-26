// Copyright 2025, University of Colorado Boulder

/**
 * Unit for volts (V)
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import PhetUnit from '../PhetUnit.js';
import SceneryPhetFluent from '../SceneryPhetFluent.js';
import sceneryPhet from '../sceneryPhet.js';
import ReadOnlyProperty from '../../../axon/js/ReadOnlyProperty.js';

export const voltsUnit = new PhetUnit<ReadOnlyProperty<string>>( 'V', {
  visualSymbolStringProperty: SceneryPhetFluent.units.volts.symbolStringProperty,
  visualSymbolPatternStringProperty: SceneryPhetFluent.units.volts.symbolPatternStringProperty,
  accessiblePattern: SceneryPhetFluent.a11y.units.volts.pattern
} );

sceneryPhet.register( 'voltsUnit', voltsUnit );