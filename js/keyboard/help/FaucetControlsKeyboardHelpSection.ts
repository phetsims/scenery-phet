// Copyright 2024, University of Colorado Boulder

/**
 * FaucetControlsKeyboardHelpSection is the keyboard-help section that describes how to interact with FaucetNode.
 * See https://github.com/phetsims/scenery-phet/issues/839 for design history.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import sceneryPhet from '../../sceneryPhet.js';
import KeyboardHelpSection, { KeyboardHelpSectionOptions } from './KeyboardHelpSection.js';
import SceneryPhetStrings from '../../SceneryPhetStrings.js';
import KeyboardHelpSectionRow from './KeyboardHelpSectionRow.js';
import ArrowKeyNode from '../ArrowKeyNode.js';
import KeyboardHelpIconFactory from './KeyboardHelpIconFactory.js';
import TextKeyNode from '../TextKeyNode.js';
import NumberKeyNode from '../NumberKeyNode.js';
import optionize from '../../../../phet-core/js/optionize.js';

const headingStringProperty = SceneryPhetStrings.keyboardHelpDialog.faucetControls.faucetControlsStringProperty;
const adjustFaucetFlowStringProperty = SceneryPhetStrings.keyboardHelpDialog.faucetControls.adjustFaucetFlowStringProperty;
const adjustInSmallerStepsStringProperty = SceneryPhetStrings.keyboardHelpDialog.faucetControls.adjustInSmallerStepsStringProperty;
const adjustInLargerStepsStringProperty = SceneryPhetStrings.keyboardHelpDialog.faucetControls.adjustInLargerStepsStringProperty;
const closeFaucetStringProperty = SceneryPhetStrings.keyboardHelpDialog.faucetControls.closeFaucetStringProperty;
const openFaucetFullyStringProperty = SceneryPhetStrings.keyboardHelpDialog.faucetControls.openFaucetFullyStringProperty;
const openFaucetBrieflyStringProperty = SceneryPhetStrings.keyboardHelpDialog.faucetControls.openFaucetBrieflyStringProperty;

type SelfOptions = {
  tapToDispenseEnabled?: boolean; // Set this to true if any faucet in your sim has FaucetNodeOptions.tapToDispenseEnabled: true
};

type FaucetControlsKeyboardHelpSectionOptions = SelfOptions & KeyboardHelpSectionOptions;

export default class FaucetControlsKeyboardHelpSection extends KeyboardHelpSection {

  public constructor( providedOptions?: FaucetControlsKeyboardHelpSectionOptions ) {

    const options = optionize<FaucetControlsKeyboardHelpSectionOptions, SelfOptions, KeyboardHelpSectionOptions>()( {

      // SelfOptions
      tapToDispenseEnabled: false
    }, providedOptions );

    const leftRightArrowKeysIcon = KeyboardHelpIconFactory.iconRow( [ new ArrowKeyNode( 'left' ), new ArrowKeyNode( 'right' ) ] );

    // Adjust faucet flow [<] [>]
    const adjustFaucetFlowRow = KeyboardHelpSectionRow.labelWithIcon( adjustFaucetFlowStringProperty, leftRightArrowKeysIcon );

    // Adjust in smaller steps [Shift] + [<] [>]
    const adjustInSmallerStepsRow = KeyboardHelpSectionRow.labelWithIcon( adjustInSmallerStepsStringProperty,
      KeyboardHelpIconFactory.shiftPlusIcon( leftRightArrowKeysIcon ) );

    // Adjust in larger steps [Pg Up] [Pg Down]
    const adjustInLargerStepsRow = KeyboardHelpSectionRow.labelWithIcon( adjustInLargerStepsStringProperty,
      KeyboardHelpIconFactory.pageUpPageDownRowIcon() );

    // Close faucet [Home] or [0]
    const closeFaucetRow = KeyboardHelpSectionRow.labelWithIcon( closeFaucetStringProperty,
      KeyboardHelpIconFactory.iconOrIcon( TextKeyNode.home(), new NumberKeyNode( 0 ) ) );

    // Open faucet fully [End]
    const openFaucetFullyRow = KeyboardHelpSectionRow.labelWithIcon( openFaucetFullyStringProperty, TextKeyNode.end() );

    const content: KeyboardHelpSectionRow[] = [
      adjustFaucetFlowRow,
      adjustInSmallerStepsRow,
      adjustInLargerStepsRow,
      closeFaucetRow,
      openFaucetFullyRow
    ];

    // Open faucet briefly [Space] or [Enter]
    if ( options.tapToDispenseEnabled ) {
      const openFaucetBrieflyRow = KeyboardHelpSectionRow.labelWithIcon( openFaucetBrieflyStringProperty,
        KeyboardHelpIconFactory.iconOrIcon( TextKeyNode.space(), TextKeyNode.enter() ) );
      content.push( openFaucetBrieflyRow );
    }

    super( headingStringProperty, content, options );
  }
}

sceneryPhet.register( 'FaucetControlsKeyboardHelpSection', FaucetControlsKeyboardHelpSection );