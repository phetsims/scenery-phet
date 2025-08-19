// Copyright 2024-2025, University of Colorado Boulder

/**
 * FaucetControlsKeyboardHelpSection is the keyboard-help section that describes how to interact with FaucetNode.
 * See https://github.com/phetsims/scenery-phet/issues/839 for design history.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize from '../../../../phet-core/js/optionize.js';
import FaucetNode from '../../FaucetNode.js';
import sceneryPhet from '../../sceneryPhet.js';
import SceneryPhetStrings from '../../SceneryPhetStrings.js';
import ArrowKeyNode from '../ArrowKeyNode.js';
import TextKeyNode from '../TextKeyNode.js';
import KeyboardHelpIconFactory from './KeyboardHelpIconFactory.js';
import KeyboardHelpSection, { KeyboardHelpSectionOptions } from './KeyboardHelpSection.js';
import KeyboardHelpSectionRow from './KeyboardHelpSectionRow.js';

const headingStringProperty = SceneryPhetStrings.keyboardHelpDialog.faucetControls.faucetControlsStringProperty;
const adjustFaucetFlowStringProperty = SceneryPhetStrings.keyboardHelpDialog.faucetControls.adjustFaucetFlowStringProperty;
const adjustInSmallerStepsStringProperty = SceneryPhetStrings.keyboardHelpDialog.faucetControls.adjustInSmallerStepsStringProperty;
const adjustInLargerStepsStringProperty = SceneryPhetStrings.keyboardHelpDialog.faucetControls.adjustInLargerStepsStringProperty;
const openFaucetFullyStringProperty = SceneryPhetStrings.keyboardHelpDialog.faucetControls.openFaucetFullyStringProperty;
const openFaucetBrieflyStringProperty = SceneryPhetStrings.keyboardHelpDialog.faucetControls.openFaucetBrieflyStringProperty;

type SelfOptions = {
  tapToDispenseEnabled?: boolean; // Set this to true if any faucet in your sim has FaucetNodeOptions.tapToDispenseEnabled: true
  reverseAlternativeInput?: boolean; // Set this to true if your faucet Node reverses alternative input (because it faces left).
};

type FaucetControlsKeyboardHelpSectionOptions = SelfOptions & KeyboardHelpSectionOptions;

export default class FaucetControlsKeyboardHelpSection extends KeyboardHelpSection {

  public constructor( providedOptions?: FaucetControlsKeyboardHelpSectionOptions ) {

    const options = optionize<FaucetControlsKeyboardHelpSectionOptions, SelfOptions, KeyboardHelpSectionOptions>()( {

      // SelfOptions
      tapToDispenseEnabled: false,
      reverseAlternativeInput: false
    }, providedOptions );

    const leftRightArrowKeysIcon = KeyboardHelpIconFactory.iconRow( [ new ArrowKeyNode( 'left' ), new ArrowKeyNode( 'right' ) ] );

    // Adjust faucet flow [<] [>]
    const adjustFaucetFlowRow = KeyboardHelpSectionRow.labelWithIcon( adjustFaucetFlowStringProperty, leftRightArrowKeysIcon, {
      labelInnerContent: SceneryPhetStrings.a11y.keyboardHelpDialog.faucetControls.adjustFaucetFlowDescriptionStringProperty
    } );

    // Adjust in smaller steps [Shift] + [<] [>]
    const adjustInSmallerStepsRow = KeyboardHelpSectionRow.labelWithIcon(
      adjustInSmallerStepsStringProperty,
      KeyboardHelpIconFactory.shiftPlusIcon( leftRightArrowKeysIcon ),
      {
        labelInnerContent: SceneryPhetStrings.a11y.keyboardHelpDialog.faucetControls.adjustInSmallerStepsDescriptionStringProperty
      }
    );

    // Adjust in larger steps [Pg Up] [Pg Down]
    const adjustInLargerStepsRow = KeyboardHelpSectionRow.labelWithIcon(
      adjustInLargerStepsStringProperty,
      KeyboardHelpIconFactory.pageUpPageDownRowIcon(),
      {
        labelInnerContent: SceneryPhetStrings.a11y.keyboardHelpDialog.faucetControls.adjustInLargerStepsDescriptionStringProperty
      }
    );

    let closeFaucetRow: KeyboardHelpSectionRow;
    let openFaucetFullyRow: KeyboardHelpSectionRow;
    if ( options.reverseAlternativeInput ) {

      // Close faucet [End] or [0]
      closeFaucetRow = KeyboardHelpSectionRow.fromHotkeyData( FaucetNode.CLOSE_FAUCET_REVERSED_HOTKEY_DATA );

      // Open faucet fully [Home]
      openFaucetFullyRow = KeyboardHelpSectionRow.labelWithIcon( openFaucetFullyStringProperty, TextKeyNode.home(), {
        labelInnerContent: SceneryPhetStrings.a11y.keyboardHelpDialog.faucetControls.openFaucetFullyWithHomeDescriptionStringProperty
      } );
    }
    else {

      // Close faucet [Home] or [0]
      closeFaucetRow = KeyboardHelpSectionRow.fromHotkeyData( FaucetNode.CLOSE_FAUCET_HOTKEY_DATA );

      // Open faucet fully [End]
      openFaucetFullyRow = KeyboardHelpSectionRow.labelWithIcon( openFaucetFullyStringProperty, TextKeyNode.end(), {
        labelInnerContent: SceneryPhetStrings.a11y.keyboardHelpDialog.faucetControls.openFaucetFullyDescriptionStringProperty
      } );
    }

    const content: KeyboardHelpSectionRow[] = [
      adjustFaucetFlowRow,
      adjustInSmallerStepsRow,
      adjustInLargerStepsRow,
      closeFaucetRow,
      openFaucetFullyRow
    ];

    // Open faucet briefly [Space] or [Enter]
    if ( options.tapToDispenseEnabled ) {
      const openFaucetBrieflyRow = KeyboardHelpSectionRow.labelWithIcon(
        openFaucetBrieflyStringProperty,
        KeyboardHelpIconFactory.iconOrIcon( TextKeyNode.space(), TextKeyNode.enter() ),
        {
          labelInnerContent: SceneryPhetStrings.a11y.keyboardHelpDialog.faucetControls.openFaucetBrieflyDescriptionStringProperty
        }
      );
      content.push( openFaucetBrieflyRow );
    }

    super( headingStringProperty, content, options );
  }
}

sceneryPhet.register( 'FaucetControlsKeyboardHelpSection', FaucetControlsKeyboardHelpSection );