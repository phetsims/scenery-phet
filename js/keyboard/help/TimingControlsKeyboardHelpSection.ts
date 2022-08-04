// Copyright 2022, University of Colorado Boulder

/**
 * Help section that explains how to use a keyboard to toggle play/pause and timing controls.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import optionize from '../../../../phet-core/js/optionize.js';
import sceneryPhet from '../../sceneryPhet.js';
import KeyboardHelpSection, { KeyboardHelpSectionOptions } from './KeyboardHelpSection.js';

// constants
// These are not translatable yet until we have decisions made in https://github.com/phetsims/greenhouse-effect/issues/194
const timingControlsString = 'Timing Controls';
const pauseOrPlayActionString = 'Pause or play action';
const pauseOrPlayActionDescriptionString = 'Pause or play action with alt key plus K.';

type SelfOptions = {

  // The heading string for this section of keyboard help content
  headingString?: string;

  // Visible string that describes the action of pause/play from a key command. You may want sim-specific terminology
  // for this command.
  pauseOrPlayActionString?: string;

  // String for the PDOM (screen readers) that describes the hotkeys for play/pause.
  pauseOrPlayActionDescriptionString?: string;
};
type ParentOptions = KeyboardHelpSectionOptions;
export type TimingControlsKeyboardHelpSectionOptions = SelfOptions & ParentOptions;

class TimingControlsKeyboardHelpSection extends KeyboardHelpSection {
  public constructor( providedOptions?: TimingControlsKeyboardHelpSectionOptions ) {
    const options = optionize<TimingControlsKeyboardHelpSectionOptions, SelfOptions, ParentOptions>()( {
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
