// Copyright 2025-2026, University of Colorado Boulder

/**
 * Utility that converts HotkeyData key descriptors into a natural-language description that can be used in the
 * keyboard help dialog. This lives in scenery-phet so that translations/platform specific wording can be added without
 * introducing strings to scenery.
 *
 * The builder focuses on the common shortcut patterns used throughout PhET sims (single keys, modifier combinations,
 * arrow key clusters, WASD groups, etc.) and falls back to a generic comma-separated list when no specialized wording
 * is available.
 *
 * @author Jesse Greenberg
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import type { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import type { EnglishKeyString } from '../../../../scenery/js/accessibility/EnglishStringToCodeMap.js';
import KeyDescriptor from '../../../../scenery/js/input/KeyDescriptor.js';
import sceneryPhet from '../../sceneryPhet.js';
import SceneryPhetFluent from '../../SceneryPhetFluent.js';
import KeyDisplayRegistry from '../KeyDisplayRegistry.js';
import TextKeyNode from '../TextKeyNode.js';
import HotkeySetDefinitions, { HotkeySetVariant } from './HotkeySetDefinitions.js';

// Represents a collection of descriptor keys that share the same modifier combination.
type ModifierGroup = {

  // Modifiers shared by every key in the group.
  modifiers: EnglishKeyString[];

  // Raw keys associated with the modifier set.
  keys: EnglishKeyString[];
};

// Modifier labels need customized wording (for example, excluding the "key" suffix)
// so they are configured separately from KEY_LABELS rather than using the generic
// describeKeyLabel fallback.
const MODIFIER_LABEL_OVERRIDES: Record<string, TReadOnlyProperty<string>> = {
  ctrl: SceneryPhetFluent.a11y.keyboard.key.controlStringProperty,
  alt: TextKeyNode.getAltKeyString(),
  shift: SceneryPhetFluent.key.shiftStringProperty
};

export default class HotkeyDescriptionBuilder {
  private constructor() {
    // Not intended for instantiation.
  }

  /**
   * Creates a localized description Property for a set of keys. Whenever the action text, key descriptors, or any
   * of the supporting localization strings change (conjunctions, punctuation, singular/plural labels, etc.), the
   * returned property recomputes the full sentence so consumers always display the correct phrasing for the current
   * locale.
   *
   * @param actionStringProperty - Property that provides the action description (e.g. "Move to next item")
   * @param keyDescriptorsProperty - Property that provides the array of KeyDescriptors for the hotkey
   * @param hotkeySetVariant - variant string to use when looking up hotkey set definitions
   */
  public static createDescriptionProperty(
    actionStringProperty: TReadOnlyProperty<string>,
    keyDescriptorsProperty: TReadOnlyProperty<KeyDescriptor[]>,
    hotkeySetVariant: HotkeySetVariant = 'default'
  ): TReadOnlyProperty<string> {

    // NOTE: We assume here that keyDescriptors will not change. The only way they can change is if the actual
    // keys themselves change, which PhET does not (and may never) support. If remapping keys at runtime becomes
    // a supported feature, we will need to recompute the dependencies/create a new DerivedProperty every time the
    // descriptor changes. It is not worth including that complexity for a hypothetical feature.
    const keyDescriptors = keyDescriptorsProperty.value;

    // Collect all string Properties that may be used in the final description string. To support dynamic locales,
    // they must all be used as dependencies so that changes trigger a recompute.
    const descriptorLabelProperties = HotkeyDescriptionBuilder.getLabelPropertiesForDescriptors( keyDescriptors );
    const descriptorPhraseProperties = HotkeyDescriptionBuilder.getPhrasePropertiesForDescriptors( keyDescriptors, hotkeySetVariant );

    // Additional dependency strings that are used in the derivation that may change with language. For this
    // implementation, it is easier to list them all here and create one derivation than to use createProperty()
    // with every pattern up front.
    const usedStringDependencies = _.uniq( [
      ...SceneryPhetFluent.a11y.keyboard.helpPatterns.actionStatement.getDependentProperties(),
      ...SceneryPhetFluent.a11y.keyboard.helpPatterns.actionWithKeys.getDependentProperties(),
      ...SceneryPhetFluent.a11y.keyboard.helpPatterns.modifiersPlusKeys.getDependentProperties(),
      ...SceneryPhetFluent.a11y.keyboard.helpPatterns.singleKey.getDependentProperties(),
      ...SceneryPhetFluent.a11y.keyboard.helpPatterns.multipleKeys.getDependentProperties(),
      ...SceneryPhetFluent.a11y.keyboard.helpPatterns.twoItemList.getDependentProperties(),
      ...SceneryPhetFluent.a11y.keyboard.helpPatterns.serialList.getDependentProperties(),
      SceneryPhetFluent.a11y.keyboard.helpPatterns.spacePlusSpaceStringProperty,
      SceneryPhetFluent.a11y.keyboard.helpPatterns.commaSpaceStringProperty
    ] );

    return DerivedProperty.deriveAny( [
      actionStringProperty,
      ...descriptorLabelProperties,
      ...descriptorPhraseProperties,

      ...usedStringDependencies

    ], () => HotkeyDescriptionBuilder.createDescriptionString( actionStringProperty.value, keyDescriptors, hotkeySetVariant ) );
  }

  /**
   * Builds the full sentence for the keyboard help row.
   */
  private static createDescriptionString( actionString: string, keyDescriptors: KeyDescriptor[], hotkeySetVariant: HotkeySetVariant ): string {

    // Trim away stray leading/trailing whitespace from translated action text; if it’s all whitespace, skip rendering.
    const trimmedAction = actionString.trim();
    if ( !trimmedAction ) {
      return '';
    }

    const keyPhrase = HotkeyDescriptionBuilder.describeDescriptors( keyDescriptors, hotkeySetVariant );
    if ( !keyPhrase ) {
      return SceneryPhetFluent.a11y.keyboard.helpPatterns.actionStatement.format( {
        action: trimmedAction
      } );
    }

    return SceneryPhetFluent.a11y.keyboard.helpPatterns.actionWithKeys.format( {
      action: trimmedAction,
      keys: keyPhrase
    } );
  }

  /**
   * Produces a localized phrase that describes the provided descriptors, combining groups when possible.
   */
  private static describeDescriptors( descriptors: KeyDescriptor[], hotkeySetVariant: HotkeySetVariant ): string {
    if ( descriptors.length === 0 ) {
      return '';
    }

    const groups = HotkeyDescriptionBuilder.groupDescriptors( descriptors );
    const clauses = groups
      .map( group => HotkeyDescriptionBuilder.describeGroup( group, hotkeySetVariant ) )
      .filter( clause => clause.length > 0 );

    return HotkeyDescriptionBuilder.joinList( clauses );
  }

  /**
   * Generates a clause for a single modifier grouping, optionally splitting keys when clusters are detected.
   */
  private static describeGroup( group: ModifierGroup, hotkeySetVariant: HotkeySetVariant ): string {
    const modifierDescription = HotkeyDescriptionBuilder.describeModifiers( group.modifiers );
    const normalizedKeys = HotkeySetDefinitions.sortKeys( group.keys );

    if ( modifierDescription && group.modifiers.length > 0 ) {
      const partitions = HotkeySetDefinitions.partitionKeySetForModifiers( normalizedKeys, hotkeySetVariant );
      if ( partitions.length > 1 ) {
        const partitionDescriptions = partitions.map( partition => {
          const description = HotkeyDescriptionBuilder.describeKeySet( partition, hotkeySetVariant );
          if ( description ) {
            return SceneryPhetFluent.a11y.keyboard.helpPatterns.modifiersPlusKeys.format( {
              modifiers: modifierDescription,
              keys: description
            } );
          }
          else {
            return modifierDescription;
          }
        } ).filter( desc => desc.length > 0 );

        if ( partitionDescriptions.length > 0 ) {
          return HotkeyDescriptionBuilder.joinList( partitionDescriptions );
        }
      }
    }

    const keyDescription = HotkeyDescriptionBuilder.describeKeySet( normalizedKeys, hotkeySetVariant );

    if ( modifierDescription && keyDescription ) {
      return SceneryPhetFluent.a11y.keyboard.helpPatterns.modifiersPlusKeys.format( {
        modifiers: modifierDescription,
        keys: keyDescription
      } );
    }

    return modifierDescription || keyDescription || '';
  }

  /**
   * Returns a phrase describing all modifiers in a combination ("Control plus Shift").
   */
  private static describeModifiers( modifiers: EnglishKeyString[] ): string {
    if ( modifiers.length === 0 ) {
      return '';
    }

    const sorted = HotkeySetDefinitions.sortModifiers( modifiers );
    const labels = sorted.map( modifier => HotkeyDescriptionBuilder.describeModifier( modifier ) );
    const spacePlusSpaceStringProperty = SceneryPhetFluent.a11y.keyboard.helpPatterns.spacePlusSpaceStringProperty;
    return labels.join( spacePlusSpaceStringProperty.value );
  }

  /**
   * Describes a single modifier, respecting platform-specific overrides when available.
   */
  private static describeModifier( modifier: EnglishKeyString ): string {
    if ( MODIFIER_LABEL_OVERRIDES[ modifier ] ) {
      return MODIFIER_LABEL_OVERRIDES[ modifier ].value;
    }

    // Fall back to describing it like a standard key.
    return SceneryPhetFluent.a11y.keyboard.helpPatterns.singleKey.format( {
      keyLabel: KeyDisplayRegistry.getKeyLabelProperty( modifier ).value
    } );
  }

  /**
   * Builds a description for a set of non-modifier keys, preferring shared definitions when possible.
   */
  private static describeKeySet( keys: EnglishKeyString[], hotkeySetVariant: HotkeySetVariant ): string {
    if ( keys.length === 0 ) {
      return '';
    }

    const normalizedKeys = HotkeySetDefinitions.sortKeys( keys );
    const definition = HotkeySetDefinitions.getDefinition( normalizedKeys, hotkeySetVariant );
    if ( definition?.phraseProperty ) {
      return definition.phraseProperty.value;
    }

    const labels = normalizedKeys.map( key => KeyDisplayRegistry.getKeyLabelProperty( key ).value );
    if ( labels.length === 1 ) {
      return SceneryPhetFluent.a11y.keyboard.helpPatterns.singleKey.format( {
        keyLabel: labels[ 0 ]
      } );
    }
    return SceneryPhetFluent.a11y.keyboard.helpPatterns.multipleKeys.format( {
      keyLabels: HotkeyDescriptionBuilder.joinList( labels )
    } );
  }

  /**
   * Returns all observable key-label Properties that may be referenced when describing the provided descriptors.
   * These Properties must be included in any derived dependency list so the description recomputes when a label
   * changes due to a locale switch.
   */
  private static getLabelPropertiesForDescriptors(
    descriptors: KeyDescriptor[]
  ): TReadOnlyProperty<string>[] {
    const labelProperties = new Set<TReadOnlyProperty<string>>();

    descriptors.forEach( descriptor => {
      const labelProperty = KeyDisplayRegistry.getKeyLabelProperty( descriptor.key );
      labelProperties.add( labelProperty );
    } );

    return Array.from( labelProperties );
  }

  /**
   * Identifies every localized phrase Property from HotkeySetDefinitions that could be referenced when describing
   * the provided descriptors. Each returned Property must be included in the DerivedProperty dependency list
   * so the sentence recomputes when a phrase changes due to a language switch.
   */
  private static getPhrasePropertiesForDescriptors(
    descriptors: KeyDescriptor[],
    hotkeySetVariant: HotkeySetVariant
  ): TReadOnlyProperty<string>[] {
    const phraseProperties = new Set<TReadOnlyProperty<string>>();
    const groups = HotkeyDescriptionBuilder.groupDescriptors( descriptors );

    const addPhraseForKeys = ( keys: EnglishKeyString[] ): void => {
      const definition = HotkeySetDefinitions.getDefinition( keys, hotkeySetVariant );
      if ( definition?.phraseProperty ) {
        phraseProperties.add( definition.phraseProperty );
      }
    };

    groups.forEach( group => {
      const normalizedKeys = HotkeySetDefinitions.sortKeys( group.keys );
      addPhraseForKeys( normalizedKeys );

      if ( group.modifiers.length > 0 ) {
        const partitions = HotkeySetDefinitions.partitionKeySetForModifiers( normalizedKeys, hotkeySetVariant );
        partitions.forEach( partition => addPhraseForKeys( partition ) );
      }
    } );

    return Array.from( phraseProperties );
  }

  /**
   * Groups descriptors by their modifier combinations so each cluster can be described independently.
   */
  private static groupDescriptors( descriptors: KeyDescriptor[] ): ModifierGroup[] {
    const map = new Map<string, ModifierGroup>();

    descriptors.forEach( descriptor => {

      // Builds a stable map key for the modifier set. Sorted keys are joined so the same combo always yields
      // the same identifier. For example: [ 'alt', 'shift' ] => 'alt|shift'.
      const modifiers = HotkeySetDefinitions.sortModifiers( descriptor.modifierKeys );
      const key = modifiers.join( HotkeySetDefinitions.KEY_SEPARATOR );

      if ( !map.has( key ) ) {
        map.set( key, {
          modifiers: modifiers,
          keys: []
        } );
      }

      const group = map.get( key )!;
      if ( !group.keys.includes( descriptor.key ) ) {
        group.keys.push( descriptor.key );
      }
    } );

    return Array.from( map.values() );
  }

  /**
   * Joins phrases with commas and the configured conjunction to produce natural-sounding lists.
   */
  private static joinList( items: string[] ): string {
    if ( items.length === 0 ) {
      return '';
    }
    if ( items.length === 1 ) {
      return items[ 0 ];
    }
    if ( items.length === 2 ) {
      return SceneryPhetFluent.a11y.keyboard.helpPatterns.twoItemList.format( {
        first: items[ 0 ],
        second: items[ 1 ]
      } );
    }
    const commaSpaceStringProperty = SceneryPhetFluent.a11y.keyboard.helpPatterns.commaSpaceStringProperty;
    return SceneryPhetFluent.a11y.keyboard.helpPatterns.serialList.format( {
      items: items.slice( 0, -1 ).join( commaSpaceStringProperty.value ),
      last: items[ items.length - 1 ]
    } );
  }
}

sceneryPhet.register( 'HotkeyDescriptionBuilder', HotkeyDescriptionBuilder );
