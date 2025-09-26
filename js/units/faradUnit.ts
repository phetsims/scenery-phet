// Copyright 2025, University of Colorado Boulder

/**
 * Unit for farad (F)
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import PhetUnit from '../PhetUnit.js';
import SceneryPhetFluent from '../SceneryPhetFluent.js';
import sceneryPhet from '../sceneryPhet.js';
import ReadOnlyProperty from '../../../axon/js/ReadOnlyProperty.js';

export const faradUnit = new PhetUnit<ReadOnlyProperty<string>>( 'F', {
  visualSymbolStringProperty: SceneryPhetFluent.units.farads.symbolStringProperty,
  visualSymbolPatternStringProperty: SceneryPhetFluent.units.farads.symbolPatternStringProperty,
  accessiblePattern: SceneryPhetFluent.a11y.units.farads.pattern
} );

sceneryPhet.register( 'faradUnit', faradUnit );