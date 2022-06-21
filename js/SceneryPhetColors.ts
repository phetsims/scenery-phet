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
  emptyBeakerFillProperty: new ProfileColorProperty( sceneryPhet, 'emptyBeakerFill', { default: new Color( 249, 253, 255, 0.2 ) } ),
  solutionFillProperty: new ProfileColorProperty( sceneryPhet, 'solutionFill', { default: new Color( 165, 217, 242 ) } ),
  beakerShineFillProperty: new ProfileColorProperty( sceneryPhet, 'beakerShineFill', { default: new Color( 255, 255, 255, 0.4 ) } ),
  solutionShadowFillProperty: new ProfileColorProperty( sceneryPhet, 'solutionShadowFill', { default: new Color( 142, 198, 221 ) } ),
  solutionShineFillProperty: new ProfileColorProperty( sceneryPhet, 'solutionShineFill', { default: new Color( 180, 229, 249 ) } ),
  beakerStroke: new ProfileColorProperty( sceneryPhet, 'beakerStroke', { default: 'black' } ),
  tickStroke: new ProfileColorProperty( sceneryPhet, 'tickStroke', { default: 'black' } )
};

sceneryPhet.register( 'SceneryPhetColors', SceneryPhetColors );

export default SceneryPhetColors;