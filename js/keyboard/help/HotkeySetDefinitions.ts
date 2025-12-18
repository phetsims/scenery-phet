// Copyright 2025, University of Colorado Boulder

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

// Structure describing how a set of raw keyboard inputs should be represented textually and visually.
export type HotkeySetDefinitionEntry = {

  // Keys that comprise the set.
  keys: readonly EnglishKeyString[];

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
    keys: LEFT_RIGHT_ARROW_KEYS,
    phraseProperty: SceneryPhetFluent.a11y.keySets.leftRightArrowsStringProperty,
    iconFactory: 'leftRightArrowKeysRowIcon'
  },
  {
    keys: UP_DOWN_ARROW_KEYS,
    phraseProperty: SceneryPhetFluent.a11y.keySets.upDownArrowsStringProperty,
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
    HOTKEY_SET_ENTRIES.map( entry => [ HotkeySetDefinitions.createKeyStrokeIdentifier( entry.keys ), entry ] )
  );

  // Returns the definition matching the provided key set, or null when no specialized grouping exists.
  public static getDefinition( keys: readonly EnglishKeyString[] ): HotkeySetDefinitionEntry | null {
    return HotkeySetDefinitions.HOTKEY_SET_DEFINITIONS.get( HotkeySetDefinitions.createKeyStrokeIdentifier( keys ) ) || null;
  }

  // Produces a stable string identifier for a key set so it can be used as a Map key.
  private static createKeyStrokeIdentifier( keys: readonly EnglishKeyString[] ): string {
    return HotkeySetDefinitions.sortKeys( keys ).join( '|' );
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
   * Sorts modifiers so that commonly used combinations appear in a consistent order.
   */
  public static sortModifiers( modifiers: readonly EnglishKeyString[] ): EnglishKeyString[] {
    const priority = ( modifier: EnglishKeyString ): number => {
      const index = HotkeySetDefinitions.MODIFIER_PRIORITY.indexOf( modifier );
      return index === -1 ? HotkeySetDefinitions.MODIFIER_PRIORITY.length : index;
    };

    return [ ...modifiers ].sort( ( a, b ) => {
      const diff = priority( a ) - priority( b );
      return diff !== 0 ? diff : a.localeCompare( b );
    } );
  }

  /**
   * Splits a key set into grouped partitions that can be rendered next to modifier keys without duplication.
   *
   * Example: `[ 'ctrl', 'shift', 'arrowLeft', 'arrowRight' ]` becomes
   * `[[ 'arrowLeft', 'arrowRight' ], [ 'ctrl', 'shift' ]]` so modifiers can be rendered beside the paired arrows.
   * Example: `[ 'ctrl', 'w', 's', 'space' ]` becomes
   * `[[ 'w', 's' ], [ 'ctrl', 'space' ]]`, keeping the W/S cluster intact while still preserving remaining keys.
   */
  public static partitionKeySetForModifiers( normalizedKeys: readonly EnglishKeyString[] ): EnglishKeyString[][] {
    const remaining = new Set<EnglishKeyString>( normalizedKeys );
    const partitions: EnglishKeyString[][] = [];

    MODIFIER_SPLIT_KEY_FAMILIES.forEach( family => {
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