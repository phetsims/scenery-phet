// Copyright 2025, University of Colorado Boulder

/**
 * Unit for hertz.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import PhetUnit from '../PhetUnit.js';
import SceneryPhetFluent from '../SceneryPhetFluent.js';
import sceneryPhet from '../sceneryPhet.js';

export const hertzUnit = new PhetUnit( 'Hz', {
  visualStandaloneStringProperty: SceneryPhetFluent.units.hertzStringProperty,
  visualPattern: SceneryPhetFluent.units.hertzPattern,
  spokenPattern: SceneryPhetFluent.a11y.units.hertzPattern
} );

sceneryPhet.register( 'hertzUnit', hertzUnit );