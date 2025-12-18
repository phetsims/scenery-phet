// Copyright 2017-2025, University of Colorado Boulder

/**
 * General help information for how to navigation a simulation with a keyboard. In general, this file supports a fair
 * number of options, like displaying group content, or shortcuts for checkbox interaction. The algorithm this type
 * implements set all the optional potential rows as null, and then fills them in if the options is provided. Then at the
 * end anything that is null is filtered out.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';
import ResetAllButton from '../../buttons/ResetAllButton.js';
import sceneryPhet from '../../sceneryPhet.js';
import SceneryPhetFluent from '../../SceneryPhetFluent.js';
import NumberKeyNode from '../NumberKeyNode.js';
import TextKeyNode from '../TextKeyNode.js';
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
    const tabKeyNode = TextKeyNode.tab();
    const moveToNextItemRow = KeyboardHelpSectionRow.labelWithIcon(
      SceneryPhetFluent.keyboardHelpDialog.moveToNextItemOrGroupStringProperty,
      tabKeyNode, {
        labelInnerContent: SceneryPhetFluent.a11y.keyboardHelpDialog.general.tabGroupDescriptionStringProperty
      } );

    // 'Move to previous item or group'
    const shiftPlusTabIcon = KeyboardHelpIconFactory.shiftPlusIcon( tabKeyNode );
    const moveToPreviousItemRow = KeyboardHelpSectionRow.labelWithIcon(
      SceneryPhetFluent.keyboardHelpDialog.moveToPreviousItemOrGroupStringProperty,
      shiftPlusTabIcon, {
        labelInnerContent: SceneryPhetFluent.a11y.keyboardHelpDialog.general.shiftTabGroupDescriptionStringProperty
      } );

    // 'Move between items in a group'
    const leftRightArrowsIcon = KeyboardHelpIconFactory.leftRightArrowKeysRowIcon();
    const upDownArrowsIcon = KeyboardHelpIconFactory.upDownArrowKeysRowIcon();
    const arrowsIcon = KeyboardHelpIconFactory.iconOrIcon( leftRightArrowsIcon, upDownArrowsIcon );
    const moveBetweenItemsInAGroupRow = KeyboardHelpSectionRow.labelWithIcon(
      SceneryPhetFluent.keyboardHelpDialog.moveBetweenItemsInAGroupStringProperty,
      arrowsIcon, {
        labelInnerContent: SceneryPhetFluent.a11y.keyboardHelpDialog.general.groupNavigationDescriptionStringProperty
      } );

    // 'Press buttons'
    const spaceKeyNode = TextKeyNode.space();
    const enterKeyNode = TextKeyNode.enter();
    const spaceOrEnterIcon = KeyboardHelpIconFactory.iconOrIcon( spaceKeyNode, enterKeyNode );
    const pressButtonsItemRow = KeyboardHelpSectionRow.labelWithIcon(
      SceneryPhetFluent.keyboardHelpDialog.pressButtonsStringProperty, spaceOrEnterIcon, {
        labelInnerContent: new PatternStringProperty( SceneryPhetFluent.a11y.keyboardHelpDialog.general.pressButtonsDescriptionStringProperty, {
          enterOrReturn: TextKeyNode.getEnterKeyString()
        } )
      } );

    // 'Reset All'
    const resetAllRow = KeyboardHelpSectionRow.fromHotkeyData( ResetAllButton.RESET_ALL_HOTKEY_DATA );

    // 'Exit a dialog'
    const escapeKeyNode = TextKeyNode.esc();
    const exitADialogRow = KeyboardHelpSectionRow.labelWithIcon(
      SceneryPhetFluent.keyboardHelpDialog.exitADialogStringProperty, escapeKeyNode, {
        labelInnerContent: SceneryPhetFluent.a11y.keyboardHelpDialog.general.exitDialogDescriptionStringProperty
      } );

    const content = [
      moveToNextItemRow,
      moveToPreviousItemRow,
      moveBetweenItemsInAGroupRow
    ];

    if ( options.withKeypadContent ) {

      // 'Set values within keypad'
      const zeroToNineIcon = KeyboardHelpIconFactory.iconToIcon( new NumberKeyNode( 0 ), new NumberKeyNode( 9 ) );
      const setValuesInKeypadRow = KeyboardHelpSectionRow.labelWithIcon(
        SceneryPhetFluent.keyboardHelpDialog.setValuesInKeypadStringProperty, zeroToNineIcon, {
          labelInnerContent: SceneryPhetFluent.a11y.keyboardHelpDialog.general.setValuesInKeypadDescriptionStringProperty
        } );
      content.push( setValuesInKeypadRow );
    }

    // 'Toggle checkboxes'
    if ( options.withCheckboxContent ) {
      const checkboxSpaceKeyNode = TextKeyNode.space();
      const toggleCheckboxes = KeyboardHelpSectionRow.labelWithIcon(
        SceneryPhetFluent.keyboardHelpDialog.toggleCheckboxesStringProperty, checkboxSpaceKeyNode, {
          labelInnerContent: SceneryPhetFluent.a11y.keyboardHelpDialog.general.toggleCheckboxesDescriptionStringProperty
        } );
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