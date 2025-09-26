// Copyright 2025, University of Colorado Boulder

/**
 * Unit for millimeters (mm)
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import PhetUnit from '../PhetUnit.js';
import SceneryPhetFluent from '../SceneryPhetFluent.js';
import sceneryPhet from '../sceneryPhet.js';
import ReadOnlyProperty from '../../../axon/js/ReadOnlyProperty.js';

export const millimetersUnit = new PhetUnit<ReadOnlyProperty<string>>( 'mm', {
  visualSymbolStringProperty: SceneryPhetFluent.units.millimeters.symbolStringProperty,
  visualSymbolPatternStringProperty: SceneryPhetFluent.units.millimeters.symbolPatternStringProperty,
  accessiblePattern: SceneryPhetFluent.a11y.units.millimeters.pattern
} );

sceneryPhet.register( 'millimetersUnit', millimetersUnit );