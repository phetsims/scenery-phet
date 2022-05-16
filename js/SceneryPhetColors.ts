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
  emptyBeakerFillProperty: new ProfileColorProperty( sceneryPhet, 'emptyBeaker', { default: new Color( 249, 253, 255, 0.2 ) } ),
  solutionFillProperty: new ProfileColorProperty( sceneryPhet, 'water', { default: new Color( 165, 217, 242 ) } ),
  beakerShineFillProperty: new ProfileColorProperty( sceneryPhet, 'beakerShine', { default: new Color( 255, 255, 255, 0.4 ) } ),
  solutionShadowFillProperty: new ProfileColorProperty( sceneryPhet, 'water3DFrontEdgeFill', {
    default: '#8EC6DD'
  } ),
  solutionShineFillProperty: new ProfileColorProperty( sceneryPhet, 'water3DCrescentFill', {
    default: '#B4E5F9'
  } )
};

sceneryPhet.register( 'SceneryPhetColors', SceneryPhetColors );

export default SceneryPhetColors;