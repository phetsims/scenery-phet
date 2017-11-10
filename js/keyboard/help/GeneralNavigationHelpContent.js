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
  var TabKeyNode = require( 'SCENERY_PHET/keyboard/TabKeyNode' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // stings
  var exitADialogString = require( 'string!SCENERY_PHET/exitADialog' );
  var generalNavigationString = require( 'string!SCENERY_PHET/generalNavigation' );
  var moveBetweenItemsInAGroupString = require( 'string!SCENERY_PHET/moveBetweenItemsInAGroup' );
  var moveToNextItemOrGroupString = require( 'string!SCENERY_PHET/moveToNextItemOrGroup' );
  var moveToNextItemString = require( 'string!SCENERY_PHET/moveToNextItem' );
  var moveToPreviousItemOrGroupString = require( 'string!SCENERY_PHET/moveToPreviousItemOrGroup' );
  var moveToPreviousItemString = require( 'string!SCENERY_PHET/moveToPreviousItem' );

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
    var moveToNextItemText = new RichText( moveToNextItemString, labelOptions );
    var moveToNextItemIcon = new TabKeyNode();
    var moveToNextItemRow = HelpContent.labelWithIcon( moveToNextItemText, moveToNextItemIcon );

    // 'move to previous item' content
    var moveToPreviousItemText = new RichText( moveToPreviousItemString, labelOptions );
    var tabIcon = new TabKeyNode();
    var moveToPreviousItemIcon = HelpContent.shiftPlusIcon( tabIcon );
    var moveToPreviousItemRow = HelpContent.labelWithIcon( moveToPreviousItemText, moveToPreviousItemIcon );

    // 'exit a dialog' content
    var exitADialogText = new RichText( exitADialogString, labelOptions );
    var exitADialogIcon = new EscapeKeyNode();
    var exitADialogRow = HelpContent.labelWithIcon( exitADialogText, exitADialogIcon );

    var contentChildren = [];
    if ( options.withGroupContent ) {

      // if the general navigation section includes help content includes groups, modify some text and add another
      // section to describe how to navigate groups
      moveToNextItemText.setText( moveToNextItemOrGroupString );
      moveToPreviousItemText.setText( moveToPreviousItemOrGroupString );

      var moveBetweenItemsInAGroupText = new RichText( moveBetweenItemsInAGroupString, labelOptions );
      var leftRightArrowsIcon = HelpContent.leftRightArrowKeysRowIcon();
      var upDownArrowsIcon = HelpContent.upDownArrowKeysRowIcon();
      var leftRightOrUpDownIcon = HelpContent.iconOrIcon( leftRightArrowsIcon, upDownArrowsIcon );
      var moveBetweenItemsInAGroupRow = HelpContent.labelWithIcon( moveBetweenItemsInAGroupText, leftRightOrUpDownIcon );

      contentChildren = [ moveToNextItemRow, moveToPreviousItemRow, moveBetweenItemsInAGroupRow, exitADialogRow ];
    }
    else {
      contentChildren = [ moveToNextItemRow, moveToPreviousItemRow, exitADialogRow ];
    }

    // content aligned in a VBox
    var content = new VBox( {
      children: contentChildren,
      align: 'left',
      spacing: options.verticalIconSpacing
    } );

    HelpContent.call( this, generalNavigationString, content, options );
  }

  sceneryPhet.register( 'GeneralNavigationHelpContent', GeneralNavigationHelpContent );

  return inherit( HelpContent, GeneralNavigationHelpContent, {} );
} );
