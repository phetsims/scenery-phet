// Copyright 2022-2025, University of Colorado Boulder

/**
 * Help section that explains how to use a keyboard to toggle play/pause and time controls.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';
import platform from '../../../../phet-core/js/platform.js';
import PlayControlButton from '../../buttons/PlayControlButton.js';
import sceneryPhet from '../../sceneryPhet.js';
import SceneryPhetStrings from '../../SceneryPhetStrings.js';
import KeyboardHelpSection, { KeyboardHelpSectionOptions } from './KeyboardHelpSection.js';
import KeyboardHelpSectionRow from './KeyboardHelpSectionRow.js';

// constants
const timeControlsStringProperty = SceneryPhetStrings.keyboardHelpDialog.timingControls.timingControlsStringProperty;
const pauseOrPlayActionStringProperty = SceneryPhetStrings.keyboardHelpDialog.timingControls.pauseOrPlayActionStringProperty;
const pauseOrPlayActionDescriptionStringProperty = SceneryPhetStrings.a11y.keyboardHelpDialog.timingControls.pauseOrPlayActionDescriptionStringProperty;
const pauseOrPlayActionMacOSDescriptionStringProperty = SceneryPhetStrings.a11y.keyboardHelpDialog.timingControls.pauseOrPlayActionMacOSDescriptionStringProperty;

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


    const playPauseRow = KeyboardHelpSectionRow.fromHotkeyData( PlayControlButton.TOGGLE_PLAY_HOTKEY_DATA, {
      labelStringProperty: pauseOrPlayActionStringProperty,

      // A unique description for mac since the modifier key is different
      pdomLabelStringProperty: platform.mac ? pauseOrPlayActionMacOSDescriptionStringProperty : pauseOrPlayActionDescriptionStringProperty
    } );

    super( options.headingString, [ playPauseRow ], options );
  }
}

sceneryPhet.register( 'TimeControlsKeyboardHelpSection', TimeControlsKeyboardHelpSection );
export default TimeControlsKeyboardHelpSection;