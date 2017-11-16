// Copyright 2017, University of Colorado Boulder

/**
 * Content for a KeyboardHelpDialog that describes how to use sliders.
 * 
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var EndKeyNode = require( 'SCENERY_PHET/keyboard/EndKeyNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var RichText = require( 'SCENERY/nodes/RichText' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var Tandem = require( 'TANDEM/Tandem' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var HelpContent = require( 'SCENERY_PHET/keyboard/help/HelpContent' );
  var HomeKeyNode = require( 'SCENERY_PHET/keyboard/HomeKeyNode' );
  var PageDownKeyNode = require( 'SCENERY_PHET/keyboard/PageDownKeyNode' );
  var PageUpKeyNode = require( 'SCENERY_PHET/keyboard/PageUpKeyNode' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var keyboardHelpDialogAdjustInLargerStepsString = require( 'string!SCENERY_PHET/keyboardHelpDialog.adjustInLargerSteps' );
  var keyboardHelpDialogAdjustInSmallerStepsString = require( 'string!SCENERY_PHET/keyboardHelpDialog.adjustInSmallerSteps' );
  var keyboardHelpDialogAdjustSliderString = require( 'string!SCENERY_PHET/keyboardHelpDialog.adjustSlider' );
  var keyboardHelpDialogJumpToMaximumString = require( 'string!SCENERY_PHET/keyboardHelpDialog.jumpToMaximum' );
  var keyboardHelpDialogJumpToMinimumString = require( 'string!SCENERY_PHET/keyboardHelpDialog.jumpToMinimum' );
  var keyboardHelpDialogSliderControlsString = require( 'string!SCENERY_PHET/keyboardHelpDialog.sliderControls' );

  // constants
  var DEFAULT_LABEL_OPTIONS = {
    font: HelpContent.DEFAULT_LABEL_FONT,
    maxWidth: HelpContent.DEFAULT_TEXT_MAX_WIDTH
  };

  /**
   * @constructor
   * @param {Object} options
   */
  function SliderControlsHelpContent( options ) {

    options = _.extend( {
      tandem: Tandem.tandemRequired(),

      // icon options
      arrowKeysScale: 0.55,
      verticalIconSpacing: HelpContent.DEFAULT_VERTICAL_ICON_SPACING
    }, options );

    // 'Move sliders' content
    var adjustSliderText = new RichText( keyboardHelpDialogAdjustSliderString, DEFAULT_LABEL_OPTIONS );
    var adjustSliderLeftRightIcon = HelpContent.leftRightArrowKeysRowIcon( {
      scale: options.arrowKeysScale
    } );
    var adjustSliderUpDownIcon = HelpContent.upDownArrowKeysRowIcon( {
      scale: options.arrowKeysScale
    } );
    var adjustSliderIcon = HelpContent.iconOrIcon( adjustSliderLeftRightIcon, adjustSliderUpDownIcon );
    var adjustSliderRow = HelpContent.labelWithIcon( adjustSliderText, adjustSliderIcon );

    // 'move in smaller steps' content
    var adjustInSmallerStepsText = new RichText( keyboardHelpDialogAdjustInSmallerStepsString, DEFAULT_LABEL_OPTIONS );
    var smallStepsLeftRightIcon = HelpContent.leftRightArrowKeysRowIcon( {
      scale: options.arrowKeysScale
    } );
    var smallStepsUpDownIcon = HelpContent.upDownArrowKeysRowIcon( {
      scale: options.arrowKeysScale
    } );

    var shiftPlusLeftRightIcon = HelpContent.shiftPlusIcon( smallStepsLeftRightIcon );
    var shiftPlusUpDownIcon = HelpContent.shiftPlusIcon( smallStepsUpDownIcon );

    var adjustSliderInSmallerStepsRow = HelpContent.labelWithIconList( adjustInSmallerStepsText, [
      shiftPlusLeftRightIcon,
      shiftPlusUpDownIcon
    ] );

    // 'move in larger steps' content
    var adjustInLargerStepsText = new RichText( keyboardHelpDialogAdjustInLargerStepsString, DEFAULT_LABEL_OPTIONS );
    var pageUpKeyNode = new PageUpKeyNode();
    var pageDownKeyNode = new PageDownKeyNode();
    var pageUpPageDownIcon = new HBox( {
      children: [ pageUpKeyNode, pageDownKeyNode ],
      spacing: HelpContent.DEFAULT_ICON_SPACING
    } );
    var adjustInLargerStepsRow = HelpContent.labelWithIcon( adjustInLargerStepsText, pageUpPageDownIcon );

    // 'move to minimum value' content
    var jumpToMinimumText = new RichText( keyboardHelpDialogJumpToMinimumString, DEFAULT_LABEL_OPTIONS );
    var homeKeyNode = new HomeKeyNode();
    var jumpToMinimumRow = HelpContent.labelWithIcon( jumpToMinimumText, homeKeyNode );

    // 'move to maximum value' content
    var jumpToMaximumText = new RichText( keyboardHelpDialogJumpToMaximumString, DEFAULT_LABEL_OPTIONS );
    var endKeyNode = new EndKeyNode();
    var jumpToMaximumRow = HelpContent.labelWithIcon( jumpToMaximumText, endKeyNode );

    // content aligned in a VBox
    var content = new VBox( {
      children: [ adjustSliderRow, adjustSliderInSmallerStepsRow, adjustInLargerStepsRow, jumpToMinimumRow, jumpToMaximumRow ],
      align: 'left',
      spacing: options.verticalIconSpacing
    } );
     
    HelpContent.call( this, keyboardHelpDialogSliderControlsString, content, options );
  }

  sceneryPhet.register( 'SliderControlsHelpContent', SliderControlsHelpContent );

  return inherit( HelpContent, SliderControlsHelpContent );
} );
