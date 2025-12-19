// Copyright 2024-2025, University of Colorado Boulder

/**
 * The keyboard help section that describes how to interact with a HeaterCoolerNode.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import sceneryPhet from '../../sceneryPhet.js';
import SceneryPhetFluent from '../../SceneryPhetFluent.js';
import NumberKeyNode from '../NumberKeyNode.js';
import KeyboardHelpSectionRow from './KeyboardHelpSectionRow.js';
import SliderControlsKeyboardHelpSection, { ArrowKeyIconDisplay, SliderControlsKeyboardHelpSectionOptions } from './SliderControlsKeyboardHelpSection.js';

type SelfOptions = EmptySelfOptions;
type ParentOptions = SliderControlsKeyboardHelpSectionOptions;
export type HeatCoolControlsKeyboardHelpSectionOptions = SelfOptions & ParentOptions;

export default class HeatCoolControlsKeyboardHelpSection extends SliderControlsKeyboardHelpSection {
  public constructor( providedOptions?: HeatCoolControlsKeyboardHelpSectionOptions ) {

    const offIcon = new NumberKeyNode( 0 );
    const offStringRow = KeyboardHelpSectionRow.labelWithIcon( SceneryPhetFluent.keyboardHelpDialog.heatCoolOffStringProperty, offIcon );

    const options = optionize<HeatCoolControlsKeyboardHelpSectionOptions, SelfOptions, ParentOptions>()( {
      arrowKeyIconDisplay: ArrowKeyIconDisplay.UP_DOWN,

      headingStringProperty: SceneryPhetFluent.keyboardHelpDialog.heatCoolControlsStringProperty,
      jumpToMaximumStringProperty: SceneryPhetFluent.keyboardHelpDialog.maximumHeatStringProperty,
      jumpToMinimumStringProperty: SceneryPhetFluent.keyboardHelpDialog.maximumCoolStringProperty,

      additionalRows: [
        offStringRow
      ]
    }, providedOptions );

    super( options );
  }
}

sceneryPhet.register( 'HeatCoolControlsKeyboardHelpSection', HeatCoolControlsKeyboardHelpSection );