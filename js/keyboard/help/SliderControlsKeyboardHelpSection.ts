// Copyright 2017-2022, University of Colorado Boulder

/**
 * Content for a KeyboardHelpDialog that describes how to use sliders.
 *
 * @author Jesse Greenberg
 */

import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import optionize from '../../../../phet-core/js/optionize.js';
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
  verbString?: string | TReadOnlyProperty<string>;

  // name to call the slider (lowercase), default to "slider"
  sliderString?: string | TReadOnlyProperty<string>;

  // Strings for extremities to support shortcuts like "jump to maximum" (renaming "maximum" if desired.
  maximumString?: string | TReadOnlyProperty<string>;
  minimumString?: string | TReadOnlyProperty<string>;
};

export type SliderControlsKeyboardHelpSectionOptions = SelfOptions & KeyboardHelpSectionOptions;

export default class SliderControlsKeyboardHelpSection extends KeyboardHelpSection {

  public static readonly ArrowKeyIconDisplay = ArrowKeyIconDisplay;

  public constructor( providedOptions?: SliderControlsKeyboardHelpSectionOptions ) {

    const options = optionize<SliderControlsKeyboardHelpSectionOptions, SelfOptions, KeyboardHelpSectionOptions>()( {
      arrowKeyIconDisplay: ArrowKeyIconDisplay.BOTH,
      headingString: SceneryPhetStrings.keyboardHelpDialog.sliderControlsStringProperty,

      verbString: SceneryPhetStrings.keyboardHelpDialog.adjustStringProperty,
      sliderString: SceneryPhetStrings.keyboardHelpDialog.sliderStringProperty,
      maximumString: SceneryPhetStrings.keyboardHelpDialog.maximumStringProperty,
      minimumString: SceneryPhetStrings.keyboardHelpDialog.minimumStringProperty
    }, providedOptions );

    const keyboardHelpDialogVerbSliderStringProperty = new PatternStringProperty( SceneryPhetStrings.keyboardHelpDialog.verbSliderPatternStringProperty, {
      verb: options.verbString,
      slider: options.sliderString
    } );
    const keyboardHelpDialogVerbInSmallerStepsStringProperty = new PatternStringProperty( SceneryPhetStrings.keyboardHelpDialog.verbInSmallerStepsPatternStringProperty, {
      verb: options.verbString
    } );
    const keyboardHelpDialogVerbInLargerStepsStringProperty = new PatternStringProperty( SceneryPhetStrings.keyboardHelpDialog.verbInLargerStepsPatternStringProperty, {
      verb: options.verbString
    } );

    const keysStringProperty = ArrowKeyIconDisplay.LEFT_RIGHT === options.arrowKeyIconDisplay ? SceneryPhetStrings.a11y.keyboardHelpDialog.slider.leftRightArrowKeys :
                               ArrowKeyIconDisplay.UP_DOWN === options.arrowKeyIconDisplay ? SceneryPhetStrings.a11y.keyboardHelpDialog.slider.upDownArrowKeys :
                               ArrowKeyIconDisplay.BOTH === options.arrowKeyIconDisplay ?
                               new PatternStringProperty( SceneryPhetStrings.a11y.keyboardHelpDialog.slider.orKeysPatternStringProperty, {
                                 leftRight: SceneryPhetStrings.a11y.keyboardHelpDialog.slider.leftRightArrowKeys,
                                 upDown: SceneryPhetStrings.a11y.keyboardHelpDialog.slider.upDownArrowKeys
                               } ) : null;
    assert && assert( keysStringProperty );
    const keyboardHelpDialogDefaultStepsStringProperty = new PatternStringProperty( SceneryPhetStrings.a11y.keyboardHelpDialog.slider.defaultStepsDescriptionPatternStringProperty, {
      verb: options.verbString,
      slider: options.sliderString,
      keys: keysStringProperty
    } );

    const shiftKeysString = ArrowKeyIconDisplay.LEFT_RIGHT === options.arrowKeyIconDisplay ? SceneryPhetStrings.a11y.keyboardHelpDialog.slider.shiftLeftRightArrowKeys :
                            ArrowKeyIconDisplay.UP_DOWN === options.arrowKeyIconDisplay ? SceneryPhetStrings.a11y.keyboardHelpDialog.slider.shiftUpDownArrowKeys :
                            ArrowKeyIconDisplay.BOTH === options.arrowKeyIconDisplay ? new PatternStringProperty( SceneryPhetStrings.a11y.keyboardHelpDialog.slider.orKeysPatternStringProperty, {
                              leftRight: SceneryPhetStrings.a11y.keyboardHelpDialog.slider.shiftLeftRightArrowKeys,
                              upDown: SceneryPhetStrings.a11y.keyboardHelpDialog.slider.shiftUpDownArrowKeys
                            } ) : null;
    assert && assert( shiftKeysString );
    const keyboardHelpDialogSmallerStepsStringProperty = new PatternStringProperty( SceneryPhetStrings.a11y.keyboardHelpDialog.slider.smallerStepsDescriptionPatternStringProperty, {
      verb: options.verbString,
      keys: shiftKeysString
    } );
    const keyboardHelpDialogLargerStepsStringProperty = new PatternStringProperty( SceneryPhetStrings.a11y.keyboardHelpDialog.slider.largerStepsDescriptionPatternStringProperty, {
      verb: options.verbString
    } );

    const jumpToMinimumStringProperty = new PatternStringProperty( SceneryPhetStrings.keyboardHelpDialog.jumpToMinimumPatternStringProperty, {
      minimum: options.minimumString
    } );
    const jumpToMaximumStringProperty = new PatternStringProperty( SceneryPhetStrings.keyboardHelpDialog.jumpToMaximumPatternStringProperty, {
      maximum: options.maximumString
    } );
    const jumpToMinimumDescriptionStringProperty = new PatternStringProperty( SceneryPhetStrings.a11y.keyboardHelpDialog.slider.jumpToMinimumDescriptionPatternStringProperty, {
      minimum: options.minimumString
    } );
    const jumpToMaximumDescriptionStringProperty = new PatternStringProperty( SceneryPhetStrings.a11y.keyboardHelpDialog.slider.jumpToMaximumDescriptionPatternStringProperty, {
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
    const adjustSliderRow = KeyboardHelpSectionRow.labelWithIcon( keyboardHelpDialogVerbSliderStringProperty, adjustSliderIcon, {
      labelInnerContent: keyboardHelpDialogDefaultStepsStringProperty
    } );

    const adjustSliderInSmallerStepsRow = KeyboardHelpSectionRow.labelWithIconList( keyboardHelpDialogVerbInSmallerStepsStringProperty,
      adjustSliderSmallerStepsIcons, {
        labelInnerContent: keyboardHelpDialogSmallerStepsStringProperty
      } );

    // 'move in larger steps' content
    const pageUpKeyNode = TextKeyNode.pageUp();
    const pageDownKeyNode = TextKeyNode.pageDown();
    const pageUpPageDownIcon = new HBox( {
      children: [ pageUpKeyNode, pageDownKeyNode ],
      spacing: KeyboardHelpIconFactory.DEFAULT_ICON_SPACING
    } );
    const adjustInLargerStepsRow = KeyboardHelpSectionRow.labelWithIcon( keyboardHelpDialogVerbInLargerStepsStringProperty, pageUpPageDownIcon, {
      labelInnerContent: keyboardHelpDialogLargerStepsStringProperty
    } );

    // 'move to minimum value' content
    const homeKeyNode = TextKeyNode.home();
    const jumpToMinimumRow = KeyboardHelpSectionRow.labelWithIcon( jumpToMinimumStringProperty, homeKeyNode, {
      labelInnerContent: jumpToMinimumDescriptionStringProperty
    } );

    // 'move to maximum value' content
    const endKeyNode = TextKeyNode.end();
    const jumpToMaximumRow = KeyboardHelpSectionRow.labelWithIcon( jumpToMaximumStringProperty, endKeyNode, {
      labelInnerContent: jumpToMaximumDescriptionStringProperty
    } );

    // assemble final content for KeyboardHelpSection
    const content = [ adjustSliderRow, adjustSliderInSmallerStepsRow, adjustInLargerStepsRow, jumpToMinimumRow, jumpToMaximumRow ];

    super( options.headingString, content, options );
  }
}

sceneryPhet.register( 'SliderControlsKeyboardHelpSection', SliderControlsKeyboardHelpSection );