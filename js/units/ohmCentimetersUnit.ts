// Copyright 2025, University of Colorado Boulder

/**
 * Unit for ohm-centimeters (Ω·cm)
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import PhetUnit from '../PhetUnit.js';
import SceneryPhetFluent from '../SceneryPhetFluent.js';
import sceneryPhet from '../sceneryPhet.js';
import ReadOnlyProperty from '../../../axon/js/ReadOnlyProperty.js';

export const ohmCentimetersUnit = new PhetUnit<ReadOnlyProperty<string>>( 'Ω·cm', {
  visualSymbolStringProperty: SceneryPhetFluent.units.ohmCentimeters.symbolStringProperty,
  visualSymbolPatternStringProperty: SceneryPhetFluent.units.ohmCentimeters.symbolPatternStringProperty,
  accessiblePattern: SceneryPhetFluent.a11y.units.ohmCentimeters.pattern
} );

sceneryPhet.register( 'ohmCentimetersUnit', ohmCentimetersUnit );