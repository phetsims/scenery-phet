// Copyright 2017-2026, University of Colorado Boulder

/**
 * Content for a KeyboardHelpDialog that describes how to use sliders.
 *
 * @author Jesse Greenberg
 */

import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import assertMutuallyExclusiveOptions from '../../../../phet-core/js/assertMutuallyExclusiveOptions.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import optionize from '../../../../phet-core/js/optionize.js';
import HotkeyData from '../../../../scenery/js/input/HotkeyData.js';
import { OneKeyStroke } from '../../../../scenery/js/input/KeyDescriptor.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import sceneryPhet from '../../sceneryPhet.js';
import SceneryPhetFluent from '../../SceneryPhetFluent.js';
import { HotkeySetVariant } from './HotkeySetDefinitions.js';
import KeyboardHelpSection, { KeyboardHelpSectionOptions } from './KeyboardHelpSection.js';
import KeyboardHelpSectionRow from './KeyboardHelpSectionRow.js';

// Configurations of arrow keys that can be displayed for 'Move between items in a group'
export class ArrowKeyIconDisplay extends EnumerationValue {
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
  // @deprecated - use jumpToMaximumStringProperty and jumpToMinimumStringProperty instead.
  maximumStringProperty?: TReadOnlyProperty<string>;
  minimumStringProperty?: TReadOnlyProperty<string>;

  // Custom strings for the full 'Jump to Minimum' and 'Jump to Maximum' rows. Mutually exclusive with
  // minimumStringProperty and maximumStringProperty.
  jumpToMaximumStringProperty?: TReadOnlyProperty<string>;
  jumpToMinimumStringProperty?: TReadOnlyProperty<string>;

  // Determines whether this keyboard help section will have the "Adjust in Smaller Steps" row.
  includeSmallerStepsRow?: boolean;

  // Determines whether this keyboard help section will have the "Adjust in Larger Steps" row.
  includeLargerStepsRow?: boolean;

  // Sometimes a slider has custom key commands. Provide additional rows for those commands and they will be added
  // below default slider controls content.
  additionalRows?: KeyboardHelpSectionRow[];
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

    assert && assertMutuallyExclusiveOptions( providedOptions, [ 'maximumStringProperty' ], [ 'jumpToMaximumStringProperty' ] );
    assert && assertMutuallyExclusiveOptions( providedOptions, [ 'minimumStringProperty' ], [ 'jumpToMinimumStringProperty' ] );

    const ownsMaximumStringProperty = providedOptions && 'maximumStringProperty' in providedOptions;
    const ownsMinimumStringProperty = providedOptions && 'minimumStringProperty' in providedOptions;

    const options = optionize<SliderControlsKeyboardHelpSectionOptions, SelfOptions, KeyboardHelpSectionOptions>()( {
      arrowKeyIconDisplay: ArrowKeyIconDisplay.BOTH,
      headingStringProperty: SceneryPhetFluent.keyboardHelpDialog.sliderControlsStringProperty,

      verbStringProperty: SceneryPhetFluent.keyboardHelpDialog.adjustStringProperty,
      sliderStringProperty: SceneryPhetFluent.keyboardHelpDialog.sliderStringProperty,
      maximumStringProperty: SceneryPhetFluent.keyboardHelpDialog.maximumStringProperty,
      minimumStringProperty: SceneryPhetFluent.keyboardHelpDialog.minimumStringProperty,
      jumpToMaximumStringProperty: SceneryPhetFluent.keyboardHelpDialog.jumpToMaximumStringProperty,
      jumpToMinimumStringProperty: SceneryPhetFluent.keyboardHelpDialog.jumpToMinimumStringProperty,

      adjustSliderStringProperty: SceneryPhetFluent.keyboardHelpDialog.adjustSliderStringProperty,
      adjustInSmallerStepsStringProperty: SceneryPhetFluent.keyboardHelpDialog.adjustInSmallerStepsStringProperty,
      adjustInLargerStepsStringProperty: SceneryPhetFluent.keyboardHelpDialog.adjustInLargerStepsStringProperty,

      includeSmallerStepsRow: true,
      includeLargerStepsRow: true,
      additionalRows: []
    }, providedOptions );

    let adjustSliderStringProperty = options.adjustSliderStringProperty;
    let adjustInSmallerStepsStringProperty = options.adjustInSmallerStepsStringProperty;
    let adjustInLargerStepsStringProperty = options.adjustInLargerStepsStringProperty;
    if ( options.verbStringProperty !== SceneryPhetFluent.keyboardHelpDialog.adjustStringProperty ||
         options.sliderStringProperty !== SceneryPhetFluent.keyboardHelpDialog.sliderStringProperty
    ) {

      // we are filling in the verb and name
      adjustSliderStringProperty = new PatternStringProperty( SceneryPhetFluent.keyboardHelpDialog.verbSliderPatternStringProperty, {
        verb: options.verbStringProperty,
        slider: options.sliderStringProperty
      }, { tandem: Tandem.OPT_OUT } );
      adjustInSmallerStepsStringProperty = new PatternStringProperty( SceneryPhetFluent.keyboardHelpDialog.verbInSmallerStepsPatternStringProperty, {
        verb: options.verbStringProperty
      }, { tandem: Tandem.OPT_OUT } );
      adjustInLargerStepsStringProperty = new PatternStringProperty( SceneryPhetFluent.keyboardHelpDialog.verbInLargerStepsPatternStringProperty, {
        verb: options.verbStringProperty
      }, { tandem: Tandem.OPT_OUT } );
    }

    let jumpToMinimumStringProperty = options.jumpToMinimumStringProperty;
    if ( ownsMinimumStringProperty ) {
      jumpToMinimumStringProperty = new PatternStringProperty( SceneryPhetFluent.keyboardHelpDialog.jumpToMinimumPatternStringProperty, {
        minimum: options.minimumStringProperty
      }, { tandem: Tandem.OPT_OUT } );
    }

    let jumpToMaximumStringProperty = options.jumpToMaximumStringProperty;
    if ( ownsMaximumStringProperty ) {
      jumpToMaximumStringProperty = new PatternStringProperty( SceneryPhetFluent.keyboardHelpDialog.jumpToMaximumPatternStringProperty, {
        maximum: options.maximumStringProperty
      }, { tandem: Tandem.OPT_OUT } );
    }

    let adjustSliderKeys: null | OneKeyStroke[] = null;
    let adjustSliderHotkeySetVariant: HotkeySetVariant = 'default';
    let adjustSliderSmallerStepsKeys: null | OneKeyStroke[] = null;
    let adjustSliderSmallerStepsHotkeySetVariant: HotkeySetVariant = 'default';

    switch( options.arrowKeyIconDisplay ) {
      case ArrowKeyIconDisplay.LEFT_RIGHT:
        adjustSliderKeys = [ 'arrowLeft', 'arrowRight' ];
        adjustSliderSmallerStepsKeys = [ 'shift+arrowLeft', 'shift+arrowRight' ];
        break;
      case ArrowKeyIconDisplay.UP_DOWN:
        adjustSliderKeys = [ 'arrowUp', 'arrowDown' ];
        adjustSliderSmallerStepsKeys = [ 'shift+arrowUp', 'shift+arrowDown' ];
        break;
      default:
        assert && assert( options.arrowKeyIconDisplay === ArrowKeyIconDisplay.BOTH, 'unsupported arrowKeyIconDisplay' );
        adjustSliderKeys = [ 'arrowLeft', 'arrowRight', 'arrowUp', 'arrowDown' ];
        adjustSliderHotkeySetVariant = 'paired';
        adjustSliderSmallerStepsKeys = [ 'shift+arrowLeft', 'shift+arrowRight', 'shift+arrowUp', 'shift+arrowDown' ];
        adjustSliderSmallerStepsHotkeySetVariant = 'paired';
    }

    const adjustSliderRow = KeyboardHelpSectionRow.fromHotkeyData( new HotkeyData( {
      keys: adjustSliderKeys,
      keyboardHelpDialogLabelStringProperty: adjustSliderStringProperty,
      repoName: sceneryPhet.name
    } ), {
      hotkeySetVariant: adjustSliderHotkeySetVariant
    } );

    const adjustSliderInSmallerStepsRow = KeyboardHelpSectionRow.fromHotkeyData( new HotkeyData( {
      keys: adjustSliderSmallerStepsKeys,
      keyboardHelpDialogLabelStringProperty: adjustInSmallerStepsStringProperty,
      repoName: sceneryPhet.name
    } ), {
      hotkeySetVariant: adjustSliderSmallerStepsHotkeySetVariant
    } );

    // 'move in larger steps' content
    const adjustInLargerStepsRow = KeyboardHelpSectionRow.fromHotkeyData( new HotkeyData( {
      keys: [ 'pageUp', 'pageDown' ],
      keyboardHelpDialogLabelStringProperty: adjustInLargerStepsStringProperty,
      repoName: sceneryPhet.name
    } ) );

    // 'move to minimum value' content
    const jumpToMinimumRow = KeyboardHelpSectionRow.fromHotkeyData( new HotkeyData( {
      keys: [ 'home' ],
      keyboardHelpDialogLabelStringProperty: jumpToMinimumStringProperty,
      repoName: sceneryPhet.name
    } ) );

    // 'move to maximum value' content
    const jumpToMaximumRow = KeyboardHelpSectionRow.fromHotkeyData( new HotkeyData( {
      keys: [ 'end' ],
      keyboardHelpDialogLabelStringProperty: jumpToMaximumStringProperty,
      repoName: sceneryPhet.name
    } ) );

    // assemble final content for KeyboardHelpSection
    const content = [
      adjustSliderRow,
      ...( options.includeSmallerStepsRow ? [ adjustSliderInSmallerStepsRow ] : [] ),
      ...( options.includeLargerStepsRow ? [ adjustInLargerStepsRow ] : [] ),
      jumpToMinimumRow,
      jumpToMaximumRow,
      ...options.additionalRows
    ];

    super( options.headingStringProperty, content, options );
  }
}

sceneryPhet.register( 'SliderControlsKeyboardHelpSection', SliderControlsKeyboardHelpSection );