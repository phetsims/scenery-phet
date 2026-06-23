// Copyright 2026, University of Colorado Boulder

/**
 * Unit for inverse nanometers (nm^-1)
 *
 * @author @author Chris Malley (PixelZoom, Inc.)
 */

import ReadOnlyProperty from '../../../axon/js/ReadOnlyProperty.js';
import PhetUnit from '../PhetUnit.js';
import SceneryPhetFluent from '../SceneryPhetFluent.js';

export const inverseNanometersUnit = new PhetUnit<ReadOnlyProperty<string>>( 'nm^-1', {
  visualSymbolStringProperty: SceneryPhetFluent.units.inverseNanometers.symbolStringProperty,
  visualSymbolPatternStringProperty: SceneryPhetFluent.units.inverseNanometers.symbolPatternStringProperty,
  accessiblePattern: SceneryPhetFluent.a11y.units.inverseNanometers.pattern
} );
