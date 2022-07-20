// Copyright 2014-2022, University of Colorado Boulder

/**
 * Step backward button.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import StrictOmit from '../../../phet-core/js/types/StrictOmit.js';
import stepBackwardSoundPlayer from '../../../tambo/js/shared-sound-players/stepBackwardSoundPlayer.js';
import sceneryPhet from '../sceneryPhet.js';
import StepButton, { StepButtonOptions } from './StepButton.js';

type SelfOptions = EmptySelfOptions;

export type StepBackwardButtonOptions = SelfOptions & StrictOmit<StepButtonOptions, 'direction'>;

export default class StepBackwardButton extends StepButton {

  public constructor( providedOptions?: StepBackwardButtonOptions ) {

    const options = optionize<StepBackwardButtonOptions, SelfOptions, StepButtonOptions>()( {

      // StepButtonOptions
      direction: 'backward',
      soundPlayer: stepBackwardSoundPlayer
    }, providedOptions );

    super( options );
  }
}

sceneryPhet.register( 'StepBackwardButton', StepBackwardButton );