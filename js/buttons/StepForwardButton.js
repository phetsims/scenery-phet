// Copyright 2016-2020, University of Colorado Boulder

/**
 * Step forward button.
 *
 * @author Sam Reid
 * @author Chris Malley (PixelZoom, Inc.)
 */

import inherit from '../../../phet-core/js/inherit.js';
import merge from '../../../phet-core/js/merge.js';
import stepForwardSoundPlayer from '../../../tambo/js/shared-sound-players/stepForwardSoundPlayer.js';
import sceneryPhet from '../sceneryPhet.js';
import StepButton from './StepButton.js';

/**
 * @param {Object} [options]
 * @constructor
 */
function StepForwardButton( options ) {

  assert && assert( !options || !options.direction, 'StepForwardButton sets direction' );
  options = merge( {
    direction: 'forward',
    soundPlayer: stepForwardSoundPlayer
  }, options );

  StepButton.call( this, options );
}

sceneryPhet.register( 'StepForwardButton', StepForwardButton );

inherit( StepButton, StepForwardButton );
export default StepForwardButton;