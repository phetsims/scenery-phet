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

import optionize from '../../../../phet-core/js/optionize.js';
import sceneryPhet from '../../sceneryPhet.js';
import sceneryPhetStrings from '../../sceneryPhetStrings.js';
import TextKeyNode from '../TextKeyNode.js';
import KeyboardHelpIconFactory from './KeyboardHelpIconFactory.js';
import KeyboardHelpSection, { KeyboardHelpSectionOptions } from './KeyboardHelpSection.js';
import KeyboardHelpSectionRow from './KeyboardHelpSectionRow.js';

type SelfOptions = {

  // if true, the help content will include information about how to interact with checkboxes
  withCheckboxContent?: boolean;
};

export type BasicActionsKeyboardHelpSectionOptions = SelfOptions & KeyboardHelpSectionOptions;

export default class BasicActionsKeyboardHelpSection extends KeyboardHelpSection {

  public constructor( providedOptions?: BasicActionsKeyboardHelpSectionOptions ) {

    const options = optionize<BasicActionsKeyboardHelpSectionOptions, SelfOptions, KeyboardHelpSectionOptions>()( {
      withCheckboxContent: false
    }, providedOptions );

    // 'Move to next item or group'
    const moveToNextItemRow = KeyboardHelpSectionRow.labelWithIcon(
      sceneryPhetStrings.keyboardHelpDialog.moveToNextItemOrGroupStringProperty,
      TextKeyNode.tab(), {
        labelInnerContent: sceneryPhetStrings.a11y.keyboardHelpDialog.general.tabGroupDescriptionStringProperty
      } );

    // 'Move to previous item or group'
    const moveToPreviousItemRow = KeyboardHelpSectionRow.labelWithIcon(
      sceneryPhetStrings.keyboardHelpDialog.moveToPreviousItemOrGroupStringProperty,
      KeyboardHelpIconFactory.shiftPlusIcon( TextKeyNode.tab() ), {
        labelInnerContent: sceneryPhetStrings.a11y.keyboardHelpDialog.general.shiftTabGroupDescriptionStringProperty
      } );

    // 'Move between items in a group'
    const leftRightArrowsIcon = KeyboardHelpIconFactory.leftRightArrowKeysRowIcon();
    const upDownArrowsIcon = KeyboardHelpIconFactory.upDownArrowKeysRowIcon();
    const moveBetweenItemsInAGroupRow = KeyboardHelpSectionRow.labelWithIcon(
      sceneryPhetStrings.keyboardHelpDialog.moveBetweenItemsInAGroupStringProperty,
      KeyboardHelpIconFactory.iconOrIcon( leftRightArrowsIcon, upDownArrowsIcon ), {
        labelInnerContent: sceneryPhetStrings.a11y.keyboardHelpDialog.general.groupNavigationDescriptionStringProperty
      } );

    // 'Press buttons'
    const pressButtonsItemRow = KeyboardHelpSectionRow.labelWithIcon(
      sceneryPhetStrings.keyboardHelpDialog.pressButtonsStringProperty, TextKeyNode.space(), {
        labelInnerContent: sceneryPhetStrings.a11y.keyboardHelpDialog.general.pressButtonsDescriptionStringProperty
      } );

    const content = [
      moveToNextItemRow,
      moveToPreviousItemRow,
      moveBetweenItemsInAGroupRow,
      pressButtonsItemRow
    ];

    // 'Toggle checkboxes'
    if ( options.withCheckboxContent ) {
      const toggleCheckboxes = KeyboardHelpSectionRow.labelWithIcon(
        sceneryPhetStrings.keyboardHelpDialog.toggleCheckboxesStringProperty, TextKeyNode.space(), {
          labelInnerContent: sceneryPhetStrings.a11y.keyboardHelpDialog.general.toggleCheckboxesDescriptionStringProperty
        } );
      content.push( toggleCheckboxes );
    }

    // 'Exit a dialog'
    const exitADialogRow = KeyboardHelpSectionRow.labelWithIcon(
      sceneryPhetStrings.keyboardHelpDialog.exitADialogStringProperty, TextKeyNode.esc(), {
        labelInnerContent: sceneryPhetStrings.a11y.keyboardHelpDialog.general.exitDialogDescriptionStringProperty
      } );
    content.push( exitADialogRow );

    // order the rows of content
    super( sceneryPhetStrings.keyboardHelpDialog.basicActionsStringProperty, content, options );
  }
}

sceneryPhet.register( 'BasicActionsKeyboardHelpSection', BasicActionsKeyboardHelpSection );