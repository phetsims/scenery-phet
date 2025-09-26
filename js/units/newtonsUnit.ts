// Copyright 2025, University of Colorado Boulder

/**
 * Unit for Newtons (N)
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import PhetUnit from '../PhetUnit.js';
import SceneryPhetFluent from '../SceneryPhetFluent.js';
import sceneryPhet from '../sceneryPhet.js';
import ReadOnlyProperty from '../../../axon/js/ReadOnlyProperty.js';

export const newtonsUnit = new PhetUnit<ReadOnlyProperty<string>>( 'N', {
  visualSymbolStringProperty: SceneryPhetFluent.units.newtons.symbolStringProperty,
  visualSymbolPatternStringProperty: SceneryPhetFluent.units.newtons.symbolPatternStringProperty,
  accessiblePattern: SceneryPhetFluent.a11y.units.newtons.pattern
} );

sceneryPhet.register( 'newtonsUnit', newtonsUnit );