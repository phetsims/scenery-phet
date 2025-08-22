// Copyright 2025, University of Colorado Boulder

/**
 * Unit for centimeters.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import PhetUnit from '../PhetUnit.js';
import SceneryPhetFluent from '../SceneryPhetFluent.js';
import sceneryPhet from '../sceneryPhet.js';
import ReadOnlyProperty from '../../../axon/js/ReadOnlyProperty.js';

export const centimetersUnit = new PhetUnit<ReadOnlyProperty<string>>( 'cm', {
  visualStandaloneStringProperty: SceneryPhetFluent.units.centimetersStringProperty,
  visualPatternStringProperty: SceneryPhetFluent.units.centimetersPatternStringProperty,
  accessiblePattern: SceneryPhetFluent.a11y.units.centimetersPattern
} );

sceneryPhet.register( 'centimetersUnit', centimetersUnit );