// Copyright 2025, University of Colorado Boulder

/**
 * Unit for moles per second (mol/s)
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import PhetUnit from '../PhetUnit.js';
import SceneryPhetFluent from '../SceneryPhetFluent.js';
import sceneryPhet from '../sceneryPhet.js';
import ReadOnlyProperty from '../../../axon/js/ReadOnlyProperty.js';

export const molesPerSecondUnit = new PhetUnit<ReadOnlyProperty<string>>( 'mol/s', {
  visualSymbolStringProperty: SceneryPhetFluent.units.molesPerSecond.symbolStringProperty,
  visualSymbolPatternStringProperty: SceneryPhetFluent.units.molesPerSecond.symbolPatternStringProperty,
  accessiblePattern: SceneryPhetFluent.a11y.units.molesPerSecond.pattern
} );

sceneryPhet.register( 'molesPerSecondUnit', molesPerSecondUnit );