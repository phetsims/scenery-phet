// Copyright 2014-2020, University of Colorado Boulder

/**
 * Step backward button.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import inherit from '../../../phet-core/js/inherit.js';
import merge from '../../../phet-core/js/merge.js';
import stepBackwardSoundPlayer from '../../../tambo/js/shared-sound-players/stepBackwardSoundPlayer.js';
import sceneryPhet from '../sceneryPhet.js';
import StepButton from './StepButton.js';

/**
 * @param {Object} [options]
 * @constructor
 */
function StepBackwardButton( options ) {

  assert && assert( !options || !options.direction, 'StepBackwardButton sets direction' );
  options = merge( {
    direction: 'backward',
    soundPlayer: stepBackwardSoundPlayer
  }, options );

  StepButton.call( this, options );
}

sceneryPhet.register( 'StepBackwardButton', StepBackwardButton );

inherit( StepButton, StepBackwardButton );
export default StepBackwardButton;