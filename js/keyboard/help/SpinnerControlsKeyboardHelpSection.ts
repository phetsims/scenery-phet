// Copyright 2024, University of Colorado Boulder

/**
 * The keyboard help section that describes how to interact with a "spinner".
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import sceneryPhet from '../../sceneryPhet.js';
import SceneryPhetStrings from '../../SceneryPhetStrings.js';
import SliderControlsKeyboardHelpSection, { SliderControlsKeyboardHelpSectionOptions } from './SliderControlsKeyboardHelpSection.js';

const spinnerControlsStringProperty = SceneryPhetStrings.keyboardHelpDialog.spinnerControlsStringProperty;
const spinnerStringProperty = SceneryPhetStrings.keyboardHelpDialog.spinnerStringProperty;

type SelfOptions = EmptySelfOptions;
type ParentOptions = SliderControlsKeyboardHelpSectionOptions;
export type SpinnerControlsKeyboardHelpSectionOptions = SelfOptions & ParentOptions;

export default class SpinnerControlsKeyboardHelpSection extends SliderControlsKeyboardHelpSection {
  public constructor( providedOptions?: SpinnerControlsKeyboardHelpSectionOptions ) {

    const options = optionize<SpinnerControlsKeyboardHelpSectionOptions, SelfOptions, ParentOptions>()( {
      headingStringProperty: spinnerControlsStringProperty,
      sliderStringProperty: spinnerStringProperty,

      // PhET 'spinners' usually do not support larger steps with the page up/page down keys.
      includeLargerStepsRow: false
    }, providedOptions );

    super( options );
  }
}

sceneryPhet.register( 'SpinnerControlsKeyboardHelpSection', SpinnerControlsKeyboardHelpSection );