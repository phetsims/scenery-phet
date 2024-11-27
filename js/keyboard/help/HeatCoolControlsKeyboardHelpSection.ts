// Copyright 2024, University of Colorado Boulder

/**
 * The keyboard help section that describes how to interact with a HeaterCoolerNode.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import sceneryPhet from '../../sceneryPhet.js';
import SceneryPhetStrings from '../../SceneryPhetStrings.js';
import NumberKeyNode from '../NumberKeyNode.js';
import KeyboardHelpSectionRow from './KeyboardHelpSectionRow.js';
import SliderControlsKeyboardHelpSection, { ArrowKeyIconDisplay, SliderControlsKeyboardHelpSectionOptions } from './SliderControlsKeyboardHelpSection.js';

type SelfOptions = EmptySelfOptions;
type ParentOptions = SliderControlsKeyboardHelpSectionOptions;
export type HeatCoolControlsKeyboardHelpSectionOptions = SelfOptions & ParentOptions;

export default class HeatCoolControlsKeyboardHelpSection extends SliderControlsKeyboardHelpSection {
  public constructor( providedOptions?: HeatCoolControlsKeyboardHelpSectionOptions ) {

    const offIcon = new NumberKeyNode( 0 );
    const offStringRow = KeyboardHelpSectionRow.labelWithIcon( SceneryPhetStrings.keyboardHelpDialog.heatCoolOffStringProperty, offIcon );

    const options = optionize<HeatCoolControlsKeyboardHelpSectionOptions, SelfOptions, ParentOptions>()( {
      arrowKeyIconDisplay: ArrowKeyIconDisplay.UP_DOWN,

      headingStringProperty: SceneryPhetStrings.keyboardHelpDialog.heatCoolControlsStringProperty,
      jumpToMaximumStringProperty: SceneryPhetStrings.keyboardHelpDialog.maximumHeatStringProperty,
      jumpToMinimumStringProperty: SceneryPhetStrings.keyboardHelpDialog.maximumCoolStringProperty,

      additionalRows: [
        offStringRow
      ]
    }, providedOptions );

    super( options );
  }
}

sceneryPhet.register( 'HeatCoolControlsKeyboardHelpSection', HeatCoolControlsKeyboardHelpSection );