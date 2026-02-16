// Copyright 2017-2026, University of Colorado Boulder

/**
 * General help information for how to navigation a simulation with a keyboard. In general, this file supports a fair
 * number of options, like displaying group content, or shortcuts for checkbox interaction. The algorithm this type
 * implements set all the optional potential rows as null, and then fills them in if the options is provided. Then at the
 * end anything that is null is filtered out.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import optionize from '../../../../phet-core/js/optionize.js';
import HotkeyData from '../../../../scenery/js/input/HotkeyData.js';
import ResetAllButton from '../../buttons/ResetAllButton.js';
import sceneryPhet from '../../sceneryPhet.js';
import SceneryPhetFluent from '../../SceneryPhetFluent.js';
import NumberKeyNode from '../NumberKeyNode.js';
import KeyboardHelpIconFactory from './KeyboardHelpIconFactory.js';
import KeyboardHelpSection, { KeyboardHelpSectionOptions } from './KeyboardHelpSection.js';
import KeyboardHelpSectionRow from './KeyboardHelpSectionRow.js';

type SelfOptions = {

  // if true, the help content will include information about how to interact with checkboxes
  withCheckboxContent?: boolean;

  // if true, the help content will include information about how to interact with a keypad
  withKeypadContent?: boolean;
};

export type BasicActionsKeyboardHelpSectionOptions = SelfOptions & KeyboardHelpSectionOptions;

export default class BasicActionsKeyboardHelpSection extends KeyboardHelpSection {

  public constructor( providedOptions?: BasicActionsKeyboardHelpSectionOptions ) {

    const options = optionize<BasicActionsKeyboardHelpSectionOptions, SelfOptions, KeyboardHelpSectionOptions>()( {
      withCheckboxContent: false,
      withKeypadContent: false
    }, providedOptions );

    // 'Move to next item or group'
    const moveToNextItemRow = KeyboardHelpSectionRow.fromHotkeyData( new HotkeyData( {
      keys: [ 'tab' ],
      keyboardHelpDialogLabelStringProperty: SceneryPhetFluent.keyboardHelpDialog.moveToNextItemOrGroupStringProperty,
      repoName: sceneryPhet.name
    } ) );

    // 'Move to previous item or group'
    const moveToPreviousItemRow = KeyboardHelpSectionRow.fromHotkeyData( new HotkeyData( {
      keys: [ 'shift+tab' ],
      keyboardHelpDialogLabelStringProperty: SceneryPhetFluent.keyboardHelpDialog.moveToPreviousItemOrGroupStringProperty,
      repoName: sceneryPhet.name
    } ) );

    const moveBetweenItemsInAGroupRow = KeyboardHelpSectionRow.fromHotkeyData( new HotkeyData( {
      keys: [ 'arrowLeft', 'arrowRight', 'arrowUp', 'arrowDown' ],
      keyboardHelpDialogLabelStringProperty: SceneryPhetFluent.keyboardHelpDialog.moveBetweenItemsInAGroupStringProperty,
      repoName: sceneryPhet.name
    } ), { hotkeySetVariant: 'paired' } );

    // 'Press buttons'
    const pressButtonsItemRow = KeyboardHelpSectionRow.fromHotkeyData( new HotkeyData( {
      keys: [ 'space', 'enter' ],
      keyboardHelpDialogLabelStringProperty: SceneryPhetFluent.keyboardHelpDialog.pressButtonsStringProperty,
      repoName: sceneryPhet.name
    } ) );

    // 'Reset All'
    const resetAllRow = KeyboardHelpSectionRow.fromHotkeyData( ResetAllButton.RESET_ALL_HOTKEY_DATA );

    // 'Exit a dialog'
    const exitADialogRow = KeyboardHelpSectionRow.fromHotkeyData( new HotkeyData( {
      keys: [ 'escape' ],
      keyboardHelpDialogLabelStringProperty: SceneryPhetFluent.keyboardHelpDialog.exitADialogStringProperty,
      repoName: sceneryPhet.name
    } ) );

    const content = [
      moveToNextItemRow,
      moveToPreviousItemRow,
      moveBetweenItemsInAGroupRow
    ];

    if ( options.withKeypadContent ) {

      // 'Set values within keypad'
      // NOTE: Not using fromHotkeyData for this one because this is a very custom icon and description and there
      // isn't a hotkey entry in HotkeySetDefinitions that matches this content.
      const zeroToNineIcon = KeyboardHelpIconFactory.iconToIcon( new NumberKeyNode( 0 ), new NumberKeyNode( 9 ) );
      const setValuesInKeypadRow = KeyboardHelpSectionRow.labelWithIcon(
        SceneryPhetFluent.keyboardHelpDialog.setValuesInKeypadStringProperty, zeroToNineIcon, {
          accessibleRowDescriptionProperty: SceneryPhetFluent.a11y.keyboardHelpDialog.general.setValuesInKeypadDescriptionStringProperty
        } );
      content.push( setValuesInKeypadRow );
    }

    // 'Toggle checkboxes'
    if ( options.withCheckboxContent ) {
      const toggleCheckboxes = KeyboardHelpSectionRow.fromHotkeyData( new HotkeyData( {
        keys: [ 'space' ],
        keyboardHelpDialogLabelStringProperty: SceneryPhetFluent.keyboardHelpDialog.toggleCheckboxesStringProperty,
        repoName: sceneryPhet.name
      } ) );
      content.push( toggleCheckboxes );
    }

    // a bit strange, but important for ordering with optional rows
    content.push( ...[
      pressButtonsItemRow,
      resetAllRow,
      exitADialogRow
    ] );

    // order the rows of content
    super( SceneryPhetFluent.keyboardHelpDialog.basicActionsStringProperty, content, options );
  }
}

sceneryPhet.register( 'BasicActionsKeyboardHelpSection', BasicActionsKeyboardHelpSection );
