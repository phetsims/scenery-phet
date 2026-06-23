// Copyright 2026, University of Colorado Boulder

/**
 * Unit for electron volts (eV)
 *
 * @author @author Chris Malley (PixelZoom, Inc.)
 */

import ReadOnlyProperty from '../../../axon/js/ReadOnlyProperty.js';
import PhetUnit from '../PhetUnit.js';
import SceneryPhetFluent from '../SceneryPhetFluent.js';

export const electronVoltsUnit = new PhetUnit<ReadOnlyProperty<string>>( 'eV', {
  visualSymbolStringProperty: SceneryPhetFluent.units.electronVolts.symbolStringProperty,
  visualSymbolPatternStringProperty: SceneryPhetFluent.units.electronVolts.symbolPatternStringProperty,
  accessiblePattern: SceneryPhetFluent.a11y.units.electronVolts.pattern
} );
