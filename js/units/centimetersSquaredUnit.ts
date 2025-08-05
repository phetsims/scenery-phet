// Copyright 2025, University of Colorado Boulder

/**
 * Unit for centimeters squared (cm^2).
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import PhetUnit from '../PhetUnit.js';
import SceneryPhetFluent from '../SceneryPhetFluent.js';
import sceneryPhet from '../sceneryPhet.js';

export const centimetersSquaredUnit = new PhetUnit( 'cm^2', {
  visualStandaloneStringProperty: SceneryPhetFluent.units.centimetersSquaredStringProperty,
  visualPattern: SceneryPhetFluent.units.centimetersSquaredPattern,
  spokenPattern: SceneryPhetFluent.a11y.units.centimetersSquaredPattern
} );

sceneryPhet.register( 'centimetersSquaredUnit', centimetersSquaredUnit );