// Copyright 2025, University of Colorado Boulder

/**
 * Unit for atomic mass units (AMU)
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import PhetUnit from '../PhetUnit.js';
import SceneryPhetFluent from '../SceneryPhetFluent.js';
import sceneryPhet from '../sceneryPhet.js';
import ReadOnlyProperty from '../../../axon/js/ReadOnlyProperty.js';

export const atomicMassUnitsUnit = new PhetUnit<ReadOnlyProperty<string>>( 'AMU', {
  visualSymbolStringProperty: SceneryPhetFluent.units.atomicMassUnits.symbolStringProperty,
  visualSymbolPatternStringProperty: SceneryPhetFluent.units.atomicMassUnits.symbolPatternStringProperty,
  accessiblePattern: SceneryPhetFluent.a11y.units.atomicMassUnits.pattern
} );

sceneryPhet.register( 'atomicMassUnitsUnit', atomicMassUnitsUnit );