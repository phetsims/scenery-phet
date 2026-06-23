// Copyright 2026, University of Colorado Boulder

/**
 * Unit for electron masses (m<sub>e</sub>)
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ReadOnlyProperty from '../../../axon/js/ReadOnlyProperty.js';
import PhetUnit from '../PhetUnit.js';
import SceneryPhetFluent from '../SceneryPhetFluent.js';

export const electronMassesUnit = new PhetUnit<ReadOnlyProperty<string>>( 'm<sub>e</sub>', {
  visualSymbolStringProperty: SceneryPhetFluent.units.electronMasses.symbolStringProperty,
  visualSymbolPatternStringProperty: SceneryPhetFluent.units.electronMasses.symbolPatternStringProperty,
  accessiblePattern: SceneryPhetFluent.a11y.units.electronMasses.pattern
} );
