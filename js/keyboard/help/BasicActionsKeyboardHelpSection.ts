// Copyright 2017-2023, University of Colorado Boulder

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
import SceneryPhetStrings from '../../SceneryPhetStrings.js';
import TextKeyNode from '../TextKeyNode.js';
import KeyboardHelpIconFactory from './KeyboardHelpIconFactory.js';
import KeyboardHelpSection, { KeyboardHelpSectionOptions } from './KeyboardHelpSection.js';
import KeyboardHelpSectionRow from './KeyboardHelpSectionRow.js';
import LetterKeyNode from '../LetterKeyNode.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';

type SelfOptions = {

  // if true, the help content will include information about how to interact with checkboxes
  withCheckboxContent?: boolean;
};

export type BasicActionsKeyboardHelpSectionOptions = SelfOptions & KeyboardHelpSectionOptions;

export default class BasicActionsKeyboardHelpSection extends KeyboardHelpSection {
  private readonly disposeBasicActionsKeyboardHelpSection: () => void;

  public constructor( providedOptions?: BasicActionsKeyboardHelpSectionOptions ) {

    const options = optionize<BasicActionsKeyboardHelpSectionOptions, SelfOptions, KeyboardHelpSectionOptions>()( {
      withCheckboxContent: false
    }, providedOptions );

    const tabKeyNode = TextKeyNode.tab();

    // 'Move to next item or group'
    const moveToNextItemRow = KeyboardHelpSectionRow.labelWithIcon(
      SceneryPhetStrings.keyboardHelpDialog.moveToNextItemOrGroupStringProperty,
      tabKeyNode, {
        labelInnerContent: SceneryPhetStrings.a11y.keyboardHelpDialog.general.tabGroupDescriptionStringProperty
      } );

    const shiftPlusTabIcon = KeyboardHelpIconFactory.shiftPlusIcon( tabKeyNode );

    // 'Move to previous item or group'
    const moveToPreviousItemRow = KeyboardHelpSectionRow.labelWithIcon(
      SceneryPhetStrings.keyboardHelpDialog.moveToPreviousItemOrGroupStringProperty,
      shiftPlusTabIcon, {
        labelInnerContent: SceneryPhetStrings.a11y.keyboardHelpDialog.general.shiftTabGroupDescriptionStringProperty
      } );

    // 'Move between items in a group'
    const leftRightArrowsIcon = KeyboardHelpIconFactory.leftRightArrowKeysRowIcon();
    const upDownArrowsIcon = KeyboardHelpIconFactory.upDownArrowKeysRowIcon();
    const arrowsIcon = KeyboardHelpIconFactory.iconOrIcon( leftRightArrowsIcon, upDownArrowsIcon );
    const moveBetweenItemsInAGroupRow = KeyboardHelpSectionRow.labelWithIcon(
      SceneryPhetStrings.keyboardHelpDialog.moveBetweenItemsInAGroupStringProperty,
      arrowsIcon, {
        labelInnerContent: SceneryPhetStrings.a11y.keyboardHelpDialog.general.groupNavigationDescriptionStringProperty
      } );

    const spaceKeyNode = TextKeyNode.space();
    const enterKeyNode = TextKeyNode.enter();
    const spaceOrEnterIcon = KeyboardHelpIconFactory.iconOrIcon( spaceKeyNode, enterKeyNode );

    // 'Press buttons'
    const pressButtonsItemRow = KeyboardHelpSectionRow.labelWithIcon(
      SceneryPhetStrings.keyboardHelpDialog.pressButtonsStringProperty, spaceOrEnterIcon, {
        labelInnerContent: SceneryPhetStrings.a11y.keyboardHelpDialog.general.pressButtonsDescriptionStringProperty
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
        SceneryPhetStrings.keyboardHelpDialog.toggleCheckboxesStringProperty, spaceKeyNode, {
          labelInnerContent: SceneryPhetStrings.a11y.keyboardHelpDialog.general.toggleCheckboxesDescriptionStringProperty
        } );
      content.push( toggleCheckboxes );
    }

    // 'Reset All'
    const altIcon = TextKeyNode.altOrOption();
    const rIcon = new LetterKeyNode( 'R' );
    const altPlusRIcon = KeyboardHelpIconFactory.iconPlusIcon( altIcon, rIcon );
    const resetAllRow = KeyboardHelpSectionRow.labelWithIcon(
      SceneryPhetStrings.keyboardHelpDialog.resetAllStringProperty, altPlusRIcon, {
        labelInnerContent: StringUtils.fillIn( SceneryPhetStrings.a11y.keyboardHelpDialog.general.resetAllDescriptionPatternStringProperty, {
          altOrOption: TextKeyNode.getAltKeyString()
        } )
      }
    );
    content.push( resetAllRow );

    const escapeKeyNode = TextKeyNode.esc();

    // 'Exit a dialog'
    const exitADialogRow = KeyboardHelpSectionRow.labelWithIcon(
      SceneryPhetStrings.keyboardHelpDialog.exitADialogStringProperty, escapeKeyNode, {
        labelInnerContent: SceneryPhetStrings.a11y.keyboardHelpDialog.general.exitDialogDescriptionStringProperty
      } );
    content.push( exitADialogRow );

    // order the rows of content
    super( SceneryPhetStrings.keyboardHelpDialog.basicActionsStringProperty, content, options );

    this.disposeBasicActionsKeyboardHelpSection = () => {
      escapeKeyNode.dispose();
      shiftPlusTabIcon.dispose();
      tabKeyNode.dispose();
      arrowsIcon.dispose();
      leftRightArrowsIcon.dispose();
      upDownArrowsIcon.dispose();
      spaceKeyNode.dispose();
      enterKeyNode.dispose();
      spaceOrEnterIcon.dispose();
      altIcon.dispose();
      rIcon.dispose();
      altPlusRIcon.dispose();
    };
  }

  public override dispose(): void {
    this.disposeBasicActionsKeyboardHelpSection();
    super.dispose();
  }
}

sceneryPhet.register( 'BasicActionsKeyboardHelpSection', BasicActionsKeyboardHelpSection );