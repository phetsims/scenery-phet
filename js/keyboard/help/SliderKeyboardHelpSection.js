// Copyright 2017-2019, University of Colorado Boulder

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
  var KeyboardHelpSection = require( 'SCENERY_PHET/keyboard/help/KeyboardHelpSection' );
  var HomeKeyNode = require( 'SCENERY_PHET/keyboard/HomeKeyNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PageDownKeyNode = require( 'SCENERY_PHET/keyboard/PageDownKeyNode' );
  var PageUpKeyNode = require( 'SCENERY_PHET/keyboard/PageUpKeyNode' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var SceneryPhetA11yStrings = require( 'SCENERY_PHET/SceneryPhetA11yStrings' );

  // strings
  var keyboardHelpDialogAdjustInLargerStepsString = require( 'string!SCENERY_PHET/keyboardHelpDialog.adjustInLargerSteps' );
  var keyboardHelpDialogAdjustInSmallerStepsString = require( 'string!SCENERY_PHET/keyboardHelpDialog.adjustInSmallerSteps' );
  var keyboardHelpDialogAdjustSliderString = require( 'string!SCENERY_PHET/keyboardHelpDialog.adjustSlider' );
  var keyboardHelpDialogJumpToMaximumString = require( 'string!SCENERY_PHET/keyboardHelpDialog.jumpToMaximum' );
  var keyboardHelpDialogJumpToMinimumString = require( 'string!SCENERY_PHET/keyboardHelpDialog.jumpToMinimum' );
  var keyboardHelpDialogSliderControlsString = require( 'string!SCENERY_PHET/keyboardHelpDialog.sliderControls' );

  // a11y strings
  var keyboardHelpDialogAdjustLargerStepsString = SceneryPhetA11yStrings.keyboardHelpDialogAdjustLargerStepsString.value;
  var keyboardHelpDialogJumpToHomeString = SceneryPhetA11yStrings.keyboardHelpDialogJumpToHomeString.value;
  var keyboardHelpDialogJumpToEndString = SceneryPhetA11yStrings.keyboardHelpDialogJumpToEndString.value;
  var keyboardHelpDialogAdjustDefaultStepsString = SceneryPhetA11yStrings.keyboardHelpDialogAdjustDefaultStepsString.value;
  var keyboardHelpDialogAdjustSmallerStepsString = SceneryPhetA11yStrings.keyboardHelpDialogAdjustSmallerStepsString.value;

  /**
   * @constructor
   * @param {Object} options
   */
  function SliderKeyboardHelpSection( options ) {

    options = _.extend( {

      // heading string for this content
      headingString: keyboardHelpDialogSliderControlsString
    }, options );

    // 'Move sliders' content
    var adjustSliderLeftRightIcon = KeyboardHelpSection.leftRightArrowKeysRowIcon();
    var adjustSliderUpDownIcon = KeyboardHelpSection.upDownArrowKeysRowIcon();
    var adjustSliderIcon = KeyboardHelpSection.iconOrIcon( adjustSliderLeftRightIcon, adjustSliderUpDownIcon );
    var adjustSliderRow = KeyboardHelpSection.labelWithIcon( keyboardHelpDialogAdjustSliderString, adjustSliderIcon, keyboardHelpDialogAdjustDefaultStepsString );

    // 'move in smaller steps' content
    var smallStepsLeftRightIcon = KeyboardHelpSection.leftRightArrowKeysRowIcon();
    var smallStepsUpDownIcon = KeyboardHelpSection.upDownArrowKeysRowIcon();

    var shiftPlusLeftRightIcon = KeyboardHelpSection.shiftPlusIcon( smallStepsLeftRightIcon );
    var shiftPlusUpDownIcon = KeyboardHelpSection.shiftPlusIcon( smallStepsUpDownIcon );

    var adjustSliderInSmallerStepsRow = KeyboardHelpSection.labelWithIconList( keyboardHelpDialogAdjustInSmallerStepsString, [ shiftPlusLeftRightIcon, shiftPlusUpDownIcon ], keyboardHelpDialogAdjustSmallerStepsString );

    // 'move in larger steps' content
    var pageUpKeyNode = new PageUpKeyNode();
    var pageDownKeyNode = new PageDownKeyNode();
    var pageUpPageDownIcon = new HBox( {
      children: [ pageUpKeyNode, pageDownKeyNode ],
      spacing: KeyboardHelpSection.DEFAULT_ICON_SPACING
    } );
    var adjustInLargerStepsRow = KeyboardHelpSection.labelWithIcon( keyboardHelpDialogAdjustInLargerStepsString, pageUpPageDownIcon, keyboardHelpDialogAdjustLargerStepsString );

    // 'move to minimum value' content
    var homeKeyNode = new HomeKeyNode();
    var jumpToMinimumRow = KeyboardHelpSection.labelWithIcon( keyboardHelpDialogJumpToMinimumString, homeKeyNode, keyboardHelpDialogJumpToHomeString );

    // 'move to maximum value' content
    var endKeyNode = new EndKeyNode();
    var jumpToMaximumRow = KeyboardHelpSection.labelWithIcon( keyboardHelpDialogJumpToMaximumString, endKeyNode, keyboardHelpDialogJumpToEndString );

    // assemble final content for KeyboardHelpSection
    var content = [ adjustSliderRow, adjustSliderInSmallerStepsRow, adjustInLargerStepsRow, jumpToMinimumRow, jumpToMaximumRow ];

    KeyboardHelpSection.call( this, options.headingString, content, options );
  }

  sceneryPhet.register( 'SliderKeyboardHelpSection', SliderKeyboardHelpSection );

  return inherit( KeyboardHelpSection, SliderKeyboardHelpSection );
} );
