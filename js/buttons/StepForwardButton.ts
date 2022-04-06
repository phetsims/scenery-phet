// Copyright 2016-2022, University of Colorado Boulder

/**
 * Step forward button.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize from '../../../phet-core/js/optionize.js';
import sceneryPhet from '../sceneryPhet.js';
import StepButton, { StepButtonOptions } from './StepButton.js';

type SelfOptions = {};

export type StepForwardButtonOptions = SelfOptions & Omit<StepButtonOptions, 'direction'>;

export default class StepForwardButton extends StepButton {

  constructor( providedOptions?: StepForwardButtonOptions ) {

    assert && assert( !providedOptions || !providedOptions.direction, 'StepForwardButton sets direction' );

    const options = optionize<StepForwardButtonOptions, SelfOptions, StepButtonOptions>( {

      // StepButtonOptions
      direction: 'forward'
    }, providedOptions );

    super( options );
  }
}

sceneryPhet.register( 'StepForwardButton', StepForwardButton );