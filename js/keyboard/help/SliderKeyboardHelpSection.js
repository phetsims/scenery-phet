// Copyright 2017-2020, University of Colorado Boulder

/**
 * Content for a KeyboardHelpDialog that describes how to use sliders.
 *
 * @author Jesse Greenberg
 */

import merge from '../../../../phet-core/js/merge.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import sceneryPhet from '../../sceneryPhet.js';
import sceneryPhetStrings from '../../sceneryPhetStrings.js';
import TextKeyNode from '../TextKeyNode.js';
import KeyboardHelpIconFactory from './KeyboardHelpIconFactory.js';
import KeyboardHelpSection from './KeyboardHelpSection.js';

class SliderKeyboardHelpSection extends KeyboardHelpSection {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {

      // heading string for this content
      headingString: sceneryPhetStrings.keyboardHelpDialog.sliderControls,

      // verb used to describe the movement of the slider
      verbString: sceneryPhetStrings.keyboardHelpDialog.adjust,

      // name to call the slider (lowercase), default to "slider"
      sliderString: sceneryPhetStrings.keyboardHelpDialog.slider,

      maximumString: sceneryPhetStrings.keyboardHelpDialog.maximum,
      minimumString: sceneryPhetStrings.keyboardHelpDialog.minimum
    }, options );

    const keyboardHelpDialogVerbSliderString = StringUtils.fillIn( sceneryPhetStrings.keyboardHelpDialog.verbSliderPattern, {
      verb: options.verbString,
      slider: options.sliderString
    } );
    const keyboardHelpDialogVerbInSmallerStepsString = StringUtils.fillIn( sceneryPhetStrings.keyboardHelpDialog.verbInSmallerStepsPattern, {
      verb: options.verbString
    } );
    const keyboardHelpDialogVerbInLargerStepsString = StringUtils.fillIn( sceneryPhetStrings.keyboardHelpDialog.verbInLargerStepsPattern, {
      verb: options.verbString
    } );

    const keyboardHelpDialogDefaultStepsString = StringUtils.fillIn( sceneryPhetStrings.a11y.keyboardHelpDialog.slider.defaultStepsDescriptionPattern, {
      verb: options.verbString,
      slider: options.sliderString
    } );
    const keyboardHelpDialogSmallerStepsString = StringUtils.fillIn( sceneryPhetStrings.a11y.keyboardHelpDialog.slider.smallerStepsDescriptionPattern, {
      verb: options.verbString
    } );
    const keyboardHelpDialogLargerStepsString = StringUtils.fillIn( sceneryPhetStrings.a11y.keyboardHelpDialog.slider.largerStepsDescriptionPattern, {
      verb: options.verbString
    } );

    const jumpToMinimumString = StringUtils.fillIn( sceneryPhetStrings.keyboardHelpDialog.jumpToMinimumPattern, {
      minimum: options.minimumString
    } );
    const jumpToMaximumString = StringUtils.fillIn( sceneryPhetStrings.keyboardHelpDialog.jumpToMaximumPattern, {
      maximum: options.maximumString
    } );
    const jumpToMinimumDescriptionString = StringUtils.fillIn( sceneryPhetStrings.a11y.keyboardHelpDialog.slider.jumpToMinimumDescriptionPattern, {
      minimum: options.minimumString
    } );
    const jumpToMaximumDescriptionString = StringUtils.fillIn( sceneryPhetStrings.a11y.keyboardHelpDialog.slider.jumpToMaximumDescriptionPattern, {
      maximum: options.maximumString
    } );

    // 'Move sliders' content
    const adjustSliderLeftRightIcon = KeyboardHelpIconFactory.leftRightArrowKeysRowIcon();
    const adjustSliderUpDownIcon = KeyboardHelpIconFactory.upDownArrowKeysRowIcon();
    const adjustSliderIcon = KeyboardHelpIconFactory.iconOrIcon( adjustSliderLeftRightIcon, adjustSliderUpDownIcon );
    const adjustSliderRow = KeyboardHelpSection.labelWithIcon( keyboardHelpDialogVerbSliderString, adjustSliderIcon, keyboardHelpDialogDefaultStepsString );

    // 'move in smaller steps' content
    const smallStepsLeftRightIcon = KeyboardHelpIconFactory.leftRightArrowKeysRowIcon();
    const smallStepsUpDownIcon = KeyboardHelpIconFactory.upDownArrowKeysRowIcon();

    const shiftPlusLeftRightIcon = KeyboardHelpIconFactory.shiftPlusIcon( smallStepsLeftRightIcon );
    const shiftPlusUpDownIcon = KeyboardHelpIconFactory.shiftPlusIcon( smallStepsUpDownIcon );

    const adjustSliderInSmallerStepsRow = KeyboardHelpSection.labelWithIconList( keyboardHelpDialogVerbInSmallerStepsString,
      [ shiftPlusLeftRightIcon, shiftPlusUpDownIcon ], keyboardHelpDialogSmallerStepsString );

    // 'move in larger steps' content
    const pageUpKeyNode = TextKeyNode.pageUp();
    const pageDownKeyNode = TextKeyNode.pageDown();
    const pageUpPageDownIcon = new HBox( {
      children: [ pageUpKeyNode, pageDownKeyNode ],
      spacing: KeyboardHelpIconFactory.DEFAULT_ICON_SPACING
    } );
    const adjustInLargerStepsRow = KeyboardHelpSection.labelWithIcon( keyboardHelpDialogVerbInLargerStepsString, pageUpPageDownIcon, keyboardHelpDialogLargerStepsString );

    // 'move to minimum value' content
    const homeKeyNode = TextKeyNode.home();
    const jumpToMinimumRow = KeyboardHelpSection.labelWithIcon( jumpToMinimumString, homeKeyNode, jumpToMinimumDescriptionString );

    // 'move to maximum value' content
    const endKeyNode = TextKeyNode.end();
    const jumpToMaximumRow = KeyboardHelpSection.labelWithIcon( jumpToMaximumString, endKeyNode, jumpToMaximumDescriptionString );

    // assemble final content for KeyboardHelpSection
    const content = [ adjustSliderRow, adjustSliderInSmallerStepsRow, adjustInLargerStepsRow, jumpToMinimumRow, jumpToMaximumRow ];

    super( options.headingString, content, options );
  }
}

sceneryPhet.register( 'SliderKeyboardHelpSection', SliderKeyboardHelpSection );
export default SliderKeyboardHelpSection;