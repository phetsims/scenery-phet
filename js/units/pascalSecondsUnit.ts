// Copyright 2025, University of Colorado Boulder

/**
 * Unit for Pascal-seconds (Pa·s)
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import PhetUnit from '../PhetUnit.js';
import SceneryPhetFluent from '../SceneryPhetFluent.js';
import sceneryPhet from '../sceneryPhet.js';
import ReadOnlyProperty from '../../../axon/js/ReadOnlyProperty.js';

export const pascalSecondsUnit = new PhetUnit<ReadOnlyProperty<string>>( 'Pa·s', {
  visualSymbolStringProperty: SceneryPhetFluent.units.pascalSeconds.symbolStringProperty,
  visualSymbolPatternStringProperty: SceneryPhetFluent.units.pascalSeconds.symbolPatternStringProperty,
  accessiblePattern: SceneryPhetFluent.a11y.units.pascalSeconds.pattern
} );

sceneryPhet.register( 'pascalSecondsUnit', pascalSecondsUnit );