// Copyright 2017-2022, University of Colorado Boulder

/**
 * Content for a KeyboardHelpDialog that describes how to use sliders.
 *
 * @author Jesse Greenberg
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import optionize from '../../../../phet-core/js/optionize.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import { HBox } from '../../../../scenery/js/imports.js';
import sceneryPhet from '../../sceneryPhet.js';
import SceneryPhetStrings from '../../SceneryPhetStrings.js';
import TextKeyNode from '../TextKeyNode.js';
import KeyboardHelpIconFactory from './KeyboardHelpIconFactory.js';
import KeyboardHelpSection, { KeyboardHelpSectionOptions } from './KeyboardHelpSection.js';
import KeyboardHelpSectionRow from './KeyboardHelpSectionRow.js';

// Configurations of arrow keys that can be displayed for 'Move between items in a group'
class ArrowKeyIconDisplay extends EnumerationValue {
  public static readonly UP_DOWN = new ArrowKeyIconDisplay();
  public static readonly LEFT_RIGHT = new ArrowKeyIconDisplay();
  public static readonly BOTH = new ArrowKeyIconDisplay();

  public static readonly enumeration = new Enumeration( ArrowKeyIconDisplay );
}

type SelfOptions = {

  // Whether to show up/down, left/right or both sets of keyboard help icons to cue the slider interaction.
  arrowKeyIconDisplay?: ArrowKeyIconDisplay;

  // heading string for this content
  headingString?: string | TReadOnlyProperty<string>;

  // verb used to describe the movement of the slider
  verbString?: string; //TODO https://github.com/phetsims/scenery-phet/issues/769 string | TReadOnlyProperty<string>

  // name to call the slider (lowercase), default to "slider"
  sliderString?: string; //TODO https://github.com/phetsims/scenery-phet/issues/769 string | TReadOnlyProperty<string>

  //TODO https://github.com/phetsims/scenery-phet/issues/769 document these while you're here
  maximumString?: string; //TODO https://github.com/phetsims/scenery-phet/issues/769 string | TReadOnlyProperty<string>
  minimumString?: string; //TODO https://github.com/phetsims/scenery-phet/issues/769 string | TReadOnlyProperty<string>
};

export type SliderControlsKeyboardHelpSectionOptions = SelfOptions & KeyboardHelpSectionOptions;

export default class SliderControlsKeyboardHelpSection extends KeyboardHelpSection {

  public static readonly ArrowKeyIconDisplay = ArrowKeyIconDisplay;

  public constructor( providedOptions?: SliderControlsKeyboardHelpSectionOptions ) {

    const options = optionize<SliderControlsKeyboardHelpSectionOptions, SelfOptions, KeyboardHelpSectionOptions>()( {
      arrowKeyIconDisplay: ArrowKeyIconDisplay.BOTH,
      headingString: SceneryPhetStrings.keyboardHelpDialog.sliderControlsStringProperty,

      //TODO https://github.com/phetsims/scenery-phet/issues/769 change all of these to *StringProperty
      verbString: SceneryPhetStrings.keyboardHelpDialog.adjust,
      sliderString: SceneryPhetStrings.keyboardHelpDialog.slider,
      maximumString: SceneryPhetStrings.keyboardHelpDialog.maximum,
      minimumString: SceneryPhetStrings.keyboardHelpDialog.minimum
    }, providedOptions );

    //TODO https://github.com/phetsims/scenery-phet/issues/769 convert all uses of StringUtils.fillIn to DerivedProperty
    const keyboardHelpDialogVerbSliderString = StringUtils.fillIn( SceneryPhetStrings.keyboardHelpDialog.verbSliderPattern, {
      verb: options.verbString,
      slider: options.sliderString
    } );
    const keyboardHelpDialogVerbInSmallerStepsString = StringUtils.fillIn( SceneryPhetStrings.keyboardHelpDialog.verbInSmallerStepsPattern, {
      verb: options.verbString
    } );
    const keyboardHelpDialogVerbInLargerStepsString = StringUtils.fillIn( SceneryPhetStrings.keyboardHelpDialog.verbInLargerStepsPattern, {
      verb: options.verbString
    } );

    //TODO https://github.com/phetsims/scenery-phet/issues/769 convert keysString and keyboardHelpDialogDefaultStepsString to DerivedProperty
    const keysString = ArrowKeyIconDisplay.LEFT_RIGHT === options.arrowKeyIconDisplay ? SceneryPhetStrings.a11y.keyboardHelpDialog.slider.leftRightArrowKeys :
                       ArrowKeyIconDisplay.UP_DOWN === options.arrowKeyIconDisplay ? SceneryPhetStrings.a11y.keyboardHelpDialog.slider.upDownArrowKeys :
                       ArrowKeyIconDisplay.BOTH === options.arrowKeyIconDisplay ? StringUtils.fillIn( SceneryPhetStrings.a11y.keyboardHelpDialog.slider.orKeysPattern, {
                         leftRight: SceneryPhetStrings.a11y.keyboardHelpDialog.slider.leftRightArrowKeys,
                         upDown: SceneryPhetStrings.a11y.keyboardHelpDialog.slider.upDownArrowKeys
                       } ) : null;
    assert && assert( keysString );
    const keyboardHelpDialogDefaultStepsString = StringUtils.fillIn( SceneryPhetStrings.a11y.keyboardHelpDialog.slider.defaultStepsDescriptionPattern, {
      verb: options.verbString,
      slider: options.sliderString,
      keys: keysString
    } );

    //TODO https://github.com/phetsims/scenery-phet/issues/769 convert shiftKeysString,keyboardHelpDialogSmallerStepsString, keyboardHelpDialogLargerStepsString to DerivedProperty
    const shiftKeysString = ArrowKeyIconDisplay.LEFT_RIGHT === options.arrowKeyIconDisplay ? SceneryPhetStrings.a11y.keyboardHelpDialog.slider.shiftLeftRightArrowKeys :
                            ArrowKeyIconDisplay.UP_DOWN === options.arrowKeyIconDisplay ? SceneryPhetStrings.a11y.keyboardHelpDialog.slider.shiftUpDownArrowKeys :
                            ArrowKeyIconDisplay.BOTH === options.arrowKeyIconDisplay ? StringUtils.fillIn( SceneryPhetStrings.a11y.keyboardHelpDialog.slider.orKeysPattern, {
                              leftRight: SceneryPhetStrings.a11y.keyboardHelpDialog.slider.shiftLeftRightArrowKeys,
                              upDown: SceneryPhetStrings.a11y.keyboardHelpDialog.slider.shiftUpDownArrowKeys
                            } ) : null;
    assert && assert( shiftKeysString );
    const keyboardHelpDialogSmallerStepsString = StringUtils.fillIn( SceneryPhetStrings.a11y.keyboardHelpDialog.slider.smallerStepsDescriptionPattern, {
      verb: options.verbString,
      keys: shiftKeysString
    } );
    const keyboardHelpDialogLargerStepsString = StringUtils.fillIn( SceneryPhetStrings.a11y.keyboardHelpDialog.slider.largerStepsDescriptionPattern, {
      verb: options.verbString
    } );

    //TODO https://github.com/phetsims/scenery-phet/issues/769 convert all uses of StringUtils.fillIn to DerivedProperty
    const jumpToMinimumString = StringUtils.fillIn( SceneryPhetStrings.keyboardHelpDialog.jumpToMinimumPattern, {
      minimum: options.minimumString
    } );
    const jumpToMaximumString = StringUtils.fillIn( SceneryPhetStrings.keyboardHelpDialog.jumpToMaximumPattern, {
      maximum: options.maximumString
    } );
    const jumpToMinimumDescriptionString = StringUtils.fillIn( SceneryPhetStrings.a11y.keyboardHelpDialog.slider.jumpToMinimumDescriptionPattern, {
      minimum: options.minimumString
    } );
    const jumpToMaximumDescriptionString = StringUtils.fillIn( SceneryPhetStrings.a11y.keyboardHelpDialog.slider.jumpToMaximumDescriptionPattern, {
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
    const adjustSliderRow = KeyboardHelpSectionRow.labelWithIcon( keyboardHelpDialogVerbSliderString, adjustSliderIcon, {
      labelInnerContent: keyboardHelpDialogDefaultStepsString
    } );

    const adjustSliderInSmallerStepsRow = KeyboardHelpSectionRow.labelWithIconList( keyboardHelpDialogVerbInSmallerStepsString,
      adjustSliderSmallerStepsIcons, {
        labelInnerContent: keyboardHelpDialogSmallerStepsString
      } );

    // 'move in larger steps' content
    const pageUpKeyNode = TextKeyNode.pageUp();
    const pageDownKeyNode = TextKeyNode.pageDown();
    const pageUpPageDownIcon = new HBox( {
      children: [ pageUpKeyNode, pageDownKeyNode ],
      spacing: KeyboardHelpIconFactory.DEFAULT_ICON_SPACING
    } );
    const adjustInLargerStepsRow = KeyboardHelpSectionRow.labelWithIcon( keyboardHelpDialogVerbInLargerStepsString, pageUpPageDownIcon, {
      labelInnerContent: keyboardHelpDialogLargerStepsString
    } );

    // 'move to minimum value' content
    const homeKeyNode = TextKeyNode.home();
    const jumpToMinimumRow = KeyboardHelpSectionRow.labelWithIcon( jumpToMinimumString, homeKeyNode, {
      labelInnerContent: jumpToMinimumDescriptionString
    } );

    // 'move to maximum value' content
    const endKeyNode = TextKeyNode.end();
    const jumpToMaximumRow = KeyboardHelpSectionRow.labelWithIcon( jumpToMaximumString, endKeyNode, {
      labelInnerContent: jumpToMaximumDescriptionString
    } );

    // assemble final content for KeyboardHelpSection
    const content = [ adjustSliderRow, adjustSliderInSmallerStepsRow, adjustInLargerStepsRow, jumpToMinimumRow, jumpToMaximumRow ];

    super( options.headingString, content, options );
  }
}

sceneryPhet.register( 'SliderControlsKeyboardHelpSection', SliderControlsKeyboardHelpSection );