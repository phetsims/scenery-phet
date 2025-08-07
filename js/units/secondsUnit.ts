// Copyright 2025, University of Colorado Boulder

/**
 * Unit for seconds.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import PhetUnit from '../PhetUnit.js';
import SceneryPhetFluent from '../SceneryPhetFluent.js';
import sceneryPhet from '../sceneryPhet.js';

export const secondsUnit = new PhetUnit( 's', {
  visualStandaloneStringProperty: SceneryPhetFluent.units.secondsStringProperty,
  visualPatternStringProperty: SceneryPhetFluent.units.secondsPatternStringProperty,
  accessiblePattern: SceneryPhetFluent.a11y.units.secondsPattern
} );

sceneryPhet.register( 'secondsUnit', secondsUnit );