// Copyright 2019-2025, University of Colorado Boulder

/**
 * Reusable icons to be created for keyboard help shortcuts dialogs.
 * This type is only a collection of static methods, and should not be instantiated.
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import HotkeyData from '../../../../scenery/js/input/HotkeyData.js';
import { OneKeyStrokeEntry } from '../../../../scenery/js/input/KeyDescriptor.js';
import HBox, { HBoxOptions } from '../../../../scenery/js/layout/nodes/HBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import PhetFont from '../../PhetFont.js';
import PlusNode from '../../PlusNode.js';
import sceneryPhet from '../../sceneryPhet.js';
import SceneryPhetStrings from '../../SceneryPhetStrings.js';
import ArrowKeyNode from '../ArrowKeyNode.js';
import LetterKeyNode from '../LetterKeyNode.js';
import TextKeyNode from '../TextKeyNode.js';

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

    const orText = new Text( SceneryPhetStrings.keyboardHelpDialog.orStringProperty, {
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

    const hyphenText = new Text( SceneryPhetStrings.keyboardHelpDialog.hyphenStringProperty, {
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
   * An icon with left and right arrow keys, in horizontal layout.
   */
  public static leftRightArrowKeysRowIcon( providedOptions?: KeyboardHelpIconFactoryOptions ): Node {
    const leftArrowKeyNode = new ArrowKeyNode( 'left' );
    const rightArrowKeyNode = new ArrowKeyNode( 'right' );
    return KeyboardHelpIconFactory.iconRow( [ leftArrowKeyNode, rightArrowKeyNode ], providedOptions );
  }

  /**
   * Maps English key strings to their corresponding icon nodes.
   */
  public static readonly ENGLISH_KEY_TO_KEY_NODE = new Map<OneKeyStrokeEntry, TextKeyNode>( [
    [ 'a', new LetterKeyNode( 'A' ) ],
    [ 'j', new LetterKeyNode( 'J' ) ],
    [ 'shift', TextKeyNode.shift() ],
    [ 'alt', TextKeyNode.altOrOption() ],
    [ 'escape', TextKeyNode.esc() ],
    [ 'arrowLeft', new ArrowKeyNode( 'left' ) ],
    [ 'arrowRight', new ArrowKeyNode( 'right' ) ],
    [ 'arrowUp', new ArrowKeyNode( 'up' ) ],
    [ 'arrowDown', new ArrowKeyNode( 'down' ) ],
    [ 'pageUp', TextKeyNode.pageUp() ],
    [ 'pageDown', TextKeyNode.pageDown() ],
    [ 'home', TextKeyNode.home() ],
    [ 'end', TextKeyNode.end() ],
    [ 'r', new LetterKeyNode( 'R' ) ],
    [ 's', new LetterKeyNode( 'S' ) ],
    [ 'l', new LetterKeyNode( 'L' ) ],
    [ 'c', new LetterKeyNode( 'C' ) ],
    [ 'h', new LetterKeyNode( 'H' ) ],
    [ 'w', new LetterKeyNode( 'W' ) ],
    [ 'j', new LetterKeyNode( 'J' ) ],
    [ 'k', new LetterKeyNode( 'K' ) ],
    [ 'n', new LetterKeyNode( 'N' ) ],
    [ '0', new LetterKeyNode( '0' ) ],
    [ '1', new LetterKeyNode( '1' ) ],
    [ '2', new LetterKeyNode( '2' ) ],
    [ '3', new LetterKeyNode( '3' ) ]
  ] );

  /**
   * Create an icon Node for a hotkey, based on the provided HotkeyData. Combines key icons with plus icons.
   * For example, a HotkeyData with 'shift+r' would produce a row with the shift icon, a plus icon, and the r icon.
   */
  public static fromHotkeyData( hotkeyData: HotkeyData ): Node {
    const modifierKeyNodes = hotkeyData.keyDescriptorsProperty.value[ 0 ].modifierKeys.map( modifierKey => {
      const keyNode = KeyboardHelpIconFactory.ENGLISH_KEY_TO_KEY_NODE.get( modifierKey )!;
      assert && assert( keyNode, 'modifier key not found in ENGLISH_KEY_TO_KEY_NODE' );
      return keyNode;
    } );

    const keyNode = KeyboardHelpIconFactory.ENGLISH_KEY_TO_KEY_NODE.get( hotkeyData.keyDescriptorsProperty.value[ 0 ].key )!;
    assert && assert( keyNode, 'key not found in ENGLISH_KEY_TO_KEY_NODE' );

    return KeyboardHelpIconFactory.iconPlusIconRow( [ ...modifierKeyNodes, keyNode ] );
  }


}

assert && assert( Object.keys( KeyboardHelpIconFactory.prototype ).length === 0,
  'KeyboardHelpIconFactory only has static functions' );

sceneryPhet.register( 'KeyboardHelpIconFactory', KeyboardHelpIconFactory );