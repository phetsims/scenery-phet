// Copyright 2024-2025, University of Colorado Boulder

/**
 * The keyboard help section that describes how to interact with a "spinner".
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import sceneryPhet from '../../sceneryPhet.js';
import SceneryPhetFluent from '../../SceneryPhetFluent.js';
import SliderControlsKeyboardHelpSection, { SliderControlsKeyboardHelpSectionOptions } from './SliderControlsKeyboardHelpSection.js';

const spinnerControlsStringProperty = SceneryPhetFluent.keyboardHelpDialog.spinnerControlsStringProperty;
const spinnerStringProperty = SceneryPhetFluent.keyboardHelpDialog.spinnerStringProperty;

type SelfOptions = EmptySelfOptions;
type ParentOptions = SliderControlsKeyboardHelpSectionOptions;
export type SpinnerControlsKeyboardHelpSectionOptions = SelfOptions & StrictOmit<ParentOptions, 'includeLargerStepsRow'>;

export default class SpinnerControlsKeyboardHelpSection extends SliderControlsKeyboardHelpSection {
  public constructor( providedOptions?: SpinnerControlsKeyboardHelpSectionOptions ) {

    const options = optionize<SpinnerControlsKeyboardHelpSectionOptions, SelfOptions, ParentOptions>()( {
      headingStringProperty: spinnerControlsStringProperty,
      sliderStringProperty: spinnerStringProperty
    }, providedOptions );

    super( options );
  }
}

sceneryPhet.register( 'SpinnerControlsKeyboardHelpSection', SpinnerControlsKeyboardHelpSection );