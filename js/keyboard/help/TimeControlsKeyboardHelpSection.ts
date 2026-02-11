// Copyright 2022-2026, University of Colorado Boulder

/**
 * Help section that explains how to use a keyboard to toggle play/pause and time controls.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PlayControlButton from '../../buttons/PlayControlButton.js';
import sceneryPhet from '../../sceneryPhet.js';
import SceneryPhetFluent from '../../SceneryPhetFluent.js';
import KeyboardHelpSection, { KeyboardHelpSectionOptions } from './KeyboardHelpSection.js';
import KeyboardHelpSectionRow from './KeyboardHelpSectionRow.js';

// constants
const timeControlsStringProperty = SceneryPhetFluent.keyboardHelpDialog.timingControls.timingControlsStringProperty;

type SelfOptions = {

  // The heading string for this section of keyboard help content
  headingString?: string | TReadOnlyProperty<string>;
};
type ParentOptions = KeyboardHelpSectionOptions;
export type TimeControlKeyboardHelpSectionOptions = SelfOptions & ParentOptions;

class TimeControlsKeyboardHelpSection extends KeyboardHelpSection {
  public constructor( providedOptions?: TimeControlKeyboardHelpSectionOptions ) {
    const options = optionize<TimeControlKeyboardHelpSectionOptions, SelfOptions, ParentOptions>()( {
      headingString: timeControlsStringProperty
    }, providedOptions );

    const playPauseRow = KeyboardHelpSectionRow.fromHotkeyData( PlayControlButton.TOGGLE_PLAY_HOTKEY_DATA );

    super( options.headingString, [ playPauseRow ], options );
  }
}

sceneryPhet.register( 'TimeControlsKeyboardHelpSection', TimeControlsKeyboardHelpSection );
export default TimeControlsKeyboardHelpSection;