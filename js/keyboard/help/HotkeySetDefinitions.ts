// Copyright 2025-2026, University of Colorado Boulder

/**
 * Shared definitions and ordering helpers for converting sets of keyboard descriptors into friendly phrases or icon
 * groupings. This keeps textual and visual builders in sync so that both can recognize higher level constructs like
 * arrow or WASD key clusters.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import type { EnglishKeyString } from '../../../../scenery/js/accessibility/EnglishStringToCodeMap.js';
import sceneryPhet from '../../sceneryPhet.js';
import SceneryPhetFluent from '../../SceneryPhetFluent.js';
import type KeyboardHelpIconFactory from './KeyboardHelpIconFactory.js';

const ARROW_KEYS = [ 'arrowLeft', 'arrowRight', 'arrowUp', 'arrowDown' ] as const;
const LEFT_RIGHT_ARROW_KEYS = [ 'arrowLeft', 'arrowRight' ] as const;
const UP_DOWN_ARROW_KEYS = [ 'arrowUp', 'arrowDown' ] as const;
const WASD_KEYS = [ 'w', 'a', 's', 'd' ] as const;
const AD_KEYS = [ 'a', 'd' ] as const;
const WS_KEYS = [ 'w', 's' ] as const;
const ARROW_OR_WASD_KEYS = [ ...ARROW_KEYS, ...WASD_KEYS ] as const;
const LEFT_RIGHT_OR_AD_KEYS = [ ...LEFT_RIGHT_ARROW_KEYS, ...AD_KEYS ] as const;
const UP_DOWN_OR_WS_KEYS = [ ...UP_DOWN_ARROW_KEYS, ...WS_KEYS ] as const;

export type HotkeySetVariant = 'default' | 'paired';

// Structure describing how a set of raw keyboard inputs should be represented textually and visually.
export type HotkeySetDefinitionEntry = {

  // Keys that comprise the set.
  keys: readonly EnglishKeyString[];

  // Optional variant identifier to allow alternate phrasing/layouts for the same key set.
  variant?: HotkeySetVariant;

  // Phrase that describing the set in natural language. Presented to the user and possibly recombined with
  // other phrases.
  phraseProperty?: TReadOnlyProperty<string>;

  // Identifier that maps to an icon factory in KeyboardHelpIconFactory. We keep the identifier here to avoid
  // a circular dependency while still allowing icon builders to share the same key-group knowledge.
  iconFactory?: keyof typeof KeyboardHelpIconFactory;

  // Layout specifier for how the key groupings should be aligned when rendered next to modifier keys.
  // 'inline' places all keys and modifiers in a single row, 'stacked' creates a vertical list of groups.
  // 'inline' - "Shift + [A] or Shift + [D]"
  // 'stacked' - "Shift + [A] or
  //              Shift + [D]"
  modifierPartitionLayout?: 'inline' | 'stacked';

  // Optional modifier-based partitions for this key set variant. When provided, these families are applied
  // before the default modifier split families. This will only be relevant if you provide the variant option.
  modifierPartitionFamilies?: readonly ( readonly EnglishKeyString[] )[];
};

/**
 * The list of grouped hotkey definitions shared across textual and icon builders.
 */
const HOTKEY_SET_ENTRIES: HotkeySetDefinitionEntry[] = [
  {
    keys: ARROW_OR_WASD_KEYS,
    phraseProperty: SceneryPhetFluent.a11y.keySets.arrowOrWASDStringProperty,
    iconFactory: 'arrowOrWasdKeysRowIcon',
    modifierPartitionLayout: 'stacked'
  },
  {
    keys: ARROW_KEYS,
    phraseProperty: SceneryPhetFluent.a11y.keySets.arrowStringProperty,
    iconFactory: 'arrowKeysRowIcon'
  },
  {
    // The arrow keys, but in a layout that separates the left/right and up/down pairs:
    // "Left and Right arrow keys, or Up and Down arrow keys"
    variant: 'paired',
    keys: ARROW_KEYS,
    phraseProperty: SceneryPhetFluent.a11y.keySets.leftRightOrUpDownArrowsStringProperty,
    iconFactory: 'leftRightOrUpDownArrowKeysRowIcon',
    modifierPartitionLayout: 'stacked',

    // So that left/right and up/down are given their own rows when splitting on the modifier key.
    modifierPartitionFamilies: [
      LEFT_RIGHT_ARROW_KEYS,
      UP_DOWN_ARROW_KEYS
    ]
  },
  {
    keys: LEFT_RIGHT_ARROW_KEYS,
    phraseProperty: SceneryPhetFluent.a11y.keySets.leftRightArrowsStringProperty,
    iconFactory: 'leftRightArrowKeysRowIcon'
  },
  {
    // Paired variant uses "or" phrasing when these keys are split out under a shared modifier
    variant: 'paired',
    keys: LEFT_RIGHT_ARROW_KEYS,
    phraseProperty: SceneryPhetFluent.a11y.keySets.leftOrRightArrowsStringProperty,
    iconFactory: 'leftRightArrowKeysRowIcon'
  },
  {
    keys: UP_DOWN_ARROW_KEYS,
    phraseProperty: SceneryPhetFluent.a11y.keySets.upDownArrowsStringProperty,
    iconFactory: 'upDownArrowKeysRowIcon'
  },
  {
    // Paired variant uses "or" phrasing when these keys are split out under a shared modifier
    variant: 'paired',
    keys: UP_DOWN_ARROW_KEYS,
    phraseProperty: SceneryPhetFluent.a11y.keySets.upOrDownArrowsStringProperty,
    iconFactory: 'upDownArrowKeysRowIcon'
  },
  {
    keys: WASD_KEYS,
    phraseProperty: SceneryPhetFluent.a11y.keySets.wasdStringProperty,
    iconFactory: 'wasdRowIcon'
  },
  {
    keys: AD_KEYS,
    phraseProperty: SceneryPhetFluent.a11y.keySets.adStringProperty,
    iconFactory: 'aDKeysRowIcon'
  },
  {
    keys: WS_KEYS,
    phraseProperty: SceneryPhetFluent.a11y.keySets.wsStringProperty,
    iconFactory: 'wSKeysRowIcon'
  },
  {
    keys: LEFT_RIGHT_OR_AD_KEYS,
    phraseProperty: SceneryPhetFluent.a11y.keySets.leftRightOrADStringProperty,
    iconFactory: 'leftRightOrADKeysRowIcon',
    modifierPartitionLayout: 'stacked'
  },
  {
    keys: UP_DOWN_OR_WS_KEYS,
    phraseProperty: SceneryPhetFluent.a11y.keySets.upDownOrWSStringProperty,
    iconFactory: 'upDownOrWSKeysRowIcon',
    modifierPartitionLayout: 'stacked'
  },
  {
    keys: [ 'pageUp', 'pageDown' ],
    iconFactory: 'pageUpPageDownRowIcon'
  }
];

// Families of keys that should stay grouped together when splitting a key set around modifiers.
const MODIFIER_SPLIT_KEY_FAMILIES: readonly ( readonly EnglishKeyString[] )[] = [
  ARROW_KEYS,
  WASD_KEYS,
  LEFT_RIGHT_ARROW_KEYS,
  AD_KEYS,
  UP_DOWN_ARROW_KEYS,
  WS_KEYS
];

// Provides helpers for de-duplicating, ordering, and describing hotkey sets and their modifiers.
export default class HotkeySetDefinitions {

  // Used to concatenate multiple keys into a single identifier. See HotkeySetDefinitions.createKeyStrokeIdentifier.
  // The character used is arbitrary, but it improves readability and helps avoid collisions that could happen from
  // bare concatenation.
  public static readonly KEY_SEPARATOR = '|';

  // Supports predictable ordering for common keystrokes so that icons and phrases are nicely formatted,
  // regardless of keys in the input data.
  public static readonly ONE_KEY_STROKE_PRIORITY: EnglishKeyString[] = [
    'arrowLeft', 'arrowRight', 'arrowUp', 'arrowDown',
    'w', 'a', 's', 'd',
    'space', 'enter', 'tab', 'escape',
    'pageUp', 'pageDown', 'home', 'end',
    'delete', 'backspace',
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
  ];

  // Supports predictable ordering for modifier keys in phrases and icons.
  public static readonly MODIFIER_PRIORITY: EnglishKeyString[] = [ 'ctrl', 'alt', 'shift', 'meta' ];

  // Lookup table keyed by the normalized createKeyStrokeIdentifier string representation of a key set.
  private static readonly HOTKEY_SET_DEFINITIONS = new Map<string, HotkeySetDefinitionEntry>(
    HOTKEY_SET_ENTRIES.map( entry => {
      assert && assert(
        !entry.modifierPartitionFamilies || ( entry.variant && entry.variant !== 'default' ),
        'modifierPartitionFamilies requires a non-default variant.'
      );

      return [
        HotkeySetDefinitions.createKeyStrokeIdentifier( entry.keys, entry.variant ),
        entry
      ];
    } )
  );

  // Returns the definition matching the provided key set, or null when no specialized grouping exists.
  public static getDefinition( keys: readonly EnglishKeyString[], variant = 'default' ): HotkeySetDefinitionEntry | null {
    const identifier = HotkeySetDefinitions.createKeyStrokeIdentifier( keys, variant );
    const definition = HotkeySetDefinitions.HOTKEY_SET_DEFINITIONS.get( identifier );
    if ( definition ) {
      return definition;
    }

    if ( variant !== 'default' ) {
      return HotkeySetDefinitions.HOTKEY_SET_DEFINITIONS.get(
        HotkeySetDefinitions.createKeyStrokeIdentifier( keys )
      ) || null;
    }

    return null;
  }

  /**
   * Builds a string identifier that is used as a map key for a keystroke. Parts are sorted and joined so the same
   * logical keystroke always produces the same, unambiguous identifier. For example:
   *
   * `[ 'shift', 'arrowLeft' ]` becomes `'shift|arrowLeft::default'`.
   *
   * The variant allows alternate phrasings/layouts for the same key set. IF provided, it is appended to the identifier.
   * For example:
   *
   * `[ 'arrowLeft', 'arrowRight' ]` with variant `'paired'` becomes `'arrowLeft|arrowRight::paired'`.
   */
  private static createKeyStrokeIdentifier( keys: readonly EnglishKeyString[], variant = 'default' ): string {
    return `${HotkeySetDefinitions.sortKeys( keys ).join( HotkeySetDefinitions.KEY_SEPARATOR )}::${variant}`;
  }

  /**
   * Sorts a key set into a predictable display order, prioritizing common navigation keys.
   */
  public static sortKeys( keys: readonly EnglishKeyString[] ): EnglishKeyString[] {
    const priority = ( key: EnglishKeyString ): number => {
      const index = HotkeySetDefinitions.ONE_KEY_STROKE_PRIORITY.indexOf( key );
      return index === -1 ? HotkeySetDefinitions.ONE_KEY_STROKE_PRIORITY.length : index;
    };
    return [ ...new Set( keys ) ].sort( ( a, b ) => {
      const diff = priority( a ) - priority( b );
      return diff !== 0 ? diff : a.localeCompare( b );
    } );
  }

  /**
   * Sorts modifier keys into a predictable display order. Standard modifiers (ctrl, alt, shift, meta) are prioritized.
   * Any other modifier keys are retained and placed afterward alphabetically so the ordering stays deterministic.
   *
   * Note that PhET treats modifierKeys as a broader, PhET-specific set beyond the OS-standard four. (See
   * KeyDescriptor.modifierKeys in scenery)
   *
   * Example:
   * [ 'shift','alt','j' ] -> [ 'alt','shift','j' ]
   */
  public static sortModifiers( keys: readonly EnglishKeyString[] ): EnglishKeyString[] {
    const priority = ( modifier: EnglishKeyString ): number => {
      const index = HotkeySetDefinitions.MODIFIER_PRIORITY.indexOf( modifier );
      return index === -1 ? HotkeySetDefinitions.MODIFIER_PRIORITY.length : index;
    };

    return [ ...keys ].sort( ( a, b ) => {
      const diff = priority( a ) - priority( b );
      return diff !== 0 ? diff : a.localeCompare( b );
    } );
  }

  /**
   * Detects known key groupings (arrows, WASD, etc. from MODIFIER_SPLIT_KEY_FAMILIES) and keeps them together so they
   * can be rendered with a shared modifier set. Modifiers are not included in the groups. These are only the
   * non-modifier keys that are likely to share the same modifiers. Variant-specific splits can be applied first.
   *
   * Examples:
   * [ arrowLeft, arrowRight, space ] -> [ [ arrowLeft, arrowRight ], [ space ] ]
   * [ w, s, space ] -> [ [ w, s ], [ space ] ]
   * [ space ] -> [ [ space ] ]  // no grouping needed
   *
   * Callers prepend the same modifier set to each partition when rendering text/icons so grouped keys stay together
   * and stray keys get their own row/phrase.
   *
   * It may return 1+ partitions. If no known grouping is fully present (or there’s only one group with no leftovers),
   * it returns a single partition containing all keys.
   */
  public static partitionKeySetForModifiers(
    normalizedKeys: readonly EnglishKeyString[],
    variant = 'default'
  ): EnglishKeyString[][] {
    const remaining = new Set<EnglishKeyString>( normalizedKeys );
    const partitions: EnglishKeyString[][] = [];

    const definition = HotkeySetDefinitions.getDefinition( normalizedKeys, variant );
    const variantFamilies = definition?.modifierPartitionFamilies || [];
    const families = [ ...variantFamilies, ...MODIFIER_SPLIT_KEY_FAMILIES ];

    families.forEach( family => {
      if ( family.every( key => remaining.has( key ) ) ) {
        partitions.push( [ ...family ] );
        family.forEach( key => remaining.delete( key ) );
      }
    } );

    const hasRemaining = remaining.size > 0;
    const matchedCount = partitions.length;

    if ( matchedCount === 0 || ( matchedCount === 1 && !hasRemaining ) ) {
      return [ [ ...normalizedKeys ] ];
    }

    if ( hasRemaining ) {
      partitions.push( HotkeySetDefinitions.sortKeys( Array.from( remaining ) ) );
    }

    return partitions;
  }
}

sceneryPhet.register( 'HotkeySetDefinitions', HotkeySetDefinitions );
