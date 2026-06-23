// Copyright 2026, University of Colorado Boulder

/**
 * Unit for electron volts per nanometer squared (eV/nm^2)
 *
 * @author @author Chris Malley (PixelZoom, Inc.)
 */

import ReadOnlyProperty from '../../../axon/js/ReadOnlyProperty.js';
import PhetUnit from '../PhetUnit.js';
import SceneryPhetFluent from '../SceneryPhetFluent.js';

export const electronVoltsPerNanometerSquaredUnit = new PhetUnit<ReadOnlyProperty<string>>( 'eV/nm^2', {
  visualSymbolStringProperty: SceneryPhetFluent.units.electronVoltsPerNanometerSquared.symbolStringProperty,
  visualSymbolPatternStringProperty: SceneryPhetFluent.units.electronVoltsPerNanometerSquared.symbolPatternStringProperty,
  accessiblePattern: SceneryPhetFluent.a11y.units.electronVoltsPerNanometerSquared.pattern
} );
