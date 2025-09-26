// Copyright 2025, University of Colorado Boulder

/**
 * Unit for nanometers (nm)
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import PhetUnit from '../PhetUnit.js';
import SceneryPhetFluent from '../SceneryPhetFluent.js';
import sceneryPhet from '../sceneryPhet.js';
import ReadOnlyProperty from '../../../axon/js/ReadOnlyProperty.js';

export const nanometersUnit = new PhetUnit<ReadOnlyProperty<string>>( 'nm', {
  visualSymbolStringProperty: SceneryPhetFluent.units.nanometers.symbolStringProperty,
  visualSymbolPatternStringProperty: SceneryPhetFluent.units.nanometers.symbolPatternStringProperty,
  accessiblePattern: SceneryPhetFluent.a11y.units.nanometers.pattern
} );

sceneryPhet.register( 'nanometersUnit', nanometersUnit );