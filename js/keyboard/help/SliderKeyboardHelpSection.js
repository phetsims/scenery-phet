// Copyright 2017-2021, University of Colorado Boulder

/**
 * Content for a KeyboardHelpDialog that describes how to use sliders.
 *
 * @author Jesse Greenberg
 */

import validate from '../../../../axon/js/validate.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import merge from '../../../../phet-core/js/merge.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import sceneryPhet from '../../sceneryPhet.js';
import sceneryPhetStrings from '../../sceneryPhetStrings.js';
import TextKeyNode from '../TextKeyNode.js';
import KeyboardHelpIconFactory from './KeyboardHelpIconFactory.js';
import KeyboardHelpSection from './KeyboardHelpSection.js';

const ArrowKeyIconDisplay = Enumeration.byKeys( [ 'UP_DOWN', 'LEFT_RIGHT', 'BOTH' ] );

class SliderKeyboardHelpSection extends KeyboardHelpSection {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {

      // {ArrowKeyIconDisplay} - Whether to show up/down, left/right or both sets of keyboard help icons to cue the
      // slider interaction.
      arrowKeyIconDisplay: ArrowKeyIconDisplay.BOTH,

      // heading string for this content
      headingString: sceneryPhetStrings.keyboardHelpDialog.sliderControls,

      // verb used to describe the movement of the slider
      verbString: sceneryPhetStrings.keyboardHelpDialog.adjust,

      // name to call the slider (lowercase), default to "slider"
      sliderString: sceneryPhetStrings.keyboardHelpDialog.slider,

      maximumString: sceneryPhetStrings.keyboardHelpDialog.maximum,
      minimumString: sceneryPhetStrings.keyboardHelpDialog.minimum
    }, options );

    validate( options.arrowKeyIconDisplay, { valueType: ArrowKeyIconDisplay } );

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

    const keysString = ArrowKeyIconDisplay.LEFT_RIGHT === options.arrowKeyIconDisplay ? sceneryPhetStrings.a11y.keyboardHelpDialog.slider.leftRightArrowKeys :
                       ArrowKeyIconDisplay.UP_DOWN === options.arrowKeyIconDisplay ? sceneryPhetStrings.a11y.keyboardHelpDialog.slider.upDownArrowKeys :
                       ArrowKeyIconDisplay.BOTH === options.arrowKeyIconDisplay ? StringUtils.fillIn( sceneryPhetStrings.a11y.keyboardHelpDialog.slider.orKeysPattern, {
                         leftRight: sceneryPhetStrings.a11y.keyboardHelpDialog.slider.leftRightArrowKeys,
                         upDown: sceneryPhetStrings.a11y.keyboardHelpDialog.slider.upDownArrowKeys
                       } ) : null;
    assert && assert( keysString );
    const keyboardHelpDialogDefaultStepsString = StringUtils.fillIn( sceneryPhetStrings.a11y.keyboardHelpDialog.slider.defaultStepsDescriptionPattern, {
      verb: options.verbString,
      slider: options.sliderString,
      keys: keysString
    } );

    const shiftKeysString = ArrowKeyIconDisplay.LEFT_RIGHT === options.arrowKeyIconDisplay ? sceneryPhetStrings.a11y.keyboardHelpDialog.slider.shiftLeftRightArrowKeys :
                            ArrowKeyIconDisplay.UP_DOWN === options.arrowKeyIconDisplay ? sceneryPhetStrings.a11y.keyboardHelpDialog.slider.shiftUpDownArrowKeys :
                            ArrowKeyIconDisplay.BOTH === options.arrowKeyIconDisplay ? StringUtils.fillIn( sceneryPhetStrings.a11y.keyboardHelpDialog.slider.orKeysPattern, {
                              leftRight: sceneryPhetStrings.a11y.keyboardHelpDialog.slider.shiftLeftRightArrowKeys,
                              upDown: sceneryPhetStrings.a11y.keyboardHelpDialog.slider.shiftUpDownArrowKeys
                            } ) : null;
    assert && assert( shiftKeysString );
    const keyboardHelpDialogSmallerStepsString = StringUtils.fillIn( sceneryPhetStrings.a11y.keyboardHelpDialog.slider.smallerStepsDescriptionPattern, {
      verb: options.verbString,
      keys: shiftKeysString
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


    const shiftPlusLeftRightIcon = KeyboardHelpIconFactory.shiftPlusIcon( KeyboardHelpIconFactory.leftRightArrowKeysRowIcon() );
    const shiftPlusUpDownIcon = KeyboardHelpIconFactory.shiftPlusIcon( KeyboardHelpIconFactory.upDownArrowKeysRowIcon() );

    let adjustSliderIcon = null;
    let adjustSliderSmallerStepsIcons = null;

    switch( options.arrowKeyIconDisplay ) {
      case ArrowKeyIconDisplay.LEFT_RIGHT:
        adjustSliderIcon = KeyboardHelpIconFactory.leftRightArrowKeysRowIcon();
        adjustSliderSmallerStepsIcons = [ shiftPlusLeftRightIcon ];
        break;
      case ArrowKeyIconDisplay.UP_DOWN:
        adjustSliderIcon = KeyboardHelpIconFactory.upDownArrowKeysRowIcon();
        adjustSliderSmallerStepsIcons = [ shiftPlusUpDownIcon ];
        break;
      default:
        assert && assert( options.arrowKeyIconDisplay === ArrowKeyIconDisplay.BOTH, 'unsupported arrowKeyIconDisplay' );
        adjustSliderIcon = KeyboardHelpIconFactory.iconOrIcon( KeyboardHelpIconFactory.leftRightArrowKeysRowIcon(), KeyboardHelpIconFactory.upDownArrowKeysRowIcon() );
        adjustSliderSmallerStepsIcons = [ shiftPlusLeftRightIcon, shiftPlusUpDownIcon ];
    }
    const adjustSliderRow = KeyboardHelpSection.labelWithIcon( keyboardHelpDialogVerbSliderString, adjustSliderIcon, keyboardHelpDialogDefaultStepsString );

    const adjustSliderInSmallerStepsRow = KeyboardHelpSection.labelWithIconList( keyboardHelpDialogVerbInSmallerStepsString,
      adjustSliderSmallerStepsIcons, keyboardHelpDialogSmallerStepsString );

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

// @public - for use in defining a component-specific option.
SliderKeyboardHelpSection.ArrowKeyIconDisplay = ArrowKeyIconDisplay;

sceneryPhet.register( 'SliderKeyboardHelpSection', SliderKeyboardHelpSection );
export default SliderKeyboardHelpSection;