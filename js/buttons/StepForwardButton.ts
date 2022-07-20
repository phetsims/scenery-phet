// Copyright 2016-2022, University of Colorado Boulder

/**
 * Step forward button.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import StrictOmit from '../../../phet-core/js/types/StrictOmit.js';
import sceneryPhet from '../sceneryPhet.js';
import StepButton, { StepButtonOptions } from './StepButton.js';

type SelfOptions = EmptySelfOptions;

export type StepForwardButtonOptions = SelfOptions & StrictOmit<StepButtonOptions, 'direction'>;

export default class StepForwardButton extends StepButton {

  public constructor( providedOptions?: StepForwardButtonOptions ) {

    const options = optionize<StepForwardButtonOptions, SelfOptions, StepButtonOptions>()( {

      // StepButtonOptions
      direction: 'forward'
    }, providedOptions );

    super( options );
  }
}

sceneryPhet.register( 'StepForwardButton', StepForwardButton );