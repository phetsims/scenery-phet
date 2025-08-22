// Copyright 2025, University of Colorado Boulder

/**
 * Unit for percent.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import ReadOnlyProperty from '../../../axon/js/ReadOnlyProperty.js';
import PhetUnit from '../PhetUnit.js';
import SceneryPhetFluent from '../SceneryPhetFluent.js';
import sceneryPhet from '../sceneryPhet.js';

export const percentUnit = new PhetUnit<ReadOnlyProperty<string>>( '%', {
  visualStandaloneStringProperty: SceneryPhetFluent.units.percentStringProperty,
  visualPatternStringProperty: SceneryPhetFluent.units.percentPatternStringProperty,
  accessiblePattern: SceneryPhetFluent.a11y.units.percentPattern
} );

sceneryPhet.register( 'percentUnit', percentUnit );