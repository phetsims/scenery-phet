// Copyright 2025, University of Colorado Boulder

/**
 * Unit for gauss (G)
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import PhetUnit from '../PhetUnit.js';
import SceneryPhetFluent from '../SceneryPhetFluent.js';
import sceneryPhet from '../sceneryPhet.js';
import ReadOnlyProperty from '../../../axon/js/ReadOnlyProperty.js';

export const gaussUnit = new PhetUnit<ReadOnlyProperty<string>>( 'G', {
  visualSymbolStringProperty: SceneryPhetFluent.units.gauss.symbolStringProperty,
  visualSymbolPatternStringProperty: SceneryPhetFluent.units.gauss.symbolPatternStringProperty,
  accessiblePattern: SceneryPhetFluent.a11y.units.gauss.pattern
} );

sceneryPhet.register( 'gaussUnit', gaussUnit );