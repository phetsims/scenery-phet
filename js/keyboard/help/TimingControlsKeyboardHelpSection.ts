// Copyright 2022, University of Colorado Boulder

/**
 * Help section that explains how to use a keyboard to toggle play/pause and timing controls.
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import sceneryPhet from '../../sceneryPhet.js';
import KeyboardHelpSection from './KeyboardHelpSection.js';

// strings for this are not translatable until they have been reviewed, see
// https://github.com/phetsims/greenhouse-effect/issues/194
const timingControlsString = 'Timing Controls';
const pauseOrPlayActionString = 'Pause or play action';
const pauseOrPlayActionDescriptionString = 'Pause or play action with Alt key plus K';

class TimingControlsKeyboardHelpSection extends KeyboardHelpSection {

  // TODO https://github.com/phetsims/scenery-phet/issues/762
  // eslint-disable-next-line
  public constructor( providedOptions?: any ) {

    // TODO https://github.com/phetsims/scenery-phet/issues/762
    // eslint-disable-next-line
    const options = optionize<any, EmptySelfOptions, any>()( {
      headingString: timingControlsString,
      pauseOrPlayActionString: pauseOrPlayActionString,
      pauseOrPlayActionDescriptionString: pauseOrPlayActionDescriptionString
    }, providedOptions );

    const playPauseRow = KeyboardHelpSection.createPlayPauseKeyRow( options.pauseOrPlayActionString, {
      labelInnerContent: options.pauseOrPlayActionDescriptionString
    } );

    super( options.headingString, [ playPauseRow ], options );
  }
}

sceneryPhet.register( 'TimingControlsKeyboardHelpSection', TimingControlsKeyboardHelpSection );
export default TimingControlsKeyboardHelpSection;
