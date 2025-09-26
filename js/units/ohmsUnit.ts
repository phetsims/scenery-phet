// Copyright 2025, University of Colorado Boulder

/**
 * Unit for ohms (Ω)
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import PhetUnit from '../PhetUnit.js';
import SceneryPhetFluent from '../SceneryPhetFluent.js';
import sceneryPhet from '../sceneryPhet.js';
import ReadOnlyProperty from '../../../axon/js/ReadOnlyProperty.js';

export const ohmsUnit = new PhetUnit<ReadOnlyProperty<string>>( 'Ω', {
  visualSymbolStringProperty: SceneryPhetFluent.units.ohms.symbolStringProperty,
  visualSymbolPatternStringProperty: SceneryPhetFluent.units.ohms.symbolPatternStringProperty,
  accessiblePattern: SceneryPhetFluent.a11y.units.ohms.pattern
} );

sceneryPhet.register( 'ohmsUnit', ohmsUnit );