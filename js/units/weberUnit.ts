// Copyright 2025, University of Colorado Boulder

/**
 * Unit for weber (Wb)
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import PhetUnit from '../PhetUnit.js';
import SceneryPhetFluent from '../SceneryPhetFluent.js';
import sceneryPhet from '../sceneryPhet.js';
import ReadOnlyProperty from '../../../axon/js/ReadOnlyProperty.js';

export const weberUnit = new PhetUnit<ReadOnlyProperty<string>>( 'Wb', {
  visualSymbolStringProperty: SceneryPhetFluent.units.webers.symbolStringProperty,
  visualSymbolPatternStringProperty: SceneryPhetFluent.units.webers.symbolPatternStringProperty,
  accessiblePattern: SceneryPhetFluent.a11y.units.webers.pattern
} );

sceneryPhet.register( 'weberUnit', weberUnit );