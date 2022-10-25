// Copyright 2019-2022, University of Colorado Boulder

/**
 * Reusable icons to be created for keyboard help shortcuts dialogs.
 * This type is only a collection of static methods, and should not be instantiated.
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import { HBox, HBoxOptions, Node, Text } from '../../../../scenery/js/imports.js';
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

    return KeyboardHelpIconFactory.iconRow( [ leftIcon, orText, rightIcon ], options );
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

    return KeyboardHelpIconFactory.iconRow( [ leftIcon, hyphenText, rightIcon ], options );
  }

  /**
   * Two icons with horizontal layout, separated by '+' text.
   */
  public static iconPlusIcon( leftIcon: Node, rightIcon: Node, providedOptions?: WithPlusIconOptions ): Node {

    const options = combineOptions<WithPlusIconOptions>( {
      plusIconSize: new Dimension2( 8, 1.2 ),
      spacing: KeyboardHelpIconFactory.DEFAULT_ICON_SPACING
    }, providedOptions );

    const plusIconNode = new PlusNode( {
      size: options.plusIconSize
    } );

    return KeyboardHelpIconFactory.iconRow( [ leftIcon, plusIconNode, rightIcon ], options );
  }

  /**
   * An icon with horizontal layout in order: shift, plus, and provided icon.
   */
  public static shiftPlusIcon( icon: Node, providedOptions?: WithPlusIconOptions ): Node {

    const options = combineOptions<WithPlusIconOptions>( {
      plusIconSize: new Dimension2( 8, 1.2 ),
      spacing: KeyboardHelpIconFactory.DEFAULT_ICON_SPACING
    }, providedOptions );

    const shiftKeyIcon = TextKeyNode.shift();

    const plusIconNode = new PlusNode( {
      size: options.plusIconSize
    } );

    return KeyboardHelpIconFactory.iconRow( [ shiftKeyIcon, plusIconNode, icon ], options );
  }

  /**
   * "Space or Enter" icon
   */
  public static spaceOrEnter(): Node {
    return KeyboardHelpIconFactory.iconOrIcon( TextKeyNode.space(), TextKeyNode.enter() );
  }

  /**
   * An icon with up and down arrows, separated by 'or', in horizontal layout.
   */
  public static upOrDown(): Node {
    return KeyboardHelpIconFactory.iconOrIcon( new ArrowKeyNode( 'up' ), new ArrowKeyNode( 'down' ) );
  }

  /**
   * An icon with up and down arrow keys, in a horizontal layout.
   */
  public static wasdRowIcon( providedOptions?: KeyboardHelpIconFactoryOptions ): Node {

    const options = optionize<KeyboardHelpIconFactoryOptions, SelfOptions, HBoxOptions>()( {
      spacing: DEFAULT_HORIZONTAL_KEY_SPACING
    }, providedOptions );

    // Strings are not translated because they map directly to specific key codes.
    const icons = [ new LetterKeyNode( 'W' ), new LetterKeyNode( 'A' ), new LetterKeyNode( 'S' ), new LetterKeyNode( 'D' ) ];

    return KeyboardHelpIconFactory.iconRow( icons, options );
  }

  /**
   * An icon with the 4 arrow keys, in a horizontal layout.
   */
  public static arrowKeysRowIcon( providedOptions?: KeyboardHelpIconFactoryOptions ): Node {

    const options = optionize<KeyboardHelpIconFactoryOptions, SelfOptions, HBoxOptions>()( {
      spacing: DEFAULT_HORIZONTAL_KEY_SPACING
    }, providedOptions );

    const icons = [ new ArrowKeyNode( 'up' ), new ArrowKeyNode( 'left' ), new ArrowKeyNode( 'down' ), new ArrowKeyNode( 'right' ) ];

    return KeyboardHelpIconFactory.iconRow( icons, options );
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

    const icons = [ TextKeyNode.pageUp(), TextKeyNode.pageDown() ];

    return KeyboardHelpIconFactory.iconRow( icons, options );
  }

  /**
   * An icon with up and down arrow keys, in horizontal layout.
   */
  public static upDownArrowKeysRowIcon( providedOptions?: KeyboardHelpIconFactoryOptions ): Node {
    return KeyboardHelpIconFactory.iconRow( [ new ArrowKeyNode( 'up' ), new ArrowKeyNode( 'down' ) ], providedOptions );
  }

  /**
   * An icon with left and right arrow keys, in horizontal layout.
   */
  public static leftRightArrowKeysRowIcon( providedOptions?: KeyboardHelpIconFactoryOptions ): Node {
    return KeyboardHelpIconFactory.iconRow( [ new ArrowKeyNode( 'left' ), new ArrowKeyNode( 'right' ) ], providedOptions );
  }
}

assert && assert( Object.keys( KeyboardHelpIconFactory.prototype ).length === 0,
  'KeyboardHelpIconFactory only has static functions' );

sceneryPhet.register( 'KeyboardHelpIconFactory', KeyboardHelpIconFactory );