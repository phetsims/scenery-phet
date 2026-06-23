// Copyright 2026, University of Colorado Boulder

/**
 * Unit for volts per nanometer (V/nm)
 *
 * @author @author Chris Malley (PixelZoom, Inc.)
 */

import ReadOnlyProperty from '../../../axon/js/ReadOnlyProperty.js';
import PhetUnit from '../PhetUnit.js';
import SceneryPhetFluent from '../SceneryPhetFluent.js';

export const voltsPerNanometerUnit = new PhetUnit<ReadOnlyProperty<string>>( 'V/nm', {
  visualSymbolStringProperty: SceneryPhetFluent.units.voltsPerNanometer.symbolStringProperty,
  visualSymbolPatternStringProperty: SceneryPhetFluent.units.voltsPerNanometer.symbolPatternStringProperty,
  accessiblePattern: SceneryPhetFluent.a11y.units.voltsPerNanometer.pattern
} );
