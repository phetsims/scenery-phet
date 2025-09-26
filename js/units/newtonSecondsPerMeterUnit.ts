// Copyright 2025, University of Colorado Boulder

/**
 * Unit for Newton-seconds per meter (N·s/m)
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import PhetUnit from '../PhetUnit.js';
import SceneryPhetFluent from '../SceneryPhetFluent.js';
import sceneryPhet from '../sceneryPhet.js';
import ReadOnlyProperty from '../../../axon/js/ReadOnlyProperty.js';

export const newtonSecondsPerMeterUnit = new PhetUnit<ReadOnlyProperty<string>>( 'N·s/m', {
  visualSymbolStringProperty: SceneryPhetFluent.units.newtonSecondsPerMeter.symbolStringProperty,
  visualSymbolPatternStringProperty: SceneryPhetFluent.units.newtonSecondsPerMeter.symbolPatternStringProperty,
  accessiblePattern: SceneryPhetFluent.a11y.units.newtonSecondsPerMeter.pattern
} );

sceneryPhet.register( 'newtonSecondsPerMeterUnit', newtonSecondsPerMeterUnit );