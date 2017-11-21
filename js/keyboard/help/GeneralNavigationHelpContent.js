// Copyright 2017, University of Colorado Boulder

/**
 * Type Documentation
 * @author Jesse Greenberg
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var RichText = require( 'SCENERY/nodes/RichText' );
  var TabKeyNode = require( 'SCENERY_PHET/keyboard/TabKeyNode' );
  var EscapeKeyNode = require( 'SCENERY_PHET/keyboard/EscapeKeyNode' );
  var Tandem = require( 'TANDEM/Tandem' );

  var HelpContent = require( 'SCENERY_PHET/keyboard/help/HelpContent' );

  // stings
  var keyboardHelpDialogExitADialogString = require( 'string!SCENERY_PHET/keyboardHelpDialog.exitADialog' );
  var keyboardHelpDialogGeneralNavigationString = require( 'string!SCENERY_PHET/keyboardHelpDialog.generalNavigation' );
  var keyboardHelpDialogMoveToNextItemString = require( 'string!SCENERY_PHET/keyboardHelpDialog.moveToNextItem' );
  var keyboardHelpDialogMoveToPreviousItemString = require( 'string!SCENERY_PHET/keyboardHelpDialog.moveToPreviousItem' );

  // constants
  function GeneralNavigationHelpContent( options ) {

    options = _.extend( {
      verticalIconSpacing: HelpContent.DEFAULT_VERTICAL_ICON_SPACING,
      labelFont: HelpContent.DEFAULT_LABEL_FONT,
      labelMaxWidth: HelpContent.DEFAULT_TEXT_MAX_WIDTH,
      tandem: Tandem.tandemRequired(),
    }, options );

    var labelOptions = {
      font: options.labelFont,
      maxWidth: options.labelMaxWidth
    };

    // 'move to next item' content
    var moveToNextItemText = new RichText( keyboardHelpDialogMoveToNextItemString, labelOptions );
    var moveToNextItemIcon = new TabKeyNode();
    var moveToNextItemRow = HelpContent.labelWithIcon( moveToNextItemText, moveToNextItemIcon );

    // 'move to previous item' content
    var moveToPreviousItemText = new RichText( keyboardHelpDialogMoveToPreviousItemString, labelOptions );
    var tabIcon = new TabKeyNode();
    var moveToPreviousItemIcon = HelpContent.shiftPlusIcon( tabIcon );
    var moveToPreviousItemRow = HelpContent.labelWithIcon( moveToPreviousItemText, moveToPreviousItemIcon );

    // 'exit a dialog' content
    var exitADialogText = new RichText( keyboardHelpDialogExitADialogString, labelOptions );
    var exitADialogIcon = new EscapeKeyNode();
    var exitADialogRow = HelpContent.labelWithIcon( exitADialogText, exitADialogIcon );

    var content = [ moveToNextItemRow, moveToPreviousItemRow, exitADialogRow ];
    HelpContent.call( this, keyboardHelpDialogGeneralNavigationString, content, options );
  }

  sceneryPhet.register( 'GeneralNavigationHelpContent', GeneralNavigationHelpContent );

  return inherit( HelpContent, GeneralNavigationHelpContent, {} );
} );
