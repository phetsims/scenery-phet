// Copyright 2025, University of Colorado Boulder

/**
 * Unit for electron volts (eV)
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import PhetUnit from '../PhetUnit.js';
import SceneryPhetFluent from '../SceneryPhetFluent.js';
import sceneryPhet from '../sceneryPhet.js';
import ReadOnlyProperty from '../../../axon/js/ReadOnlyProperty.js';

export const electronVoltUnit = new PhetUnit<ReadOnlyProperty<string>>( 'eV', {
  visualSymbolStringProperty: SceneryPhetFluent.units.electronVolt.symbolStringProperty,
  visualSymbolPatternStringProperty: SceneryPhetFluent.units.electronVolt.symbolPatternStringProperty,
  accessiblePattern: SceneryPhetFluent.a11y.units.electronVolt.pattern
} );

sceneryPhet.register( 'electronVoltUnit', electronVoltUnit );