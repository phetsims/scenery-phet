// Copyright 2024-2026, University of Colorado Boulder

/**
 * FaucetControlsKeyboardHelpSection is the keyboard-help section that describes how to interact with FaucetNode.
 * See https://github.com/phetsims/scenery-phet/issues/839 for design history.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize from '../../../../phet-core/js/optionize.js';
import HotkeyData from '../../../../scenery/js/input/HotkeyData.js';
import FaucetNode from '../../FaucetNode.js';
import sceneryPhet from '../../sceneryPhet.js';
import SceneryPhetFluent from '../../SceneryPhetFluent.js';
import KeyboardHelpSection, { KeyboardHelpSectionOptions } from './KeyboardHelpSection.js';
import KeyboardHelpSectionRow from './KeyboardHelpSectionRow.js';

const headingStringProperty = SceneryPhetFluent.keyboardHelpDialog.faucetControls.faucetControlsStringProperty;
const adjustFaucetFlowStringProperty = SceneryPhetFluent.keyboardHelpDialog.faucetControls.adjustFaucetFlowStringProperty;
const adjustInSmallerStepsStringProperty = SceneryPhetFluent.keyboardHelpDialog.faucetControls.adjustInSmallerStepsStringProperty;
const adjustInLargerStepsStringProperty = SceneryPhetFluent.keyboardHelpDialog.faucetControls.adjustInLargerStepsStringProperty;
const openFaucetFullyStringProperty = SceneryPhetFluent.keyboardHelpDialog.faucetControls.openFaucetFullyStringProperty;

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

    // Adjust faucet flow [<] [>]
    const adjustFaucetFlowRow = KeyboardHelpSectionRow.fromHotkeyData( new HotkeyData( {
      keys: [ 'arrowLeft', 'arrowRight' ],
      keyboardHelpDialogLabelStringProperty: adjustFaucetFlowStringProperty,
      repoName: sceneryPhet.name
    } ) );

    // Adjust in smaller steps [Shift] + [<] [>]
    const adjustInSmallerStepsRow = KeyboardHelpSectionRow.fromHotkeyData( new HotkeyData( {
      keys: [ 'shift+arrowLeft', 'shift+arrowRight' ],
      keyboardHelpDialogLabelStringProperty: adjustInSmallerStepsStringProperty,
      repoName: sceneryPhet.name
    } ) );

    // Adjust in larger steps [Pg Up] [Pg Down]
    const adjustInLargerStepsRow = KeyboardHelpSectionRow.fromHotkeyData( new HotkeyData( {
      keys: [ 'pageUp', 'pageDown' ],
      keyboardHelpDialogLabelStringProperty: adjustInLargerStepsStringProperty,
      repoName: sceneryPhet.name
    } ) );

    let closeFaucetRow: KeyboardHelpSectionRow;
    let openFaucetFullyRow: KeyboardHelpSectionRow;
    if ( options.reverseAlternativeInput ) {

      // Close faucet [End] or [0]
      closeFaucetRow = KeyboardHelpSectionRow.fromHotkeyData( FaucetNode.CLOSE_FAUCET_REVERSED_HOTKEY_DATA );

      // Open faucet fully [Home]
      openFaucetFullyRow = KeyboardHelpSectionRow.fromHotkeyData( new HotkeyData( {
        keys: [ 'home' ],
        keyboardHelpDialogLabelStringProperty: openFaucetFullyStringProperty,
        repoName: sceneryPhet.name
      } ) );
    }
    else {

      // Close faucet [Home] or [0]
      closeFaucetRow = KeyboardHelpSectionRow.fromHotkeyData( FaucetNode.CLOSE_FAUCET_HOTKEY_DATA );

      // Open faucet fully [End]
      openFaucetFullyRow = KeyboardHelpSectionRow.fromHotkeyData( new HotkeyData( {
        keys: [ 'end' ],
        keyboardHelpDialogLabelStringProperty: openFaucetFullyStringProperty,
        repoName: sceneryPhet.name
      } ) );
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
      const openFaucetBrieflyRow = KeyboardHelpSectionRow.fromHotkeyData( FaucetNode.TAP_TO_DISPENSE_HOTKEY_DATA );
      content.push( openFaucetBrieflyRow );
    }

    super( headingStringProperty, content, options );
  }
}

sceneryPhet.register( 'FaucetControlsKeyboardHelpSection', FaucetControlsKeyboardHelpSection );