// Copyright 2022, University of Colorado Boulder

/**
 * Colors for the fractions simulations.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import { Color, ProfileColorProperty } from '../../scenery/js/imports.js';
import sceneryPhet from './sceneryPhet.js';

// Initial colors for each profile, by string key. Only profile currently is default (still helpful for making color
// tweaks with the top-level files)
const SceneryPhetColors = {

  emptyBeakerProperty: new ProfileColorProperty( sceneryPhet, 'emptyBeaker', { default: new Color( 150, 150, 150, 0.1 ) } ),
  waterProperty: new ProfileColorProperty( sceneryPhet, 'water', { default: new Color( 30, 163, 255, 0.8 ) } ),
  beakerShineProperty: new ProfileColorProperty( sceneryPhet, 'beakerShine', { default: new Color( 255, 255, 255, 0.7 ) } )
};

sceneryPhet.register( 'SceneryPhetColors', SceneryPhetColors );

export default SceneryPhetColors;