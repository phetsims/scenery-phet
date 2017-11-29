// Copyright 2017, University of Colorado Boulder

/**
 * General help information for how to navigation a simulation with a keyboard.
 *
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var EscapeKeyNode = require( 'SCENERY_PHET/keyboard/EscapeKeyNode' );
  var HelpContent = require( 'SCENERY_PHET/keyboard/help/HelpContent' );
  var inherit = require( 'PHET_CORE/inherit' );
  var RichText = require( 'SCENERY/nodes/RichText' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var SceneryPhetA11yStrings = require( 'SCENERY_PHET/SceneryPhetA11yStrings' );
  var TabKeyNode = require( 'SCENERY_PHET/keyboard/TabKeyNode' );

  // stings
  var keyboardHelpDialogExitADialogString = require( 'string!SCENERY_PHET/keyboardHelpDialog.exitADialog' );
  var keyboardHelpDialogGeneralNavigationString = require( 'string!SCENERY_PHET/keyboardHelpDialog.generalNavigation' );
  var keyboardHelpDialogMoveBetweenItemsInAGroupString = require( 'string!SCENERY_PHET/keyboardHelpDialog.moveBetweenItemsInAGroup' );
  var keyboardHelpDialogMoveToNextItemOrGroupString = require( 'string!SCENERY_PHET/keyboardHelpDialog.moveToNextItemOrGroup' );
  var keyboardHelpDialogMoveToNextItemString = require( 'string!SCENERY_PHET/keyboardHelpDialog.moveToNextItem' );
  var keyboardHelpDialogMoveToPreviousItemOrGroupString = require( 'string!SCENERY_PHET/keyboardHelpDialog.moveToPreviousItemOrGroup' );
  var keyboardHelpDialogMoveToPreviousItemString = require( 'string!SCENERY_PHET/keyboardHelpDialog.moveToPreviousItem' );

  // invisible strings for screen readers, no i18n support
  var tabDescriptionString = SceneryPhetA11yStrings.tabDescriptionString.value;
  var shiftTabDescriptionString = SceneryPhetA11yStrings.shiftTabDescriptionString.value;
  var groupNavigationDescriptionString = SceneryPhetA11yStrings.groupNavigationDescriptionString.value;
  var exitDialogDescriptionString = SceneryPhetA11yStrings.exitDialogDescriptionString.value;

  /**
   * @constructor
   * @param {Object} options
   */
  function GeneralNavigationHelpContent( options ) {

    options = _.extend( {
      withGroupContent: false, // if true, the help content will include information about how to interact with groups

      verticalIconSpacing: HelpContent.DEFAULT_VERTICAL_ICON_SPACING,
      labelFont: HelpContent.DEFAULT_LABEL_FONT,
      labelMaxWidth: HelpContent.DEFAULT_TEXT_MAX_WIDTH
    }, options );

    var labelOptions = {
      font: options.labelFont,
      maxWidth: options.labelMaxWidth
    };

    // 'move to next item' content
    var moveToNextItemText = new RichText( keyboardHelpDialogMoveToNextItemString, labelOptions );
    var moveToNextItemIcon = new TabKeyNode();
    var moveToNextItemRow = HelpContent.labelWithIcon( moveToNextItemText, moveToNextItemIcon, {
      accessibleLabel: tabDescriptionString
    } );

    // 'move to previous item' content
    var moveToPreviousItemText = new RichText( keyboardHelpDialogMoveToPreviousItemString, labelOptions );
    var tabIcon = new TabKeyNode();
    var moveToPreviousItemIcon = HelpContent.shiftPlusIcon( tabIcon );
    var moveToPreviousItemRow = HelpContent.labelWithIcon( moveToPreviousItemText, moveToPreviousItemIcon, {
      accessibleLabel: shiftTabDescriptionString
    } );

    // 'exit a dialog' content
    var exitADialogText = new RichText( keyboardHelpDialogExitADialogString, labelOptions );
    var exitADialogIcon = new EscapeKeyNode();
    var exitADialogRow = HelpContent.labelWithIcon( exitADialogText, exitADialogIcon, {
      accessibleLabel: exitDialogDescriptionString
    } );

    var content = [];
    if ( options.withGroupContent ) {

      // if the general navigation section includes help content includes groups, modify some text and add another
      // section to describe how to navigate groups
      moveToNextItemText.setText( keyboardHelpDialogMoveToNextItemOrGroupString );
      moveToPreviousItemText.setText( keyboardHelpDialogMoveToPreviousItemOrGroupString );

      var moveBetweenItemsInAGroupText = new RichText( keyboardHelpDialogMoveBetweenItemsInAGroupString, labelOptions );
      var leftRightArrowsIcon = HelpContent.leftRightArrowKeysRowIcon();
      var upDownArrowsIcon = HelpContent.upDownArrowKeysRowIcon();
      var leftRightOrUpDownIcon = HelpContent.iconOrIcon( leftRightArrowsIcon, upDownArrowsIcon );
      var moveBetweenItemsInAGroupRow = HelpContent.labelWithIcon( moveBetweenItemsInAGroupText, leftRightOrUpDownIcon, {
        accessibleLabel: groupNavigationDescriptionString
      } );

      content = [ moveToNextItemRow, moveToPreviousItemRow, moveBetweenItemsInAGroupRow, exitADialogRow ];
    }
    else {
      content = [ moveToNextItemRow, moveToPreviousItemRow, exitADialogRow ];
    }

    HelpContent.call( this, keyboardHelpDialogGeneralNavigationString, content, options );
  }

  sceneryPhet.register( 'GeneralNavigationHelpContent', GeneralNavigationHelpContent );

  return inherit( HelpContent, GeneralNavigationHelpContent, {} );
} );
