// Copyright 2014-2022, University of Colorado Boulder

/**
 * Step backward button.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize from '../../../phet-core/js/optionize.js';
import stepBackwardSoundPlayer from '../../../tambo/js/shared-sound-players/stepBackwardSoundPlayer.js';
import sceneryPhet from '../sceneryPhet.js';
import StepButton, { StepButtonOptions } from './StepButton.js';

type SelfOptions = {};

export type StepBackwardButtonOptions = SelfOptions & Omit<StepButtonOptions, 'direction'>;

export default class StepBackwardButton extends StepButton {

  constructor( providedOptions?: StepBackwardButtonOptions ) {

    assert && assert( !providedOptions || !providedOptions.direction, 'StepBackwardButton sets direction' );

    const options = optionize<StepBackwardButtonOptions, SelfOptions, StepButtonOptions>( {

      // StepButtonOptions
      direction: 'backward',
      soundPlayer: stepBackwardSoundPlayer
    }, providedOptions );

    super( options );
  }
}

sceneryPhet.register( 'StepBackwardButton', StepBackwardButton );