// Copyright 2025, University of Colorado Boulder

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
import HotkeySetDefinitions from './HotkeySetDefinitions.js';

// Represents a collection of descriptor keys that share the same modifier combination.
type ModifierGroup = {

  // Modifiers shared by every key in the group.
  modifiers: EnglishKeyString[];

  // Raw keys associated with the modifier set.
  keys: EnglishKeyString[];
};

// Word used when joining two entries in a human-friendly list ("A or B").
const OR_STRING_PROPERTY = SceneryPhetFluent.keyboardHelpDialog.orStringProperty;
const PLUS_STRING_PROPERTY = SceneryPhetFluent.a11y.keyboard.listFormatting.plusStringProperty;
const SPACE_PLUS_SPACE_STRING_PROPERTY = SceneryPhetFluent.a11y.keyboard.listFormatting.spacePlusSpaceStringProperty;
const WITH_STRING_PROPERTY = SceneryPhetFluent.a11y.keyboard.listFormatting.withStringProperty;
const COMMA_SPACE_STRING_PROPERTY = SceneryPhetFluent.a11y.keyboard.listFormatting.commaSpaceStringProperty;
const KEY_STRING_PROPERTY = SceneryPhetFluent.a11y.keyboard.labels.keyStringProperty;
const KEYS_STRING_PROPERTY = SceneryPhetFluent.a11y.keyboard.labels.keysStringProperty;

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
   */
  public static createDescriptionProperty(
    actionStringProperty: TReadOnlyProperty<string>,
    keyDescriptorsProperty: TReadOnlyProperty<KeyDescriptor[]>
  ): TReadOnlyProperty<string> {

    // NOTE: We assume here that keyDescriptors will not change. The only way they can change is if the actual
    // keys themselves change, which PhET does not (and may never) support. If remapping keys at runtime becomes
    // a supported feature, we will need to recompute the dependencies/create a new DerivedProperty every time the
    // descriptor changes. It is not worth including that complexity for a hypothetical feature.
    const keyDescriptors = keyDescriptorsProperty.value;

    // Collect all string Properties that may be used in the final description string. To support dynamic locales,
    // they must all be used as dependencies so that changes trigger a recompute.
    const descriptorLabelProperties = HotkeyDescriptionBuilder.getLabelPropertiesForDescriptors( keyDescriptors );
    const descriptorPhraseProperties = HotkeyDescriptionBuilder.getPhrasePropertiesForDescriptors( keyDescriptors );

    return DerivedProperty.deriveAny( [
      actionStringProperty,
      ...descriptorLabelProperties,
      ...descriptorPhraseProperties,

      // additional dependency strings that may change with language
      OR_STRING_PROPERTY,
      PLUS_STRING_PROPERTY,
      WITH_STRING_PROPERTY,
      SPACE_PLUS_SPACE_STRING_PROPERTY,
      COMMA_SPACE_STRING_PROPERTY,
      KEY_STRING_PROPERTY,
      KEYS_STRING_PROPERTY
    ], () => HotkeyDescriptionBuilder.createDescriptionString( actionStringProperty.value, keyDescriptors ) );
  }

  /**
   * Builds the full sentence for the keyboard help row.
   */
  private static createDescriptionString( actionString: string, keyDescriptors: KeyDescriptor[] ): string {
    const trimmedAction = actionString.trim();
    if ( !trimmedAction ) {
      return '';
    }

    const keyPhrase = HotkeyDescriptionBuilder.describeDescriptors( keyDescriptors );
    if ( !keyPhrase ) {
      return `${trimmedAction}.`;
    }

    return `${trimmedAction} ${WITH_STRING_PROPERTY.value} ${keyPhrase}.`;
  }

  /**
   * Produces a localized phrase that describes the provided descriptors, combining groups when possible.
   */
  private static describeDescriptors( descriptors: KeyDescriptor[] ): string {
    if ( descriptors.length === 0 ) {
      return '';
    }

    const groups = HotkeyDescriptionBuilder.groupDescriptors( descriptors );
    const clauses = groups
      .map( group => HotkeyDescriptionBuilder.describeGroup( group ) )
      .filter( clause => clause.length > 0 );

    return HotkeyDescriptionBuilder.joinList( clauses );
  }

  /**
   * Generates a clause for a single modifier grouping, optionally splitting keys when clusters are detected.
   */
  private static describeGroup( group: ModifierGroup ): string {
    const modifierDescription = HotkeyDescriptionBuilder.describeModifiers( group.modifiers );
    const normalizedKeys = HotkeySetDefinitions.sortKeys( group.keys );

    if ( modifierDescription && group.modifiers.length > 0 ) {
      const partitions = HotkeySetDefinitions.partitionKeySetForModifiers( normalizedKeys );
      if ( partitions.length > 1 ) {
        const partitionDescriptions = partitions.map( partition => {
          const description = HotkeyDescriptionBuilder.describeKeySet( partition );
          return description ? `${modifierDescription} ${PLUS_STRING_PROPERTY.value} ${description}` : modifierDescription;
        } ).filter( desc => desc.length > 0 );

        if ( partitionDescriptions.length > 0 ) {
          return HotkeyDescriptionBuilder.joinList( partitionDescriptions );
        }
      }
    }

    const keyDescription = HotkeyDescriptionBuilder.describeKeySet( normalizedKeys );

    if ( modifierDescription && keyDescription ) {
      return `${modifierDescription} ${PLUS_STRING_PROPERTY.value} ${keyDescription}`;
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
    return labels.join( SPACE_PLUS_SPACE_STRING_PROPERTY.value );
  }

  /**
   * Describes a single modifier, respecting platform-specific overrides when available.
   */
  private static describeModifier( modifier: EnglishKeyString ): string {
    if ( MODIFIER_LABEL_OVERRIDES[ modifier ] ) {
      return MODIFIER_LABEL_OVERRIDES[ modifier ].value;
    }

    // Fall back to describing it like a standard key.
    return `${KeyDisplayRegistry.getKeyLabelProperty( modifier ).value} ${KEY_STRING_PROPERTY.value}`;
  }

  /**
   * Builds a description for a set of non-modifier keys, preferring shared definitions when possible.
   */
  private static describeKeySet( keys: EnglishKeyString[] ): string {
    if ( keys.length === 0 ) {
      return '';
    }

    const normalizedKeys = HotkeySetDefinitions.sortKeys( keys );
    const definition = HotkeySetDefinitions.getDefinition( normalizedKeys );
    if ( definition?.phraseProperty ) {
      return definition.phraseProperty.value;
    }

    const labels = normalizedKeys.map( key => KeyDisplayRegistry.getKeyLabelProperty( key ).value );
    if ( labels.length === 1 ) {
      return `${labels[ 0 ]} ${KEY_STRING_PROPERTY.value}`;
    }
    return `${HotkeyDescriptionBuilder.joinList( labels )} ${KEYS_STRING_PROPERTY.value}`;
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
    descriptors: KeyDescriptor[]
  ): TReadOnlyProperty<string>[] {
    const phraseProperties = new Set<TReadOnlyProperty<string>>();
    const groups = HotkeyDescriptionBuilder.groupDescriptors( descriptors );

    const addPhraseForKeys = ( keys: EnglishKeyString[] ): void => {
      const definition = HotkeySetDefinitions.getDefinition( keys );
      if ( definition?.phraseProperty ) {
        phraseProperties.add( definition.phraseProperty );
      }
    };

    groups.forEach( group => {
      const normalizedKeys = HotkeySetDefinitions.sortKeys( group.keys );
      addPhraseForKeys( normalizedKeys );

      if ( group.modifiers.length > 0 ) {
        const partitions = HotkeySetDefinitions.partitionKeySetForModifiers( normalizedKeys );
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
      const modifiers = HotkeySetDefinitions.sortModifiers( descriptor.modifierKeys );
      const key = modifiers.join( '|' );

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
      return `${items[ 0 ]} ${OR_STRING_PROPERTY.value} ${items[ 1 ]}`;
    }
    return `${items.slice( 0, -1 ).join( COMMA_SPACE_STRING_PROPERTY.value )}, ${OR_STRING_PROPERTY.value} ${items[ items.length - 1 ]}`;
  }
}

sceneryPhet.register( 'HotkeyDescriptionBuilder', HotkeyDescriptionBuilder );
