// Copyright 2025, University of Colorado Boulder

/**
 * Unit for radians (radians)
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import PhetUnit from '../PhetUnit.js';
import SceneryPhetFluent from '../SceneryPhetFluent.js';
import sceneryPhet from '../sceneryPhet.js';
import ReadOnlyProperty from '../../../axon/js/ReadOnlyProperty.js';

export const radiansUnit = new PhetUnit<ReadOnlyProperty<string>>( 'radians', {
  visualSymbolStringProperty: SceneryPhetFluent.units.radians.symbolStringProperty,
  visualSymbolPatternStringProperty: SceneryPhetFluent.units.radians.symbolPatternStringProperty,
  accessiblePattern: SceneryPhetFluent.a11y.units.radians.pattern
} );

sceneryPhet.register( 'radiansUnit', radiansUnit );