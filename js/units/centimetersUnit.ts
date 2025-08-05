// Copyright 2025, University of Colorado Boulder

/**
 * Unit for centimeters.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import PhetUnit from '../PhetUnit.js';
import SceneryPhetFluent from '../SceneryPhetFluent.js';
import sceneryPhet from '../sceneryPhet.js';

export const centimetersUnit = new PhetUnit( 'cm', {
  visualStandaloneStringProperty: SceneryPhetFluent.units.centimetersStringProperty,
  visualPattern: SceneryPhetFluent.units.centimetersPattern,
  spokenPattern: SceneryPhetFluent.a11y.units.centimetersPattern
} );

sceneryPhet.register( 'centimetersUnit', centimetersUnit );