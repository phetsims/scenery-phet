// Copyright 2014-2026, University of Colorado Boulder

/**
 * Step backward button.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import sharedSoundPlayers from '../../../tambo/js/sharedSoundPlayers.js';
import sceneryPhet from '../sceneryPhet.js';
import SceneryPhetFluent from '../SceneryPhetFluent.js';
import StepButton, { StepButtonOptions } from './StepButton.js';

type SelfOptions = EmptySelfOptions;

export type StepBackwardButtonOptions = SelfOptions & StepButtonOptions;

export default class StepBackwardButton extends StepButton {

  public constructor( providedOptions?: StepBackwardButtonOptions ) {
    const options = optionize<StepBackwardButtonOptions, SelfOptions, StepButtonOptions>()( {
      accessibleName: SceneryPhetFluent.a11y.stepBackwardButton.accessibleNameStringProperty,
      accessibleContextResponse: SceneryPhetFluent.a11y.stepBackwardButton.accessibleContextResponseStringProperty,
      soundPlayer: sharedSoundPlayers.get( 'stepBackward' )
    }, providedOptions );

    super( 'backward', options );
  }
}

sceneryPhet.register( 'StepBackwardButton', StepBackwardButton );