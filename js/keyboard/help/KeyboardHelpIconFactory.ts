// Copyright 2019-2026, University of Colorado Boulder

/**
 * Reusable icons to be created for keyboard help shortcuts dialogs.
 * This type is only a collection of static methods, and should not be instantiated.
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import type { EnglishKeyString } from '../../../../scenery/js/accessibility/EnglishStringToCodeMap.js';
import HotkeyData from '../../../../scenery/js/input/HotkeyData.js';
import KeyDescriptor from '../../../../scenery/js/input/KeyDescriptor.js';
import HBox, { HBoxOptions } from '../../../../scenery/js/layout/nodes/HBox.js';
import VBox, { VBoxOptions } from '../../../../scenery/js/layout/nodes/VBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import PhetFont from '../../PhetFont.js';
import PlusNode from '../../PlusNode.js';
import sceneryPhet from '../../sceneryPhet.js';
import SceneryPhetFluent from '../../SceneryPhetFluent.js';
import ArrowKeyNode from '../ArrowKeyNode.js';
import KeyDisplayRegistry from '../KeyDisplayRegistry.js';
import LetterKeyNode from '../LetterKeyNode.js';
import TextKeyNode from '../TextKeyNode.js';
import HotkeySetDefinitions, { HotkeySetDefinitionEntry, HotkeySetVariant } from './HotkeySetDefinitions.js';

// constants
const DEFAULT_HORIZONTAL_KEY_SPACING = 1.3;
const OR_TEXT_MAX_WIDTH = 16;
const LABEL_FONT = new PhetFont( 16 );

type SelfOptions = EmptySelfOptions;

// Options for most static methods herein
type KeyboardHelpIconFactoryOptions = SelfOptions & StrictOmit<HBoxOptions, 'children'>;

// Options for the handful of static methods that additionally involve PlusNode
type WithPlusIconSelfOptions = {
  plusIconSize?: Dimension2;
};
type WithPlusIconOptions = WithPlusIconSelfOptions & KeyboardHelpIconFactoryOptions;

// Represents a collection of key descriptors that share the exact same modifiers. Each instance groups the modifier
// icons with the set of primary keys that can be paired with those modifiers so we can build rows like
// "Shift + [A] or Shift + [B]".
type ModifierGroup = {
  modifiers: EnglishKeyString[];
  keys: EnglishKeyString[];
};

// Represents the icon rows for a single keyboard action before they are composed into a single node. Each entry
// corresponds to one set of alternative key presses that should be displayed together.
export type KeyAlternativesIcon = {

  // These are the complete icon rows to present as alternatives. They will be separated by "or" when composed,
  // either inline or stacked depending on layout.
  // Example: Shift + [1,2] -> this holds two nodes: "Shift + 1" and "Shift + 2".
  alternatives: Node[];

  // Preferred layout when combining the presses for this group: inline will join them into a single line
  // while stacked puts each on its own row. Example for "Shift + [1,2]":
  // - inline:  [Shift + 1] or [Shift + 2]
  // - stacked: [Shift + 1] or
  //            [Shift + 2]
  layout: 'inline' | 'stacked';
};

export default class KeyboardHelpIconFactory {

  public static readonly DEFAULT_ICON_SPACING = 6.5;

  public constructor() {
    assert && assert( false, 'do not construct this, instead use its helper static methods for icon creation' );
  }

  /**
   * Horizontal layout of a set of icons, in left-to-right order.
   */
  public static iconRow( icons: Node[], providedOptions?: KeyboardHelpIconFactoryOptions ): Node {
    const options = optionize<KeyboardHelpIconFactoryOptions, SelfOptions, HBoxOptions>()( {
      spacing: DEFAULT_HORIZONTAL_KEY_SPACING,
      children: icons
    }, providedOptions );
    return new HBox( options );
  }

  /**
   * Two icons with horizontal layout, separated by 'or' text.
   */
  public static iconOrIcon( leftIcon: Node, rightIcon: Node, providedOptions?: KeyboardHelpIconFactoryOptions ): Node {

    const options = combineOptions<KeyboardHelpIconFactoryOptions>( {
      spacing: KeyboardHelpIconFactory.DEFAULT_ICON_SPACING
    }, providedOptions );

    const orText = new Text( SceneryPhetFluent.keyboardHelpDialog.orStringProperty, {
      font: LABEL_FONT,
      maxWidth: OR_TEXT_MAX_WIDTH
    } );

    return KeyboardHelpIconFactory.iconRow( [ new Node( { children: [ leftIcon ] } ), orText,
      new Node( { children: [ rightIcon ] } ) ], options );
  }

  /**
   * Two icons with horizontal layout, and separated by '-' text. This is useful for a range, like 0-9.
   */
  public static iconToIcon( leftIcon: Node, rightIcon: Node, providedOptions?: KeyboardHelpIconFactoryOptions ): Node {

    const options = combineOptions<KeyboardHelpIconFactoryOptions>( {
      spacing: KeyboardHelpIconFactory.DEFAULT_ICON_SPACING / 2
    }, providedOptions );

    const hyphenText = new Text( SceneryPhetFluent.keyboardHelpDialog.hyphenStringProperty, {
      font: LABEL_FONT,
      maxWidth: OR_TEXT_MAX_WIDTH
    } );

    return KeyboardHelpIconFactory.iconRow( [ new Node( { children: [ leftIcon ] } ), hyphenText, new Node( { children: [ rightIcon ] } ) ], options );
  }

  /**
   * Two icons with horizontal layout, separated by '+' text.
   */
  public static iconPlusIcon( leftIcon: Node, rightIcon: Node, providedOptions?: WithPlusIconOptions ): Node {
    return KeyboardHelpIconFactory.iconPlusIconRow( [ leftIcon, rightIcon ], providedOptions );
  }

  /**
   * Returns a row of icons separated by '+'. Useful when a keyboard shortcut has multiple modifier keys for one
   * key press listener.
   */
  public static iconPlusIconRow( iconList: Node[], providedOptions?: WithPlusIconOptions ): Node {
    const options = combineOptions<WithPlusIconOptions>( {
      plusIconSize: new Dimension2( 8, 1.2 ),
      spacing: KeyboardHelpIconFactory.DEFAULT_ICON_SPACING
    }, providedOptions );

    // Weave plus icons into the provided array of icons. Like Array.join, but with a new array instead of a string.
    const iconListWithSeparators = [];
    for ( let i = 0; i < iconList.length; i++ ) {

      // Scenery layout controls transforms of children. Since we don't own the iconNode, we have to wrap it in another
      // so that layout will work in cases of DAG.
      iconListWithSeparators.push(
        new Node( {
          children: [ iconList[ i ] ]
        } )
      );

      // don't add the separator to the last item
      if ( i < iconList.length - 1 ) {
        iconListWithSeparators.push( new PlusNode( {
          size: options.plusIconSize
        } ) );
      }
    }

    return KeyboardHelpIconFactory.iconRow( iconListWithSeparators, {
      spacing: options.spacing
    } );
  }

  /**
   * Vertically stacked list of icons, each separated by 'or' text on the same row. Useful when a modifier combination
   * can be expressed as multiple grouped alternatives and the horizontal layout would become cramped.
   */
  public static iconListWithOr( icons: Node[], providedOptions?: VBoxOptions ): Node {
    if ( icons.length === 0 ) {
      return new Node();
    }

    const nodes: Node[] = [];
    for ( let i = 0; i < icons.length; i++ ) {
      const icon = icons[ i ];
      if ( i < icons.length - 1 ) {
        const orText = new Text( SceneryPhetFluent.keyboardHelpDialog.orStringProperty, {
          font: LABEL_FONT,
          maxWidth: OR_TEXT_MAX_WIDTH
        } );
        nodes.push( new HBox( {
          children: [ new Node( { children: [ icon ] } ), orText ],
          spacing: KeyboardHelpIconFactory.DEFAULT_ICON_SPACING
        } ) );
      }
      else {
        nodes.push( new Node( { children: [ icon ] } ) );
      }
    }

    const options = combineOptions<VBoxOptions>( {
      spacing: KeyboardHelpIconFactory.DEFAULT_ICON_SPACING,
      align: 'left',
      children: nodes
    }, providedOptions );

    return new VBox( options );
  }

  /**
   * An icon with horizontal layout in order: shift, plus, and provided icon.
   */
  public static shiftPlusIcon( icon: Node, providedOptions?: WithPlusIconOptions ): Node {
    const shiftKeyIcon = TextKeyNode.shift();
    return KeyboardHelpIconFactory.iconPlusIcon( shiftKeyIcon, icon, providedOptions );
  }

  /**
   * An icon with horizontal layout in order: alt, plus, and provided icon.
   */
  public static altPlusIcon( icon: Node, providedOptions?: WithPlusIconOptions ): Node {
    const altKeyIcon = TextKeyNode.altOrOption();
    return KeyboardHelpIconFactory.iconPlusIcon( altKeyIcon, icon, providedOptions );
  }

  /**
   * "Space or Enter" icon
   */
  public static spaceOrEnter(): Node {
    const spaceKey = TextKeyNode.space();
    const enterKey = TextKeyNode.enter();
    return KeyboardHelpIconFactory.iconOrIcon( spaceKey, enterKey );
  }

  /**
   * An icon with up and down arrows, separated by 'or', in horizontal layout.
   */
  public static upOrDown(): Node {
    const upArrowKeyNode = new ArrowKeyNode( 'up' );
    const downArrowKeyNode = new ArrowKeyNode( 'down' );
    return KeyboardHelpIconFactory.iconOrIcon( upArrowKeyNode, downArrowKeyNode );
  }

  /**
   * An icon with up and down arrow keys, in a horizontal layout.
   */
  public static wasdRowIcon( providedOptions?: KeyboardHelpIconFactoryOptions ): Node {

    const options = optionize<KeyboardHelpIconFactoryOptions, SelfOptions, HBoxOptions>()( {
      spacing: DEFAULT_HORIZONTAL_KEY_SPACING
    }, providedOptions );

    const WKeyNode = LetterKeyNode.w();
    const AKeyNode = LetterKeyNode.a();
    const SKeyNode = LetterKeyNode.s();
    const DKeyNode = LetterKeyNode.d();

    // Strings are not translated because they map directly to specific key codes.
    const icons = [ WKeyNode, AKeyNode, SKeyNode, DKeyNode ];

    return KeyboardHelpIconFactory.iconRow( icons, options );
  }

  /**
   * An icon with the 4 arrow keys, in a horizontal layout.
   */
  public static arrowKeysRowIcon( providedOptions?: KeyboardHelpIconFactoryOptions ): Node {

    const options = optionize<KeyboardHelpIconFactoryOptions, SelfOptions, HBoxOptions>()( {
      spacing: DEFAULT_HORIZONTAL_KEY_SPACING
    }, providedOptions );

    // order of these icons matches movement with the WASD keys
    const upArrowKeyNode = new ArrowKeyNode( 'up' );
    const leftArrowKeyNode = new ArrowKeyNode( 'left' );
    const downArrowKeyNode = new ArrowKeyNode( 'down' );
    const rightArrowKeyNode = new ArrowKeyNode( 'right' );
    return KeyboardHelpIconFactory.iconRow( [ upArrowKeyNode, leftArrowKeyNode, downArrowKeyNode, rightArrowKeyNode ], options );
  }

  /**
   * An icon with Left/Right arrows or Up/Down arrows, separated by "or".
   */
  public static leftRightOrUpDownArrowKeysRowIcon( providedOptions?: KeyboardHelpIconFactoryOptions ): Node {
    return KeyboardHelpIconFactory.iconOrIcon(
      KeyboardHelpIconFactory.leftRightArrowKeysRowIcon(),
      KeyboardHelpIconFactory.upDownArrowKeysRowIcon(),
      providedOptions
    );
  }

  /**
   * An icon with the 4 arrow keys, WASD keys, separated by "or", in horizontal layout.
   */
  public static arrowOrWasdKeysRowIcon( providedOptions?: KeyboardHelpIconFactoryOptions ): Node {

    const options = optionize<KeyboardHelpIconFactoryOptions, SelfOptions, HBoxOptions>()( {
      spacing: KeyboardHelpIconFactory.DEFAULT_ICON_SPACING
    }, providedOptions );

    const arrowKeys = KeyboardHelpIconFactory.arrowKeysRowIcon();
    const wasdKeys = KeyboardHelpIconFactory.wasdRowIcon();

    return KeyboardHelpIconFactory.iconOrIcon( arrowKeys, wasdKeys, options );
  }

  /**
   * An icon with page up/down keys, in horizontal layout.
   */
  public static pageUpPageDownRowIcon( providedOptions?: KeyboardHelpIconFactoryOptions ): Node {

    const options = optionize<KeyboardHelpIconFactoryOptions, SelfOptions, HBoxOptions>()( {
      spacing: KeyboardHelpIconFactory.DEFAULT_ICON_SPACING
    }, providedOptions );

    const pageUpKeyNode = TextKeyNode.pageUp();
    const pageDownKeyNode = TextKeyNode.pageDown();
    const icons = [ pageUpKeyNode, pageDownKeyNode ];

    return KeyboardHelpIconFactory.iconRow( icons, options );
  }

  /**
   * An icon with up and down arrow keys, in horizontal layout.
   */
  public static upDownArrowKeysRowIcon( providedOptions?: KeyboardHelpIconFactoryOptions ): Node {
    const upArrowKeyNode = new ArrowKeyNode( 'up' );
    const downArrowKeyNode = new ArrowKeyNode( 'down' );
    return KeyboardHelpIconFactory.iconRow( [ upArrowKeyNode, downArrowKeyNode ], providedOptions );
  }

  /**
   * Icon for the [W][S] keys, often used to move something vertically.
   */
  public static wSKeysRowIcon( providedOptions?: KeyboardHelpIconFactoryOptions ): Node {
    const aKeyNode = LetterKeyNode.w();
    const dKeyNode = LetterKeyNode.s();
    return KeyboardHelpIconFactory.iconRow( [ aKeyNode, dKeyNode ], providedOptions );
  }

  public static upDownOrWSKeysRowIcon( providedOptions?: KeyboardHelpIconFactoryOptions ): Node {
    return KeyboardHelpIconFactory.iconOrIcon(
      KeyboardHelpIconFactory.upDownArrowKeysRowIcon(),
      KeyboardHelpIconFactory.wSKeysRowIcon(),
      providedOptions
    );
  }

  /**
   * Icon for the [A][D] keys, often used to move something horizontally.
   */
  public static aDKeysRowIcon( providedOptions?: KeyboardHelpIconFactoryOptions ): Node {
    const aKeyNode = LetterKeyNode.a();
    const dKeyNode = LetterKeyNode.d();
    return KeyboardHelpIconFactory.iconRow( [ aKeyNode, dKeyNode ], providedOptions );
  }

  /**
   * An icon with left and right arrow keys, in horizontal layout.
   */
  public static leftRightArrowKeysRowIcon( providedOptions?: KeyboardHelpIconFactoryOptions ): Node {
    const leftArrowKeyNode = new ArrowKeyNode( 'left' );
    const rightArrowKeyNode = new ArrowKeyNode( 'right' );
    return KeyboardHelpIconFactory.iconRow( [ leftArrowKeyNode, rightArrowKeyNode ], providedOptions );
  }

  public static leftRightOrADKeysRowIcon( providedOptions?: KeyboardHelpIconFactoryOptions ): Node {
    return KeyboardHelpIconFactory.iconOrIcon(
      KeyboardHelpIconFactory.leftRightArrowKeysRowIcon(),
      KeyboardHelpIconFactory.aDKeysRowIcon(),
      providedOptions
    );
  }

  /**
   * Create an icon Node for a hotkey, based on the provided HotkeyData. Combines key icons with plus icons.
   * For example, a HotkeyData with 'shift+r' would produce a row with the shift icon, a plus icon, and the r icon.
   */
  public static fromHotkeyData( hotkeyData: HotkeyData, hotkeySetVariant: HotkeySetVariant = 'default' ): Node {
    return KeyboardHelpIconFactory.composeHotkeyIcon(
      KeyboardHelpIconFactory.fromHotkeyDataDetailed( hotkeyData, hotkeySetVariant )
    );
  }

  /**
   * Builds icon data for a HotkeyData entry, returning the per-group alternatives with their intended layout so
   * callers can take over layout if needed.
   */
  public static fromHotkeyDataDetailed( hotkeyData: HotkeyData, hotkeySetVariant: HotkeySetVariant = 'default' ): KeyAlternativesIcon[] {
    const groups = KeyboardHelpIconFactory.groupDescriptors( hotkeyData.keyDescriptorsProperty.value );
    return groups.map( group => KeyboardHelpIconFactory.buildGroupIconData( group, hotkeySetVariant ) );
  }

  /**
   * Collapses the raw list of descriptor entries into groups that share an identical modifier set so they can be
   * rendered as a single icon row. Deduplicates repeated keys within a modifier set so the help dialog doesn’t show
   * redundant entries.
   */
  private static groupDescriptors( descriptors: KeyDescriptor[] ): ModifierGroup[] {
    const map = new Map<string, ModifierGroup>();

    descriptors.forEach( descriptor => {
      const modifiers = HotkeySetDefinitions.sortModifiers( descriptor.modifierKeys );
      const key = modifiers.join( HotkeySetDefinitions.KEY_SEPARATOR );

      if ( !map.has( key ) ) {
        map.set( key, {
          modifiers: modifiers,
          keys: []
        } );
      }

      const group = map.get( key )!;
      const descriptorKey = descriptor.key;
      if ( !group.keys.includes( descriptorKey ) ) {
        group.keys.push( descriptorKey );
      }
    } );

    return [ ...map.values() ];
  }

  /**
   * Builds the icon data for a modifier group, expanding special-case definitions when present. Handles the case
   * where a modifier set fans out into multiple key partitions (for example, Shift + [1|2]) and records whether the
   * alternatives prefer inline or stacked layout based on the hotkey definition metadata.
   */
  private static buildGroupIconData( group: ModifierGroup, hotkeySetVariant: HotkeySetVariant ): KeyAlternativesIcon {
    const normalizedKeys = HotkeySetDefinitions.sortKeys( group.keys );
    const definition = HotkeySetDefinitions.getDefinition( normalizedKeys, hotkeySetVariant );
    const modifierIcons = group.modifiers.map( modifier => KeyDisplayRegistry.getKeyBuilder( modifier )() );
    let alternatives: Node[] | null = null;
    let layout: 'inline' | 'stacked' = 'inline';

    if ( group.modifiers.length > 0 ) {
      const partitions = HotkeySetDefinitions.partitionKeySetForModifiers( normalizedKeys, hotkeySetVariant );
      if ( partitions.length > 1 ) {
        alternatives = partitions.map( partition => {
          const keyIcon = KeyboardHelpIconFactory.createKeySetIcon( partition, hotkeySetVariant );
          return KeyboardHelpIconFactory.iconPlusIconRow( [ ...modifierIcons, keyIcon ] );
        } );
        layout = definition?.modifierPartitionLayout || 'inline';
      }
    }

    if ( !alternatives ) {
      const keyIcon = KeyboardHelpIconFactory.createKeySetIcon( normalizedKeys, hotkeySetVariant );
      alternatives = modifierIcons.length === 0 ? [ keyIcon ] : [
        KeyboardHelpIconFactory.iconPlusIconRow( [ ...modifierIcons, keyIcon ] )
      ];
    }

    return {
      alternatives: alternatives,
      layout: layout
    };
  }

  /**
   * Composes a modifier group's alternatives into a single icon node using the preferred layout.
   */
  private static composeGroupIcon( data: KeyAlternativesIcon ): Node {
    let iconNode: Node;
    if ( data.alternatives.length === 0 ) {
      iconNode = new Node();
    }
    else if ( data.layout === 'stacked' ) {
      iconNode = KeyboardHelpIconFactory.iconListWithOr( data.alternatives );
    }
    else {
      iconNode = KeyboardHelpIconFactory.connectIconsWithOr( data.alternatives );
    }

    return iconNode;
  }

  /**
   * Composes all modifier-group icons for a HotkeyData into a single node using each group's preferred layout.
   */
  public static composeHotkeyIcon( groups: KeyAlternativesIcon[] ): Node {
    const composedGroupIcons = groups.map( data => KeyboardHelpIconFactory.composeGroupIcon( data ) );
    return KeyboardHelpIconFactory.connectIconsWithOr( composedGroupIcons );
  }

  /**
   * Attempts to create a canned icon builder specified on the hotkey definition. The iconFactory entry must name
   * a static factory on `KeyboardHelpIconFactory`. Returns an icon Node when successful, otherwise null.
   */
  private static buildIconFromDefinition( definition: HotkeySetDefinitionEntry | null ): Node | null {
    if ( !definition?.iconFactory ) {
      return null;
    }

    const methodName = definition.iconFactory;
    const builder = KeyboardHelpIconFactory[ methodName ];

    if ( typeof builder === 'function' ) {
      return ( builder as () => Node )();
    }

    return null;
  }

  /**
   * Produces the icon for a set of keys that share the same modifiers. Prefers the specialized icon builders declared
   * in `HotkeySetDefinitions`. If none exist, falls back to composing individual key nodes and joins them with `or`
   * when multiple alternatives remain.
   */
  private static createKeySetIcon( keys: EnglishKeyString[], hotkeySetVariant: HotkeySetVariant ): Node {
    const normalizedKeys = HotkeySetDefinitions.sortKeys( keys );
    const definition = HotkeySetDefinitions.getDefinition( normalizedKeys, hotkeySetVariant );

    const iconFromDefinition = KeyboardHelpIconFactory.buildIconFromDefinition( definition );
    if ( iconFromDefinition ) {
      return iconFromDefinition;
    }

    const keyNodes = normalizedKeys.map( key => KeyDisplayRegistry.getKeyBuilder( key )() );
    if ( keyNodes.length === 1 ) {
      return keyNodes[ 0 ];
    }

    return KeyboardHelpIconFactory.connectIconsWithOr( keyNodes );
  }

  /**
   * Chains an arbitrary number of icon nodes together with the localized "or" separator, preserving the original
   * order. Returns an empty placeholder node when there are no icons so callers don’t need their own guards.
   */
  private static connectIconsWithOr( icons: Node[] ): Node {
    if ( icons.length === 0 ) {
      return new Node();
    }

    return icons.reduce( ( acc, icon ) => acc ? KeyboardHelpIconFactory.iconOrIcon( acc, icon ) : icon, null as Node | null )!;
  }
}

assert && assert( Object.keys( KeyboardHelpIconFactory.prototype ).length === 0,
  'KeyboardHelpIconFactory only has static functions' );

sceneryPhet.register( 'KeyboardHelpIconFactory', KeyboardHelpIconFactory );
