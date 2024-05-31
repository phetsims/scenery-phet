// Copyright 2020-2022, University of Colorado Boulder

/**
 * Reusable constants for components of scenery-phet.
 *
 * @author Jesse Greenberg
 */

import sceneryPhet from './sceneryPhet.js';


const SceneryPhetConstants = {

  // default radius for various round buttons to ensure they are generally the same size
  DEFAULT_BUTTON_RADIUS: 20.8,

  // default radius for PlayControlButton and its subtypes
  PLAY_CONTROL_BUTTON_RADIUS: 28,

  DEFAULT_DRAG_CLIP_OPTIONS: { initialOutputLevel: 0.4 },
  DEFAULT_GRAB_SOUND_GENERATOR_ADD_OPTIONS: { categoryName: 'user-interface' }
};
sceneryPhet.register( 'SceneryPhetConstants', SceneryPhetConstants );
export default SceneryPhetConstants;