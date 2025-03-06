// Copyright 2022-2025, University of Colorado Boulder

/**
 * Help section that explains how to use a keyboard to toggle play/pause and time controls.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PlayControlButton from '../../buttons/PlayControlButton.js';
import sceneryPhet from '../../sceneryPhet.js';
import SceneryPhetStrings from '../../SceneryPhetStrings.js';
import KeyboardHelpSection, { KeyboardHelpSectionOptions } from './KeyboardHelpSection.js';
import KeyboardHelpSectionRow from './KeyboardHelpSectionRow.js';

// constants
const timeControlsStringProperty = SceneryPhetStrings.keyboardHelpDialog.timingControls.timingControlsStringProperty;
const pauseOrPlayActionStringProperty = SceneryPhetStrings.keyboardHelpDialog.timingControls.pauseOrPlayActionStringProperty;
const pauseOrPlayActionDescriptionStringProperty = SceneryPhetStrings.a11y.keyboardHelpDialog.timingControls.pauseOrPlayActionDescriptionStringProperty;

type SelfOptions = {

  // The heading string for this section of keyboard help content
  headingString?: string | TReadOnlyProperty<string>;

  // Visible string that describes the action of pause/play from a key command. You may want sim-specific terminology
  // for this command.
  pauseOrPlayActionStringProperty?: TReadOnlyProperty<string>;

  // String for the PDOM (screen readers) that describes the hotkeys for play/pause.
  pauseOrPlayActionDescriptionString?: string | TReadOnlyProperty<string>;
};
type ParentOptions = KeyboardHelpSectionOptions;
export type TimeControlKeyboardHelpSectionOptions = SelfOptions & ParentOptions;

class TimeControlsKeyboardHelpSection extends KeyboardHelpSection {
  public constructor( providedOptions?: TimeControlKeyboardHelpSectionOptions ) {
    const options = optionize<TimeControlKeyboardHelpSectionOptions, SelfOptions, ParentOptions>()( {
      headingString: timeControlsStringProperty,
      pauseOrPlayActionStringProperty: pauseOrPlayActionStringProperty,
      pauseOrPlayActionDescriptionString: pauseOrPlayActionDescriptionStringProperty
    }, providedOptions );


    const playPauseRow = KeyboardHelpSectionRow.fromHotkeyData( PlayControlButton.TOGGLE_PLAY_HOTKEY_DATA, {
      labelStringProperty: options.pauseOrPlayActionStringProperty,
      pdomLabelStringProperty: options.pauseOrPlayActionDescriptionString
    } );

    super( options.headingString, [ playPauseRow ], options );
  }
}

sceneryPhet.register( 'TimeControlsKeyboardHelpSection', TimeControlsKeyboardHelpSection );
export default TimeControlsKeyboardHelpSection;