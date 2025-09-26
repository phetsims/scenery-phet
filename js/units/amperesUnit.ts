// Copyright 2025, University of Colorado Boulder

/**
 * Unit for amperes (A)
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import PhetUnit from '../PhetUnit.js';
import SceneryPhetFluent from '../SceneryPhetFluent.js';
import sceneryPhet from '../sceneryPhet.js';
import ReadOnlyProperty from '../../../axon/js/ReadOnlyProperty.js';

export const amperesUnit = new PhetUnit<ReadOnlyProperty<string>>( 'A', {
  visualSymbolStringProperty: SceneryPhetFluent.units.amperes.symbolStringProperty,
  visualSymbolPatternStringProperty: SceneryPhetFluent.units.amperes.symbolPatternStringProperty,
  accessiblePattern: SceneryPhetFluent.a11y.units.amperes.pattern
} );

sceneryPhet.register( 'amperesUnit', amperesUnit );