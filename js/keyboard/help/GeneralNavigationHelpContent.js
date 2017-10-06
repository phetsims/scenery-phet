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
  var VBox = require( 'SCENERY/nodes/VBox' );

  var HelpContent = require( 'SCENERY_PHET/keyboard/help/HelpContent' );

  // stings
  var generalNavigationString = require( 'string!SCENERY_PHET/generalNavigation' );
  var moveToNextItemString = require( 'string!SCENERY_PHET/moveToNextItem' );
  var moveToPreviousItemString = require( 'string!SCENERY_PHET/moveToPreviousItem' );
  var exitADialogString = require( 'string!SCENERY_PHET/exitADialog' );

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

    // content aligned in a VBox
    var content = new VBox( {
      children: [ moveToNextItemRow, moveToPreviousItemRow, exitADialogRow ],
      align: 'left',
      spacing: options.verticalIconSpacing
    } );

    HelpContent.call( this, generalNavigationString, content, options );
  }

  sceneryPhet.register( 'GeneralNavigationHelpContent', GeneralNavigationHelpContent );

  return inherit( HelpContent, GeneralNavigationHelpContent, {} );
} );
