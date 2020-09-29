// Copyright 2014-2020, University of Colorado Boulder

/**
 * Step backward button.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../phet-core/js/merge.js';
import stepBackwardSoundPlayer from '../../../tambo/js/shared-sound-players/stepBackwardSoundPlayer.js';
import sceneryPhet from '../sceneryPhet.js';
import StepButton from './StepButton.js';

class StepBackwardButton extends StepButton {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    assert && assert( !options || !options.direction, 'StepBackwardButton sets direction' );
    options = merge( {
      direction: 'backward',
      soundPlayer: stepBackwardSoundPlayer
    }, options );

    super( options );
  }
}

sceneryPhet.register( 'StepBackwardButton', StepBackwardButton );
export default StepBackwardButton;