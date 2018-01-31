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
  var HBox = require( 'SCENERY/nodes/HBox' );
  var HelpContent = require( 'SCENERY_PHET/keyboard/help/HelpContent' );
  var HomeKeyNode = require( 'SCENERY_PHET/keyboard/HomeKeyNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PageDownKeyNode = require( 'SCENERY_PHET/keyboard/PageDownKeyNode' );
  var PageUpKeyNode = require( 'SCENERY_PHET/keyboard/PageUpKeyNode' );
  var RichText = require( 'SCENERY/nodes/RichText' );
  var SceneryPhetA11yStrings = require( 'SCENERY_PHET/SceneryPhetA11yStrings' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );

  // strings
  var keyboardHelpDialogAdjustInLargerStepsString = require( 'string!SCENERY_PHET/keyboardHelpDialog.adjustInLargerSteps' );
  var keyboardHelpDialogAdjustInSmallerStepsString = require( 'string!SCENERY_PHET/keyboardHelpDialog.adjustInSmallerSteps' );
  var keyboardHelpDialogAdjustSliderString = require( 'string!SCENERY_PHET/keyboardHelpDialog.adjustSlider' );
  var keyboardHelpDialogJumpToMaximumString = require( 'string!SCENERY_PHET/keyboardHelpDialog.jumpToMaximum' );
  var keyboardHelpDialogJumpToMinimumString = require( 'string!SCENERY_PHET/keyboardHelpDialog.jumpToMinimum' );
  var keyboardHelpDialogSliderControlsString = require( 'string!SCENERY_PHET/keyboardHelpDialog.sliderControls' );

  // AT strings, not yet translatable
  var keyboardHelpDialogShiftLeftRightString = SceneryPhetA11yStrings.keyboardHelpDialogShiftLeftRightString.value;
  var keyboardHelpDialogShiftUpDownString = SceneryPhetA11yStrings.keyboardHelpDialogShiftUpDownString.value;
  var keyboardHelpDialogUpDownString = SceneryPhetA11yStrings.keyboardHelpDialogUpDownString.value;
  var keyboardHelpDialogLeftRightString = SceneryPhetA11yStrings.keyboardHelpDialogLeftRightString.value;
  var keyboardHelpDialogAdjustLargerStepsString = SceneryPhetA11yStrings.keyboardHelpDialogAdjustLargerStepsString.value;
  var keyboardHelpDialogJumpToHomeString = SceneryPhetA11yStrings.keyboardHelpDialogJumpToHomeString.value;
  var keyboardHelpDialogJumpToEndString = SceneryPhetA11yStrings.keyboardHelpDialogJumpToEndString.value;

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

      // heading string for this content
      headingString: keyboardHelpDialogSliderControlsString,

      // icon options
      verticalIconSpacing: HelpContent.DEFAULT_VERTICAL_ICON_SPACING
    }, options );

    // 'Move sliders' content
    var adjustSliderText = new RichText( keyboardHelpDialogAdjustSliderString, DEFAULT_LABEL_OPTIONS );
    var adjustSliderLeftRightIcon = HelpContent.leftRightArrowKeysRowIcon( { accessibleLabel: keyboardHelpDialogLeftRightString } );
    var adjustSliderUpDownIcon = HelpContent.upDownArrowKeysRowIcon( { accessibleLabel: keyboardHelpDialogUpDownString } );
    var adjustSliderIcon = HelpContent.iconOrIcon( adjustSliderLeftRightIcon, adjustSliderUpDownIcon );
    var adjustSliderRow = HelpContent.labelWithIcon( adjustSliderText, adjustSliderIcon, {
      a11yIconAccessibleLabel: keyboardHelpDialogAdjustSliderString,
      a11yIconTagName: 'ul',
      a11yIconLabelTagName: 'p',
      a11yIconParentContainerTagName: 'li',
      a11yIconPrependLabels: true
    } );

    // 'move in smaller steps' content
    var adjustInSmallerStepsText = new RichText( keyboardHelpDialogAdjustInSmallerStepsString, DEFAULT_LABEL_OPTIONS );
    var smallStepsLeftRightIcon = HelpContent.leftRightArrowKeysRowIcon( { accessibleLabel: keyboardHelpDialogShiftLeftRightString } );
    var smallStepsUpDownIcon = HelpContent.upDownArrowKeysRowIcon( { accessibleLabel: keyboardHelpDialogShiftUpDownString } );

    var shiftPlusLeftRightIcon = HelpContent.shiftPlusIcon( smallStepsLeftRightIcon );
    var shiftPlusUpDownIcon = HelpContent.shiftPlusIcon( smallStepsUpDownIcon );

    var adjustSliderInSmallerStepsRow = HelpContent.labelWithIconList( adjustInSmallerStepsText, [
      shiftPlusLeftRightIcon,
      shiftPlusUpDownIcon
    ], { a11yIconAccessibleLabel: keyboardHelpDialogAdjustInSmallerStepsString } );

    // 'move in larger steps' content
    var adjustInLargerStepsText = new RichText( keyboardHelpDialogAdjustInLargerStepsString, DEFAULT_LABEL_OPTIONS );
    var pageUpKeyNode = new PageUpKeyNode();
    var pageDownKeyNode = new PageDownKeyNode();
    var pageUpPageDownIcon = new HBox( {
      children: [ pageUpKeyNode, pageDownKeyNode ],
      spacing: HelpContent.DEFAULT_ICON_SPACING
    } );
    var adjustInLargerStepsRow = HelpContent.labelWithIcon( adjustInLargerStepsText, pageUpPageDownIcon, {
      a11yIconAccessibleLabel: keyboardHelpDialogAdjustLargerStepsString
    } );

    // 'move to minimum value' content
    var jumpToMinimumText = new RichText( keyboardHelpDialogJumpToMinimumString, DEFAULT_LABEL_OPTIONS );
    var homeKeyNode = new HomeKeyNode();
    var jumpToMinimumRow = HelpContent.labelWithIcon( jumpToMinimumText, homeKeyNode, {
      a11yIconAccessibleLabel: keyboardHelpDialogJumpToHomeString
    } );

    // 'move to maximum value' content
    var jumpToMaximumText = new RichText( keyboardHelpDialogJumpToMaximumString, DEFAULT_LABEL_OPTIONS );
    var endKeyNode = new EndKeyNode();
    var jumpToMaximumRow = HelpContent.labelWithIcon( jumpToMaximumText, endKeyNode, {
      a11yIconAccessibleLabel: keyboardHelpDialogJumpToEndString
    } );

    // assemble final content for HelpContent
    var content = [ adjustSliderRow, adjustSliderInSmallerStepsRow, adjustInLargerStepsRow, jumpToMinimumRow, jumpToMaximumRow ];
    
    HelpContent.call( this, options.headingString, content, options );
  }

  sceneryPhet.register( 'SliderControlsHelpContent', SliderControlsHelpContent );

  return inherit( HelpContent, SliderControlsHelpContent );
} );
