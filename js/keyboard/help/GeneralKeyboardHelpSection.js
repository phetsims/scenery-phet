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
define( require => {
  'use strict';

  // modules
  const EscapeKeyNode = require( 'SCENERY_PHET/keyboard/EscapeKeyNode' );
  const KeyboardHelpSection = require( 'SCENERY_PHET/keyboard/help/KeyboardHelpSection' );
  const merge = require( 'PHET_CORE/merge' );
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  const SceneryPhetA11yStrings = require( 'SCENERY_PHET/SceneryPhetA11yStrings' );
  const SpaceKeyNode = require( 'SCENERY_PHET/keyboard/SpaceKeyNode' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const TabKeyNode = require( 'SCENERY_PHET/keyboard/TabKeyNode' );

  // stings
  const keyboardHelpDialogBasicActionsString = require( 'string!SCENERY_PHET/keyboardHelpDialog.basicActions' );
  const keyboardHelpDialogExitADialogString = require( 'string!SCENERY_PHET/keyboardHelpDialog.exitADialog' );
  const keyboardHelpDialogMoveBetweenItemsInAGroupString = require( 'string!SCENERY_PHET/keyboardHelpDialog.moveBetweenItemsInAGroup' );
  const keyboardHelpDialogMoveToNextItemString = require( 'string!SCENERY_PHET/keyboardHelpDialog.moveToNextItem' );
  const keyboardHelpDialogOrGroupString = require( 'string!SCENERY_PHET/keyboardHelpDialog.orGroup' );
  const keyboardHelpDialogMoveToPreviousItemString = require( 'string!SCENERY_PHET/keyboardHelpDialog.moveToPreviousItem' );
  const keyboardHelpDialogPressButtonsString = require( 'string!SCENERY_PHET/keyboardHelpDialog.pressButtons' );
  const keyboardHelpDialogToggleCheckboxesString = require( 'string!SCENERY_PHET/keyboardHelpDialog.toggleCheckboxes' );

  // a11y strings
  const keyboardHelpDialogTabDescriptionString = SceneryPhetA11yStrings.keyboardHelpDialogTabDescription.value;
  const keyboardHelpDialogShiftTabDescriptionString = SceneryPhetA11yStrings.keyboardHelpDialogShiftTabDescription.value;
  const keyboardHelpDialogPressButtonsDescriptionString = SceneryPhetA11yStrings.keyboardHelpDialogPressButtonsDescription.value;
  const keyboardHelpDialogGroupNavigationDescriptionString = SceneryPhetA11yStrings.keyboardHelpDialogGroupNavigationDescription.value;
  const keyboardHelpDialogExitDialogDescriptionString = SceneryPhetA11yStrings.keyboardHelpDialogExitDialogDescription.value;
  const toggleCheckboxesDescriptionString = SceneryPhetA11yStrings.toggleCheckboxesDescription.value;

  // constants
  // This is to support json string files not allowing trailing or leading spaces.
  // TODO: remove this hard coded unicode replace that is needed to prevent weird spacing, https://github.com/phetsims/scenery/issues/1029
  const OR_GROUP_STRING = StringUtils.fillIn( keyboardHelpDialogOrGroupString.replace( '\u202a', '' ), {
    space: ' '
  } );

  class GeneralKeyboardHelpSection extends KeyboardHelpSection {

    /**
     * @param {Object} options
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
        const leftRightArrowsIcon = KeyboardHelpSection.leftRightArrowKeysRowIcon();
        const upDownArrowsIcon = KeyboardHelpSection.upDownArrowKeysRowIcon();
        const leftRightOrUpDownIcon = KeyboardHelpSection.iconOrIcon( leftRightArrowsIcon, upDownArrowsIcon );
        moveBetweenItemsInAGroupRow = KeyboardHelpSection.labelWithIcon( keyboardHelpDialogMoveBetweenItemsInAGroupString,
          leftRightOrUpDownIcon, keyboardHelpDialogGroupNavigationDescriptionString );
      }

      // 'move to next item {{or group}}' content
      const moveToNextItemIcon = new TabKeyNode();
      const nextItemString = StringUtils.fillIn( keyboardHelpDialogMoveToNextItemString, {
        orGroup: options.withGroupContent ? OR_GROUP_STRING : ''
      } );
      const moveToNextItemRow = KeyboardHelpSection.labelWithIcon( nextItemString, moveToNextItemIcon,
        StringUtils.fillIn( keyboardHelpDialogTabDescriptionString, {
          orGroup: options.withGroupContent ? OR_GROUP_STRING : ''
        } )
      );

      // 'move to previous item{{ or group}}' content
      const tabIcon = new TabKeyNode();
      const previousItemString = StringUtils.fillIn( keyboardHelpDialogMoveToPreviousItemString, {
        orGroup: options.withGroupContent ? OR_GROUP_STRING : ''
      } );
      const moveToPreviousItemIcon = KeyboardHelpSection.shiftPlusIcon( tabIcon );
      const moveToPreviousItemRow = KeyboardHelpSection.labelWithIcon( previousItemString, moveToPreviousItemIcon,
        StringUtils.fillIn( keyboardHelpDialogShiftTabDescriptionString, {
          orGroup: options.withGroupContent ? OR_GROUP_STRING : ''
        } )
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

  return sceneryPhet.register( 'GeneralKeyboardHelpSection', GeneralKeyboardHelpSection );
} );
