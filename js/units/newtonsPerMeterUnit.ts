// Copyright 2025, University of Colorado Boulder

/**
 * Unit for Newtons per meter (N/m)
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import PhetUnit from '../PhetUnit.js';
import SceneryPhetFluent from '../SceneryPhetFluent.js';
import sceneryPhet from '../sceneryPhet.js';
import ReadOnlyProperty from '../../../axon/js/ReadOnlyProperty.js';

export const newtonsPerMeterUnit = new PhetUnit<ReadOnlyProperty<string>>( 'N/m', {
  visualSymbolStringProperty: SceneryPhetFluent.units.newtonsPerMeter.symbolStringProperty,
  visualSymbolPatternStringProperty: SceneryPhetFluent.units.newtonsPerMeter.symbolPatternStringProperty,
  accessiblePattern: SceneryPhetFluent.a11y.units.newtonsPerMeter.pattern
} );

sceneryPhet.register( 'newtonsPerMeterUnit', newtonsPerMeterUnit );