// Copyright 2017-2020, University of Colorado Boulder

/**
 * Content for a KeyboardHelpDialog that describes how to use sliders.
 *
 * @author Jesse Greenberg
 */
define( require => {
  'use strict';

  // modules
  const EndKeyNode = require( 'SCENERY_PHET/keyboard/EndKeyNode' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const HomeKeyNode = require( 'SCENERY_PHET/keyboard/HomeKeyNode' );
  const inherit = require( 'PHET_CORE/inherit' );
  const KeyboardHelpIconFactory = require( 'SCENERY_PHET/keyboard/help/KeyboardHelpIconFactory' );
  const KeyboardHelpSection = require( 'SCENERY_PHET/keyboard/help/KeyboardHelpSection' );
  const merge = require( 'PHET_CORE/merge' );
  const PageDownKeyNode = require( 'SCENERY_PHET/keyboard/PageDownKeyNode' );
  const PageUpKeyNode = require( 'SCENERY_PHET/keyboard/PageUpKeyNode' );
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  const SceneryPhetA11yStrings = require( 'SCENERY_PHET/SceneryPhetA11yStrings' );

  // strings
  const keyboardHelpDialogAdjustInLargerStepsString = require( 'string!SCENERY_PHET/keyboardHelpDialog.adjustInLargerSteps' );
  const keyboardHelpDialogAdjustInSmallerStepsString = require( 'string!SCENERY_PHET/keyboardHelpDialog.adjustInSmallerSteps' );
  const keyboardHelpDialogAdjustSliderString = require( 'string!SCENERY_PHET/keyboardHelpDialog.adjustSlider' );
  const keyboardHelpDialogJumpToMaximumString = require( 'string!SCENERY_PHET/keyboardHelpDialog.jumpToMaximum' );
  const keyboardHelpDialogJumpToMinimumString = require( 'string!SCENERY_PHET/keyboardHelpDialog.jumpToMinimum' );
  const keyboardHelpDialogSliderControlsString = require( 'string!SCENERY_PHET/keyboardHelpDialog.sliderControls' );

  // a11y strings
  const keyboardHelpDialogAdjustLargerStepsString = SceneryPhetA11yStrings.keyboardHelpDialogAdjustLargerStepsString.value;
  const keyboardHelpDialogJumpToHomeString = SceneryPhetA11yStrings.keyboardHelpDialogJumpToHomeString.value;
  const keyboardHelpDialogJumpToEndString = SceneryPhetA11yStrings.keyboardHelpDialogJumpToEndString.value;
  const keyboardHelpDialogAdjustDefaultStepsString = SceneryPhetA11yStrings.keyboardHelpDialogAdjustDefaultStepsString.value;
  const keyboardHelpDialogAdjustSmallerStepsString = SceneryPhetA11yStrings.keyboardHelpDialogAdjustSmallerStepsString.value;

  /**
   * @constructor
   * @param {Object} options
   */
  function SliderKeyboardHelpSection( options ) {

    options = merge( {

      // heading string for this content
      headingString: keyboardHelpDialogSliderControlsString
    }, options );

    // 'Move sliders' content
    const adjustSliderLeftRightIcon = KeyboardHelpIconFactory.leftRightArrowKeysRowIcon();
    const adjustSliderUpDownIcon = KeyboardHelpIconFactory.upDownArrowKeysRowIcon();
    const adjustSliderIcon = KeyboardHelpIconFactory.iconOrIcon( adjustSliderLeftRightIcon, adjustSliderUpDownIcon );
    const adjustSliderRow = KeyboardHelpSection.labelWithIcon( keyboardHelpDialogAdjustSliderString, adjustSliderIcon, keyboardHelpDialogAdjustDefaultStepsString );

    // 'move in smaller steps' content
    const smallStepsLeftRightIcon = KeyboardHelpIconFactory.leftRightArrowKeysRowIcon();
    const smallStepsUpDownIcon = KeyboardHelpIconFactory.upDownArrowKeysRowIcon();

    const shiftPlusLeftRightIcon = KeyboardHelpIconFactory.shiftPlusIcon( smallStepsLeftRightIcon );
    const shiftPlusUpDownIcon = KeyboardHelpIconFactory.shiftPlusIcon( smallStepsUpDownIcon );

    const adjustSliderInSmallerStepsRow = KeyboardHelpSection.labelWithIconList( keyboardHelpDialogAdjustInSmallerStepsString, [ shiftPlusLeftRightIcon, shiftPlusUpDownIcon ], keyboardHelpDialogAdjustSmallerStepsString );

    // 'move in larger steps' content
    const pageUpKeyNode = new PageUpKeyNode();
    const pageDownKeyNode = new PageDownKeyNode();
    const pageUpPageDownIcon = new HBox( {
      children: [ pageUpKeyNode, pageDownKeyNode ],
      spacing: KeyboardHelpIconFactory.DEFAULT_ICON_SPACING
    } );
    const adjustInLargerStepsRow = KeyboardHelpSection.labelWithIcon( keyboardHelpDialogAdjustInLargerStepsString, pageUpPageDownIcon, keyboardHelpDialogAdjustLargerStepsString );

    // 'move to minimum value' content
    const homeKeyNode = new HomeKeyNode();
    const jumpToMinimumRow = KeyboardHelpSection.labelWithIcon( keyboardHelpDialogJumpToMinimumString, homeKeyNode, keyboardHelpDialogJumpToHomeString );

    // 'move to maximum value' content
    const endKeyNode = new EndKeyNode();
    const jumpToMaximumRow = KeyboardHelpSection.labelWithIcon( keyboardHelpDialogJumpToMaximumString, endKeyNode, keyboardHelpDialogJumpToEndString );

    // assemble final content for KeyboardHelpSection
    const content = [ adjustSliderRow, adjustSliderInSmallerStepsRow, adjustInLargerStepsRow, jumpToMinimumRow, jumpToMaximumRow ];

    KeyboardHelpSection.call( this, options.headingString, content, options );
  }

  sceneryPhet.register( 'SliderKeyboardHelpSection', SliderKeyboardHelpSection );

  return inherit( KeyboardHelpSection, SliderKeyboardHelpSection );
} );
