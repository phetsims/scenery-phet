// Copyright 2025-2026, University of Colorado Boulder

/**
 * Unit for millivolts (mV)
 *
 * @author Jonathan Olson (PhET Interactive Simulations)
 */

import PhetUnit from '../PhetUnit.js';
import SceneryPhetFluent from '../SceneryPhetFluent.js';
import sceneryPhet from '../sceneryPhet.js';
import ReadOnlyProperty from '../../../axon/js/ReadOnlyProperty.js';

export const millivoltsUnit = new PhetUnit<ReadOnlyProperty<string>>( 'mV', {
  visualSymbolStringProperty: SceneryPhetFluent.units.millivolts.symbolStringProperty,
  visualSymbolPatternStringProperty: SceneryPhetFluent.units.millivolts.symbolPatternStringProperty,
  accessiblePattern: SceneryPhetFluent.a11y.units.millivolts.pattern
} );

sceneryPhet.register( 'millivoltsUnit', millivoltsUnit );