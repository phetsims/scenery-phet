// Copyright 2017-2023, University of Colorado Boulder

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
import Tandem from '../../../../tandem/js/Tandem.js';
import assertMutuallyExclusiveOptions from '../../../../phet-core/js/assertMutuallyExclusiveOptions.js';

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
  headingStringProperty?: TReadOnlyProperty<string>;

  // custom string for the "Adjust Slider" row
  adjustSliderStringProperty?: TReadOnlyProperty<string>;

  // custom string for the "Adjust in Smaller Steps" row
  adjustInSmallerStepsStringProperty?: TReadOnlyProperty<string>;

  // custom string for the "Adjust in Larger Steps" row
  adjustInLargerStepsStringProperty?: TReadOnlyProperty<string>;

  // verb used to describe the movement of the slider - this will be filled into the default pattern for
  // each row so you cannot use this and the other string options at the same time
  verbStringProperty?: TReadOnlyProperty<string>;

  // name to call the slider (lowercase), default to "slider" - this will be filled into the default pattern for
  // each row so you cannot use this and the other string options at the same time
  sliderStringProperty?: TReadOnlyProperty<string>;

  // Strings for extremities to support shortcuts like "jump to maximum" (renaming "maximum" if desired.
  maximumStringProperty?: TReadOnlyProperty<string>;
  minimumStringProperty?: TReadOnlyProperty<string>;

  // This option determines whether this keyboard help section will have the
  // "Adjust in Smaller Steps" row. The row includes the string and key icons.
  includeSmallerStepsRow?: boolean;
};

export type SliderControlsKeyboardHelpSectionOptions = SelfOptions & KeyboardHelpSectionOptions;

export default class SliderControlsKeyboardHelpSection extends KeyboardHelpSection {

  public static readonly ArrowKeyIconDisplay = ArrowKeyIconDisplay;

  public constructor( providedOptions?: SliderControlsKeyboardHelpSectionOptions ) {

    // If you provide a string for the verb or slider, it will be filled into the default pattern
    // for all rows so you cannot customize each row individually.
    assert && assertMutuallyExclusiveOptions( providedOptions,
      [ 'verbStringProperty', 'sliderStringProperty' ],
      [ 'adjustSliderStringProperty', 'adjustInSmallerStepsStringProperty', 'adjustInLargerStepsStringProperty' ] );

    const options = optionize<SliderControlsKeyboardHelpSectionOptions, SelfOptions, KeyboardHelpSectionOptions>()( {
      arrowKeyIconDisplay: ArrowKeyIconDisplay.BOTH,
      headingStringProperty: SceneryPhetStrings.keyboardHelpDialog.sliderControlsStringProperty,

      verbStringProperty: SceneryPhetStrings.keyboardHelpDialog.adjustStringProperty,
      sliderStringProperty: SceneryPhetStrings.keyboardHelpDialog.sliderStringProperty,
      maximumStringProperty: SceneryPhetStrings.keyboardHelpDialog.maximumStringProperty,
      minimumStringProperty: SceneryPhetStrings.keyboardHelpDialog.minimumStringProperty,

      adjustSliderStringProperty: SceneryPhetStrings.keyboardHelpDialog.adjustSliderStringProperty,
      adjustInSmallerStepsStringProperty: SceneryPhetStrings.keyboardHelpDialog.adjustInSmallerStepsStringProperty,
      adjustInLargerStepsStringProperty: SceneryPhetStrings.keyboardHelpDialog.adjustInLargerStepsStringProperty,

      includeSmallerStepsRow: true
    }, providedOptions );

    let adjustSliderStringProperty = options.adjustSliderStringProperty;
    let adjustInSmallerStepsStringProperty = options.adjustInSmallerStepsStringProperty;
    let adjustInLargerStepsStringProperty = options.adjustInLargerStepsStringProperty;
    if ( options.verbStringProperty !== SceneryPhetStrings.keyboardHelpDialog.adjustStringProperty ||
         options.sliderStringProperty !== SceneryPhetStrings.keyboardHelpDialog.sliderStringProperty
    ) {

      // we are filling in the verb and name
      adjustSliderStringProperty = new PatternStringProperty( SceneryPhetStrings.keyboardHelpDialog.verbSliderPatternStringProperty, {
        verb: options.verbStringProperty,
        slider: options.sliderStringProperty
      }, { tandem: Tandem.OPT_OUT } );
      adjustInSmallerStepsStringProperty = new PatternStringProperty( SceneryPhetStrings.keyboardHelpDialog.verbInSmallerStepsPatternStringProperty, {
        verb: options.verbStringProperty
      }, { tandem: Tandem.OPT_OUT } );
      adjustInLargerStepsStringProperty = new PatternStringProperty( SceneryPhetStrings.keyboardHelpDialog.verbInLargerStepsPatternStringProperty, {
        verb: options.verbStringProperty
      }, { tandem: Tandem.OPT_OUT } );
    }

    const keysStringProperty =
      ( options.arrowKeyIconDisplay === ArrowKeyIconDisplay.LEFT_RIGHT ) ? SceneryPhetStrings.a11y.keyboardHelpDialog.slider.leftRightArrowKeysStringProperty :
      ( options.arrowKeyIconDisplay === ArrowKeyIconDisplay.UP_DOWN ) ? SceneryPhetStrings.a11y.keyboardHelpDialog.slider.upDownArrowKeysStringProperty :
      ( options.arrowKeyIconDisplay === ArrowKeyIconDisplay.BOTH ) ?
      new PatternStringProperty( SceneryPhetStrings.a11y.keyboardHelpDialog.slider.orKeysPatternStringProperty, {
        leftRight: SceneryPhetStrings.a11y.keyboardHelpDialog.slider.leftRightArrowKeysStringProperty,
        upDown: SceneryPhetStrings.a11y.keyboardHelpDialog.slider.upDownArrowKeysStringProperty
      }, { tandem: Tandem.OPT_OUT } ) : null;
    assert && assert( keysStringProperty );
    const keyboardHelpDialogDefaultStepsStringProperty = new PatternStringProperty( SceneryPhetStrings.a11y.keyboardHelpDialog.slider.defaultStepsDescriptionPatternStringProperty, {
      verb: options.verbStringProperty,
      slider: options.sliderStringProperty,
      keys: keysStringProperty!
    }, { tandem: Tandem.OPT_OUT } );

    const shiftKeysStringProperty =
      ( options.arrowKeyIconDisplay === ArrowKeyIconDisplay.LEFT_RIGHT ) ? SceneryPhetStrings.a11y.keyboardHelpDialog.slider.shiftLeftRightArrowKeysStringProperty :
      ( options.arrowKeyIconDisplay === ArrowKeyIconDisplay.UP_DOWN ) ? SceneryPhetStrings.a11y.keyboardHelpDialog.slider.shiftUpDownArrowKeysStringProperty :
      ( options.arrowKeyIconDisplay === ArrowKeyIconDisplay.BOTH ) ? new PatternStringProperty( SceneryPhetStrings.a11y.keyboardHelpDialog.slider.orKeysPatternStringProperty, {
        leftRight: SceneryPhetStrings.a11y.keyboardHelpDialog.slider.shiftLeftRightArrowKeysStringProperty,
        upDown: SceneryPhetStrings.a11y.keyboardHelpDialog.slider.shiftUpDownArrowKeysStringProperty
      }, { tandem: Tandem.OPT_OUT } ) : null;
    assert && assert( shiftKeysStringProperty );
    const keyboardHelpDialogSmallerStepsStringProperty = new PatternStringProperty( SceneryPhetStrings.a11y.keyboardHelpDialog.slider.smallerStepsDescriptionPatternStringProperty, {
      verb: options.verbStringProperty,
      keys: shiftKeysStringProperty!
    }, { tandem: Tandem.OPT_OUT } );
    const keyboardHelpDialogLargerStepsStringProperty = new PatternStringProperty( SceneryPhetStrings.a11y.keyboardHelpDialog.slider.largerStepsDescriptionPatternStringProperty, {
      verb: options.verbStringProperty
    }, { tandem: Tandem.OPT_OUT } );

    const jumpToMinimumStringProperty = new PatternStringProperty( SceneryPhetStrings.keyboardHelpDialog.jumpToMinimumPatternStringProperty, {
      minimum: options.minimumStringProperty
    }, { tandem: Tandem.OPT_OUT } );
    const jumpToMaximumStringProperty = new PatternStringProperty( SceneryPhetStrings.keyboardHelpDialog.jumpToMaximumPatternStringProperty, {
      maximum: options.maximumStringProperty
    }, { tandem: Tandem.OPT_OUT } );
    const jumpToMinimumDescriptionStringProperty = new PatternStringProperty( SceneryPhetStrings.a11y.keyboardHelpDialog.slider.jumpToMinimumDescriptionPatternStringProperty, {
      minimum: options.minimumStringProperty
    }, { tandem: Tandem.OPT_OUT } );
    const jumpToMaximumDescriptionStringProperty = new PatternStringProperty( SceneryPhetStrings.a11y.keyboardHelpDialog.slider.jumpToMaximumDescriptionPatternStringProperty, {
      maximum: options.maximumStringProperty
    }, { tandem: Tandem.OPT_OUT } );

    // 'Move sliders' content

    const leftRightArrowKeysRowIcon = KeyboardHelpIconFactory.leftRightArrowKeysRowIcon();
    const shiftPlusLeftRightIcon = KeyboardHelpIconFactory.shiftPlusIcon( leftRightArrowKeysRowIcon );
    const upDownArrowKeysRowIcon = KeyboardHelpIconFactory.upDownArrowKeysRowIcon();
    const shiftPlusUpDownIcon = KeyboardHelpIconFactory.shiftPlusIcon( upDownArrowKeysRowIcon );
    const leftRightOrUpDownIcon = KeyboardHelpIconFactory.iconOrIcon( leftRightArrowKeysRowIcon, upDownArrowKeysRowIcon );

    let adjustSliderIcon = null;
    let adjustSliderSmallerStepsIcons = null;

    switch( options.arrowKeyIconDisplay ) {
      case ArrowKeyIconDisplay.LEFT_RIGHT:
        adjustSliderIcon = leftRightArrowKeysRowIcon;
        adjustSliderSmallerStepsIcons = [ shiftPlusLeftRightIcon ];
        break;
      case ArrowKeyIconDisplay.UP_DOWN:
        adjustSliderIcon = upDownArrowKeysRowIcon;
        adjustSliderSmallerStepsIcons = [ shiftPlusUpDownIcon ];
        break;
      default:
        assert && assert( options.arrowKeyIconDisplay === ArrowKeyIconDisplay.BOTH, 'unsupported arrowKeyIconDisplay' );
        adjustSliderIcon = leftRightOrUpDownIcon;
        adjustSliderSmallerStepsIcons = [ shiftPlusLeftRightIcon, shiftPlusUpDownIcon ];
    }
    const adjustSliderRow = KeyboardHelpSectionRow.labelWithIcon( adjustSliderStringProperty, adjustSliderIcon, {
      labelInnerContent: keyboardHelpDialogDefaultStepsStringProperty
    } );

    const adjustSliderInSmallerStepsRow = KeyboardHelpSectionRow.labelWithIconList( adjustInSmallerStepsStringProperty,
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
    const adjustInLargerStepsRow = KeyboardHelpSectionRow.labelWithIcon( adjustInLargerStepsStringProperty, pageUpPageDownIcon, {
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
    const content = [ adjustSliderRow, ...( options.includeSmallerStepsRow ? [ adjustSliderInSmallerStepsRow ] : [] ), adjustInLargerStepsRow, jumpToMinimumRow, jumpToMaximumRow ];

    super( options.headingStringProperty, content, options );
  }
}

sceneryPhet.register( 'SliderControlsKeyboardHelpSection', SliderControlsKeyboardHelpSection );