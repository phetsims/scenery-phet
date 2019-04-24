// Copyright 2017-2019, University of Colorado Boulder

/**
 * General help information for how to navigation a simulation with a keyboard.
 *
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var EscapeKeyNode = require( 'SCENERY_PHET/keyboard/EscapeKeyNode' );
  var KeyboardHelpSection = require( 'SCENERY_PHET/keyboard/help/KeyboardHelpSection' );
  var inherit = require( 'PHET_CORE/inherit' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var SceneryPhetA11yStrings = require( 'SCENERY_PHET/SceneryPhetA11yStrings' );
  var SpaceKeyNode = require( 'SCENERY_PHET/keyboard/SpaceKeyNode' );
  var TabKeyNode = require( 'SCENERY_PHET/keyboard/TabKeyNode' );

  // stings
  var keyboardHelpDialogBasicActionsString = require( 'string!SCENERY_PHET/keyboardHelpDialog.basicActions' );
  var keyboardHelpDialogExitADialogString = require( 'string!SCENERY_PHET/keyboardHelpDialog.exitADialog' );
  var keyboardHelpDialogMoveBetweenItemsInAGroupString = require( 'string!SCENERY_PHET/keyboardHelpDialog.moveBetweenItemsInAGroup' );
  var keyboardHelpDialogMoveToNextItemOrGroupString = require( 'string!SCENERY_PHET/keyboardHelpDialog.moveToNextItemOrGroup' );
  var keyboardHelpDialogMoveToNextItemString = require( 'string!SCENERY_PHET/keyboardHelpDialog.moveToNextItem' );
  var keyboardHelpDialogMoveToPreviousItemOrGroupString = require( 'string!SCENERY_PHET/keyboardHelpDialog.moveToPreviousItemOrGroup' );
  var keyboardHelpDialogMoveToPreviousItemString = require( 'string!SCENERY_PHET/keyboardHelpDialog.moveToPreviousItem' );
  var keyboardHelpDialogPressButtonsString = require( 'string!SCENERY_PHET/keyboardHelpDialog.pressButtons' );
  var keyboardHelpDialogToggleCheckboxString = require( 'string!SCENERY_PHET/keyboardHelpDialog.toggleCheckboxes' );

  // a11y strings
  var keyboardHelpDialogTabDescriptionString = SceneryPhetA11yStrings.keyboardHelpDialogTabDescription.value;
  var keyboardHelpDialogShiftTabDescriptionString = SceneryPhetA11yStrings.keyboardHelpDialogShiftTabDescription.value;
  var keyboardHelpDialogPressButtonsDescriptionString = SceneryPhetA11yStrings.keyboardHelpDialogPressButtonsDescription.value;
  var keyboardHelpDialogGroupNavigationDescriptionString = SceneryPhetA11yStrings.keyboardHelpDialogGroupNavigationDescription.value;
  var keyboardHelpDialogExitDialogDescriptionString = SceneryPhetA11yStrings.keyboardHelpDialogExitDialogDescription.value;
  var toggleCheckboxesDescriptionString = SceneryPhetA11yStrings.toggleCheckboxesDescription.value;

  /**
   * @constructor
   * @param {Object} options
   */
  function GeneralKeyboardHelpSection( options ) {

    options = _.extend( {
      withGroupContent: false, // if true, the help content will include information about how to interact with groups
      withCheckboxContent: false // if true, the help content will include information about how to interact with checkboxes
    }, options );

    // 'press buttons' content
    var spaceIcon = new SpaceKeyNode();
    var pressButtonsItemRow = KeyboardHelpSection.labelWithIcon( keyboardHelpDialogPressButtonsString, spaceIcon, keyboardHelpDialogPressButtonsDescriptionString );

    // 'exit a dialog' content
    var exitADialogIcon = new EscapeKeyNode();
    var exitADialogRow = KeyboardHelpSection.labelWithIcon( keyboardHelpDialogExitADialogString, exitADialogIcon, keyboardHelpDialogExitDialogDescriptionString );

    var content = [ pressButtonsItemRow, exitADialogRow ];

    var nextItemString;
    var previousItemString;
    if ( options.withGroupContent ) {

      nextItemString = keyboardHelpDialogMoveToNextItemOrGroupString;
      previousItemString = keyboardHelpDialogMoveToPreviousItemOrGroupString;

      // if the general navigation section includes help content includes groups, modify some text and add another
      // section to describe how to navigate groups
      var leftRightArrowsIcon = KeyboardHelpSection.leftRightArrowKeysRowIcon();
      var upDownArrowsIcon = KeyboardHelpSection.upDownArrowKeysRowIcon();
      var leftRightOrUpDownIcon = KeyboardHelpSection.iconOrIcon( leftRightArrowsIcon, upDownArrowsIcon );
      var moveBetweenItemsInAGroupRow = KeyboardHelpSection.labelWithIcon( keyboardHelpDialogMoveBetweenItemsInAGroupString,
        leftRightOrUpDownIcon, keyboardHelpDialogGroupNavigationDescriptionString );

      // the "group" content row row comes just before the "exite a dialog" row
      content.splice( content.indexOf( exitADialogRow ), 0, moveBetweenItemsInAGroupRow );
    }
    else {
      nextItemString = keyboardHelpDialogMoveToNextItemString;
      previousItemString = keyboardHelpDialogMoveToPreviousItemString;
    }

    if ( options.withCheckboxContent ) {
      content.push( KeyboardHelpSection.labelWithIcon( keyboardHelpDialogToggleCheckboxString, new SpaceKeyNode(),
        toggleCheckboxesDescriptionString ) );
    }

    // 'move to next item' content
    var moveToNextItemIcon = new TabKeyNode();
    var moveToNextItemRow = KeyboardHelpSection.labelWithIcon( nextItemString, moveToNextItemIcon, keyboardHelpDialogTabDescriptionString );

    // 'move to previous item' content
    var tabIcon = new TabKeyNode();
    var moveToPreviousItemIcon = KeyboardHelpSection.shiftPlusIcon( tabIcon );
    var moveToPreviousItemRow = KeyboardHelpSection.labelWithIcon( previousItemString, moveToPreviousItemIcon, keyboardHelpDialogShiftTabDescriptionString );

    // move to next/previous items are at the beginning of the content
    content.unshift( moveToNextItemRow, moveToPreviousItemRow );

    // order the rows of content
    KeyboardHelpSection.call( this, keyboardHelpDialogBasicActionsString, content, options );
  }

  sceneryPhet.register( 'GeneralKeyboardHelpSection', GeneralKeyboardHelpSection );

  return inherit( KeyboardHelpSection, GeneralKeyboardHelpSection, {} );
} );
