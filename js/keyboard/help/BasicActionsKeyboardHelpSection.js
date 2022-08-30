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
    const pressButtonsItemRow = KeyboardHelpSectionRow.labelWithIcon(
      sceneryPhetStrings.keyboardHelpDialog.pressButtonsStringProperty, spaceIcon, {
        labelInnerContent: sceneryPhetStrings.a11y.keyboardHelpDialog.general.pressButtonsDescriptionStringProperty
      } );

    // 'exit a dialog' content
    const exitADialogIcon = TextKeyNode.esc();
    const exitADialogRow = KeyboardHelpSectionRow.labelWithIcon(
      sceneryPhetStrings.keyboardHelpDialog.exitADialogStringProperty, exitADialogIcon, {
        labelInnerContent: sceneryPhetStrings.a11y.keyboardHelpDialog.general.exitDialogDescriptionStringProperty
      } );

    // 'toggle checkboxes' content
    let toggleCheckboxes = null;
    if ( options.withCheckboxContent ) {
      toggleCheckboxes = KeyboardHelpSectionRow.labelWithIcon(
        sceneryPhetStrings.keyboardHelpDialog.toggleCheckboxesStringProperty, TextKeyNode.space(), {
          labelInnerContent: sceneryPhetStrings.a11y.keyboardHelpDialog.general.toggleCheckboxesDescriptionStringProperty
        } );
    }

    const leftRightArrowsIcon = KeyboardHelpIconFactory.leftRightArrowKeysRowIcon();
    const upDownArrowsIcon = KeyboardHelpIconFactory.upDownArrowKeysRowIcon();
    const moveBetweenItemsInAGroupRow = KeyboardHelpSectionRow.labelWithIcon(
      sceneryPhetStrings.keyboardHelpDialog.moveBetweenItemsInAGroupStringProperty,
      KeyboardHelpIconFactory.iconOrIcon( leftRightArrowsIcon, upDownArrowsIcon ), {
        labelInnerContent: sceneryPhetStrings.a11y.keyboardHelpDialog.general.groupNavigationDescriptionStringProperty
      } );

    const moveToNextItemRow = KeyboardHelpSectionRow.labelWithIcon(
      sceneryPhetStrings.keyboardHelpDialog.moveToNextItemOrGroupStringProperty,
      TextKeyNode.tab(), {
        labelInnerContent: sceneryPhetStrings.a11y.keyboardHelpDialog.general.tabGroupDescriptionStringProperty
      } );

    const moveToPreviousItemRow = KeyboardHelpSectionRow.labelWithIcon(
      sceneryPhetStrings.keyboardHelpDialog.moveToPreviousItemOrGroupStringProperty,
      KeyboardHelpIconFactory.shiftPlusIcon( TextKeyNode.tab() ), {
        labelInnerContent: sceneryPhetStrings.a11y.keyboardHelpDialog.general.shiftTabGroupDescriptionStringProperty
      } );

    const content = [
      moveToNextItemRow,
      moveToPreviousItemRow,
      moveBetweenItemsInAGroupRow,
      pressButtonsItemRow,
      toggleCheckboxes,
      exitADialogRow
    ].filter( row => row !== null ); // If any optional rows are null, omit them.

    // order the rows of content
    super( sceneryPhetStrings.keyboardHelpDialog.basicActionsStringProperty, content, options );
  }
}

sceneryPhet.register( 'BasicActionsKeyboardHelpSection', BasicActionsKeyboardHelpSection );
export default BasicActionsKeyboardHelpSection;