// Copyright 2017-2020, University of Colorado Boulder

/**
 * Content for a KeyboardHelpDialog that describes how to use sliders.
 *
 * @author Jesse Greenberg
 */

import inherit from '../../../../phet-core/js/inherit.js';
import merge from '../../../../phet-core/js/merge.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import sceneryPhetStrings from '../../sceneryPhetStrings.js';
import sceneryPhet from '../../sceneryPhet.js';
import EndKeyNode from '../EndKeyNode.js';
import HomeKeyNode from '../HomeKeyNode.js';
import PageDownKeyNode from '../PageDownKeyNode.js';
import PageUpKeyNode from '../PageUpKeyNode.js';
import KeyboardHelpIconFactory from './KeyboardHelpIconFactory.js';
import KeyboardHelpSection from './KeyboardHelpSection.js';

// constants
const keyboardHelpDialogAdjustInLargerStepsString = sceneryPhetStrings.keyboardHelpDialog.adjustInLargerSteps;
const keyboardHelpDialogAdjustInSmallerStepsString = sceneryPhetStrings.keyboardHelpDialog.adjustInSmallerSteps;
const keyboardHelpDialogAdjustSliderString = sceneryPhetStrings.keyboardHelpDialog.adjustSlider;
const keyboardHelpDialogJumpToMaximumString = sceneryPhetStrings.keyboardHelpDialog.jumpToMaximum;
const keyboardHelpDialogJumpToMinimumString = sceneryPhetStrings.keyboardHelpDialog.jumpToMinimum;
const keyboardHelpDialogSliderControlsString = sceneryPhetStrings.keyboardHelpDialog.sliderControls;
const keyboardHelpDialogAdjustLargerStepsString = sceneryPhetStrings.a11y.keyboardHelpDialog.slider.adjustLargerStepsString;
const keyboardHelpDialogJumpToHomeString = sceneryPhetStrings.a11y.keyboardHelpDialog.slider.jumpToHomeString;
const keyboardHelpDialogJumpToEndString = sceneryPhetStrings.a11y.keyboardHelpDialog.slider.jumpToEndString;
const keyboardHelpDialogAdjustDefaultStepsString = sceneryPhetStrings.a11y.keyboardHelpDialog.slider.adjustDefaultStepsString;
const keyboardHelpDialogAdjustSmallerStepsString = sceneryPhetStrings.a11y.keyboardHelpDialog.slider.adjustSmallerStepsString;

/**
 * @constructor
 * @param {Object} [options]
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

inherit( KeyboardHelpSection, SliderKeyboardHelpSection );
export default SliderKeyboardHelpSection;