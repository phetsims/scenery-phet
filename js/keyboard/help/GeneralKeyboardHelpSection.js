// Copyright 2017-2020, University of Colorado Boulder

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
import sceneryPhetStrings from '../../sceneryPhetStrings.js';
import sceneryPhet from '../../sceneryPhet.js';
import EscapeKeyNode from '../EscapeKeyNode.js';
import SpaceKeyNode from '../SpaceKeyNode.js';
import TabKeyNode from '../TabKeyNode.js';
import KeyboardHelpIconFactory from './KeyboardHelpIconFactory.js';
import KeyboardHelpSection from './KeyboardHelpSection.js';

// constants
const keyboardHelpDialogBasicActionsString = sceneryPhetStrings.keyboardHelpDialog.basicActions;
const keyboardHelpDialogExitADialogString = sceneryPhetStrings.keyboardHelpDialog.exitADialog;
const keyboardHelpDialogMoveBetweenItemsInAGroupString = sceneryPhetStrings.keyboardHelpDialog.moveBetweenItemsInAGroup;
const keyboardHelpDialogMoveToNextItemOrGroupString = sceneryPhetStrings.keyboardHelpDialog.moveToNextItemOrGroup;
const keyboardHelpDialogMoveToNextItemString = sceneryPhetStrings.keyboardHelpDialog.moveToNextItem;
const keyboardHelpDialogMoveToPreviousItemOrGroupString = sceneryPhetStrings.keyboardHelpDialog.moveToPreviousItemOrGroup;
const keyboardHelpDialogMoveToPreviousItemString = sceneryPhetStrings.keyboardHelpDialog.moveToPreviousItem;
const keyboardHelpDialogPressButtonsString = sceneryPhetStrings.keyboardHelpDialog.pressButtons;
const keyboardHelpDialogToggleCheckboxesString = sceneryPhetStrings.keyboardHelpDialog.toggleCheckboxes;
const keyboardHelpDialogTabDescriptionString = sceneryPhetStrings.a11y.keyboardHelpDialog.general.tabDescription;
const keyboardHelpDialogShiftTabDescriptionString = sceneryPhetStrings.a11y.keyboardHelpDialog.general.shiftTabDescription;
const keyboardHelpDialogTabGroupDescriptionString = sceneryPhetStrings.a11y.keyboardHelpDialog.general.tabGroupDescription;
const keyboardHelpDialogShiftTabGroupDescriptionString = sceneryPhetStrings.a11y.keyboardHelpDialog.general.shiftTabGroupDescription;
const keyboardHelpDialogPressButtonsDescriptionString = sceneryPhetStrings.a11y.keyboardHelpDialog.general.pressButtonsDescription;
const keyboardHelpDialogGroupNavigationDescriptionString = sceneryPhetStrings.a11y.keyboardHelpDialog.general.groupNavigationDescription;
const keyboardHelpDialogExitDialogDescriptionString = sceneryPhetStrings.a11y.keyboardHelpDialog.general.exitDialogDescription;
const toggleCheckboxesDescriptionString = sceneryPhetStrings.a11y.keyboardHelpDialog.general.toggleCheckboxesDescription;

class GeneralKeyboardHelpSection extends KeyboardHelpSection {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {
      withGroupContent: false, // if true, the help content will include information about how to interact with groups
      withCheckboxContent: false // if true, the help content will include information about how to interact with checkboxes
    }, options );

    // 'press buttons' content
    const spaceIcon = new SpaceKeyNode();
    const pressButtonsItemRow = KeyboardHelpSection.labelWithIcon( keyboardHelpDialogPressButtonsString, spaceIcon, keyboardHelpDialogPressButtonsDescriptionString );

    // 'exit a dialog' content
    const exitADialogIcon = new EscapeKeyNode();
    const exitADialogRow = KeyboardHelpSection.labelWithIcon( keyboardHelpDialogExitADialogString, exitADialogIcon, keyboardHelpDialogExitDialogDescriptionString );

    // 'toggle checkboxes' content
    let toggleCheckboxes = null;
    if ( options.withCheckboxContent ) {
      toggleCheckboxes = KeyboardHelpSection.labelWithIcon( keyboardHelpDialogToggleCheckboxesString, new SpaceKeyNode(),
        toggleCheckboxesDescriptionString );
    }

    // added row if group content is present
    let moveBetweenItemsInAGroupRow = null;
    if ( options.withGroupContent ) {

      // if the general navigation section includes help content includes groups, modify some text and add another
      // section to describe how to navigate groups
      const leftRightArrowsIcon = KeyboardHelpIconFactory.leftRightArrowKeysRowIcon();
      const upDownArrowsIcon = KeyboardHelpIconFactory.upDownArrowKeysRowIcon();
      const leftRightOrUpDownIcon = KeyboardHelpIconFactory.iconOrIcon( leftRightArrowsIcon, upDownArrowsIcon );
      moveBetweenItemsInAGroupRow = KeyboardHelpSection.labelWithIcon( keyboardHelpDialogMoveBetweenItemsInAGroupString,
        leftRightOrUpDownIcon, keyboardHelpDialogGroupNavigationDescriptionString );
    }

    // with "or group" when providing group content
    const moveToNextItemIcon = new TabKeyNode();
    const nextItemString = options.withGroupContent ?
                           keyboardHelpDialogMoveToNextItemOrGroupString :
                           keyboardHelpDialogMoveToNextItemString;
    const moveToNextDescription = options.withGroupContent ?
                                  keyboardHelpDialogTabGroupDescriptionString :
                                  keyboardHelpDialogTabDescriptionString;
    const moveToNextItemRow = KeyboardHelpSection.labelWithIcon(
      nextItemString,
      moveToNextItemIcon,
      moveToNextDescription
    );

    // with "or group" when providing group content
    const previousItemString = options.withGroupContent ?
                               keyboardHelpDialogMoveToPreviousItemOrGroupString :
                               keyboardHelpDialogMoveToPreviousItemString;
    const tabIcon = new TabKeyNode();
    const moveToPreviousItemIcon = KeyboardHelpIconFactory.shiftPlusIcon( tabIcon );
    const moveToPreviousDescriptionString = options.withGroupContent ?
                                            keyboardHelpDialogShiftTabGroupDescriptionString :
                                            keyboardHelpDialogShiftTabDescriptionString;
    const moveToPreviousItemRow = KeyboardHelpSection.labelWithIcon(
      previousItemString,
      moveToPreviousItemIcon,
      moveToPreviousDescriptionString
    );

    const content = [
      moveToNextItemRow,
      moveToPreviousItemRow,
      pressButtonsItemRow,
      toggleCheckboxes,
      moveBetweenItemsInAGroupRow,
      exitADialogRow
    ].filter( row => row !== null ); // If any optional rows are null, omit them.

    // order the rows of content
    super( keyboardHelpDialogBasicActionsString, content, options );
  }
}

sceneryPhet.register( 'GeneralKeyboardHelpSection', GeneralKeyboardHelpSection );
export default GeneralKeyboardHelpSection;