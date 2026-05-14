// Copyright 2026, University of Colorado Boulder

/**
 * Unit for micrometers (μm)
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import ReadOnlyProperty from '../../../axon/js/ReadOnlyProperty.js';
import PhetUnit from '../PhetUnit.js';
import SceneryPhetFluent from '../SceneryPhetFluent.js';
import sceneryPhet from '../sceneryPhet.js';

export const micrometersUnit = new PhetUnit<ReadOnlyProperty<string>>( 'μm', {
  visualSymbolStringProperty: SceneryPhetFluent.units.micrometers.symbolStringProperty,
  visualSymbolPatternStringProperty: SceneryPhetFluent.units.micrometers.symbolPatternStringProperty,
  accessiblePattern: SceneryPhetFluent.a11y.units.micrometers.pattern
} );

sceneryPhet.register( 'micrometersUnit', micrometersUnit );
