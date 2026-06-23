// Copyright 2026, University of Colorado Boulder

/**
 * Unit for inverse square root nanometers (nm^-½)
 *
 * @author @author Chris Malley (PixelZoom, Inc.)
 */

import ReadOnlyProperty from '../../../axon/js/ReadOnlyProperty.js';
import PhetUnit from '../PhetUnit.js';
import SceneryPhetFluent from '../SceneryPhetFluent.js';

export const inverseSquareRootNanometersUnit = new PhetUnit<ReadOnlyProperty<string>>( 'nm^-1/2', {
  visualSymbolStringProperty: SceneryPhetFluent.units.inverseSquareRootNanometers.symbolStringProperty,
  visualSymbolPatternStringProperty: SceneryPhetFluent.units.inverseSquareRootNanometers.symbolPatternStringProperty,
  accessiblePattern: SceneryPhetFluent.a11y.units.inverseSquareRootNanometers.pattern
} );
