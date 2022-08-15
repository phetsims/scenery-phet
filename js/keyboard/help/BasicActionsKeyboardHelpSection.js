// Copyright 2017-2022, University of Colorado Boulder

/**
 * General help information for how to navigation a simulation with a keyboard. In general, this file supports a fair
 * number of options, like displaying group content, or shortcuts for checkbox interaction. The algorithm this type
 * implements set all the optional potential rows as null, and then fills them in if the options is provided. Then at the
 * end anything that is null is filtered out.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import merge from '../../../../phet-core/js/merge.js';
import sceneryPhet from '../../sceneryPhet.js';
import sceneryPhetStrings from '../../sceneryPhetStrings.js';
import TextKeyNode from '../TextKeyNode.js';
import KeyboardHelpIconFactory from './KeyboardHelpIconFactory.js';
import KeyboardHelpSection from './KeyboardHelpSection.js';
import KeyboardHelpSectionRow from './KeyboardHelpSectionRow.js';

// constants
const keyboardHelpDialogBasicActionsString = sceneryPhetStrings.keyboardHelpDialog.basicActions;
const keyboardHelpDialogExitADialogString = sceneryPhetStrings.keyboardHelpDialog.exitADialog;
const keyboardHelpDialogMoveBetweenItemsInAGroupString = sceneryPhetStrings.keyboardHelpDialog.moveBetweenItemsInAGroup;
const keyboardHelpDialogMoveToNextItemOrGroupString = sceneryPhetStrings.keyboardHelpDialog.moveToNextItemOrGroup;
const keyboardHelpDialogMoveToPreviousItemOrGroupString = sceneryPhetStrings.keyboardHelpDialog.moveToPreviousItemOrGroup;
const keyboardHelpDialogPressButtonsString = sceneryPhetStrings.keyboardHelpDialog.pressButtons;
const keyboardHelpDialogToggleCheckboxesString = sceneryPhetStrings.keyboardHelpDialog.toggleCheckboxes;
const keyboardHelpDialogTabGroupDescriptionString = sceneryPhetStrings.a11y.keyboardHelpDialog.general.tabGroupDescription;
const keyboardHelpDialogShiftTabGroupDescriptionString = sceneryPhetStrings.a11y.keyboardHelpDialog.general.shiftTabGroupDescription;
const keyboardHelpDialogPressButtonsDescriptionString = sceneryPhetStrings.a11y.keyboardHelpDialog.general.pressButtonsDescription;
const keyboardHelpDialogGroupNavigationDescriptionString = sceneryPhetStrings.a11y.keyboardHelpDialog.general.groupNavigationDescription;
const keyboardHelpDialogExitDialogDescriptionString = sceneryPhetStrings.a11y.keyboardHelpDialog.general.exitDialogDescription;
const toggleCheckboxesDescriptionString = sceneryPhetStrings.a11y.keyboardHelpDialog.general.toggleCheckboxesDescription;

class BasicActionsKeyboardHelpSection extends KeyboardHelpSection {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {
      withCheckboxContent: false // if true, the help content will include information about how to interact with checkboxes
    }, options );

    // 'press buttons' content
    const spaceIcon = TextKeyNode.space();
    const pressButtonsItemRow = KeyboardHelpSectionRow.labelWithIcon( keyboardHelpDialogPressButtonsString, spaceIcon, {
      labelInnerContent: keyboardHelpDialogPressButtonsDescriptionString
    } );

    // 'exit a dialog' content
    const exitADialogIcon = TextKeyNode.esc();
    const exitADialogRow = KeyboardHelpSectionRow.labelWithIcon( keyboardHelpDialogExitADialogString, exitADialogIcon, {
      labelInnerContent: keyboardHelpDialogExitDialogDescriptionString
    } );

    // 'toggle checkboxes' content
    let toggleCheckboxes = null;
    if ( options.withCheckboxContent ) {
      toggleCheckboxes = KeyboardHelpSectionRow.labelWithIcon( keyboardHelpDialogToggleCheckboxesString, TextKeyNode.space(),
        {
          labelInnerContent: toggleCheckboxesDescriptionString
        } );
    }

    const leftRightArrowsIcon = KeyboardHelpIconFactory.leftRightArrowKeysRowIcon();
    const upDownArrowsIcon = KeyboardHelpIconFactory.upDownArrowKeysRowIcon();
    const moveBetweenItemsInAGroupRow = KeyboardHelpSectionRow.labelWithIcon(
      keyboardHelpDialogMoveBetweenItemsInAGroupString,
      KeyboardHelpIconFactory.iconOrIcon( leftRightArrowsIcon, upDownArrowsIcon ),
      {
        labelInnerContent: keyboardHelpDialogGroupNavigationDescriptionString
      }
    );

    const moveToNextItemRow = KeyboardHelpSectionRow.labelWithIcon(
      keyboardHelpDialogMoveToNextItemOrGroupString,
      TextKeyNode.tab(),
      {
        labelInnerContent: keyboardHelpDialogTabGroupDescriptionString
      }
    );

    const moveToPreviousItemRow = KeyboardHelpSectionRow.labelWithIcon(
      keyboardHelpDialogMoveToPreviousItemOrGroupString,
      KeyboardHelpIconFactory.shiftPlusIcon( TextKeyNode.tab() ),
      {
        labelInnerContent: keyboardHelpDialogShiftTabGroupDescriptionString
      }
    );

    const content = [
      moveToNextItemRow,
      moveToPreviousItemRow,
      moveBetweenItemsInAGroupRow,
      pressButtonsItemRow,
      toggleCheckboxes,
      exitADialogRow
    ].filter( row => row !== null ); // If any optional rows are null, omit them.

    // order the rows of content
    super( keyboardHelpDialogBasicActionsString, content, options );
  }
}

sceneryPhet.register( 'BasicActionsKeyboardHelpSection', BasicActionsKeyboardHelpSection );
export default BasicActionsKeyboardHelpSection;