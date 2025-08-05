// Copyright 2025, University of Colorado Boulder

/**
 * Unit for percent.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import PhetUnit from '../PhetUnit.js';
import SceneryPhetFluent from '../SceneryPhetFluent.js';
import sceneryPhet from '../sceneryPhet.js';

export const percentUnit = new PhetUnit( '%', {
  visualStandaloneStringProperty: SceneryPhetFluent.units.percentStringProperty,
  visualPattern: SceneryPhetFluent.units.percentPattern,
  spokenPattern: SceneryPhetFluent.a11y.units.percentPattern
} );

sceneryPhet.register( 'percentUnit', percentUnit );