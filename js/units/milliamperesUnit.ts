// Copyright 2025, University of Colorado Boulder

/**
 * Unit for milliamperes (mA)
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import PhetUnit from '../PhetUnit.js';
import SceneryPhetFluent from '../SceneryPhetFluent.js';
import sceneryPhet from '../sceneryPhet.js';
import ReadOnlyProperty from '../../../axon/js/ReadOnlyProperty.js';

export const milliamperesUnit = new PhetUnit<ReadOnlyProperty<string>>( 'mA', {
  visualSymbolStringProperty: SceneryPhetFluent.units.milliamperes.symbolStringProperty,
  visualSymbolPatternStringProperty: SceneryPhetFluent.units.milliamperes.symbolPatternStringProperty,
  accessiblePattern: SceneryPhetFluent.a11y.units.milliamperes.pattern
} );

sceneryPhet.register( 'milliamperesUnit', milliamperesUnit );