// Copyright 2016-2026, University of Colorado Boulder

/**
 * Step forward button.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import sharedSoundPlayers from '../../../tambo/js/sharedSoundPlayers.js';
import sceneryPhet from '../sceneryPhet.js';
import SceneryPhetFluent from '../SceneryPhetFluent.js';
import StepButton, { StepButtonOptions } from './StepButton.js';

type SelfOptions = EmptySelfOptions;

export type StepForwardButtonOptions = SelfOptions & StepButtonOptions;

export default class StepForwardButton extends StepButton {

  public constructor( providedOptions?: StepForwardButtonOptions ) {

    const options = optionize<StepForwardButtonOptions, SelfOptions, StepButtonOptions>()( {
      accessibleName: SceneryPhetFluent.a11y.stepForwardButton.accessibleNameStringProperty,
      accessibleContextResponse: SceneryPhetFluent.a11y.stepForwardButton.accessibleContextResponseStringProperty,
      soundPlayer: sharedSoundPlayers.get( 'stepForward' )
    }, providedOptions );

    super( 'forward', options );
  }
}

sceneryPhet.register( 'StepForwardButton', StepForwardButton );