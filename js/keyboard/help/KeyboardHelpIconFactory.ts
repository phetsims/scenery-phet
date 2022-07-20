// Copyright 2019-2022, University of Colorado Boulder

/**
 * Reusable icons to be created for keyboard help shortcuts dialogs.
 * This type is only a collection of static methods, and should not be instantiated.
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import optionize from '../../../../phet-core/js/optionize.js';
import EmptyObjectType from '../../../../phet-core/js/types/EmptyObjectType.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import { HBox, HBoxOptions, Node, Text } from '../../../../scenery/js/imports.js';
import PhetFont from '../../PhetFont.js';
import PlusNode from '../../PlusNode.js';
import sceneryPhet from '../../sceneryPhet.js';
import sceneryPhetStrings from '../../sceneryPhetStrings.js';
import ArrowKeyNode from '../ArrowKeyNode.js';
import LetterKeyNode from '../LetterKeyNode.js';
import TextKeyNode from '../TextKeyNode.js';

// constants
const DEFAULT_HORIZONTAL_KEY_SPACING = 1.3;
const OR_TEXT_MAX_WIDTH = 16;
const LABEL_FONT = new PhetFont( 16 );

type SelfOptions = EmptyObjectType;

// Options for most static methods herein
type KeyboardHelpIconFactoryOptions = EmptyObjectType & StrictOmit<HBoxOptions, 'children'>;

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
   * Get two icons with horizontal layout, and separated by 'or' text.
   */
  public static iconOrIcon( leftIcon: Node, rightIcon: Node, providedOptions?: KeyboardHelpIconFactoryOptions ): Node {

    const orText = new Text( sceneryPhetStrings.keyboardHelpDialog.or, {
      font: LABEL_FONT,
      maxWidth: OR_TEXT_MAX_WIDTH
    } );

    const options = optionize<KeyboardHelpIconFactoryOptions, SelfOptions, HBoxOptions>()( {
      spacing: KeyboardHelpIconFactory.DEFAULT_ICON_SPACING,
      children: [ leftIcon, orText, rightIcon ]
    }, providedOptions );

    return new HBox( options );
  }

  /**
   * Get two icons with horizontal layout, and separated by '-' text. This is useful for a range, like 0-9.
   */
  public static iconToIcon( leftIcon: Node, rightIcon: Node, providedOptions?: KeyboardHelpIconFactoryOptions ): Node {

    const hyphenText = new Text( sceneryPhetStrings.keyboardHelpDialog.hyphen, {
      font: LABEL_FONT,
      maxWidth: OR_TEXT_MAX_WIDTH
    } );

    const options = optionize<KeyboardHelpIconFactoryOptions, SelfOptions, HBoxOptions>()( {
      spacing: KeyboardHelpIconFactory.DEFAULT_ICON_SPACING / 2,
      children: [ leftIcon, hyphenText, rightIcon ]
    }, providedOptions );

    return new HBox( options );
  }

  /**
   * Get two icons with horizontal layout, and separated by '+' text.
   */
  public static iconPlusIcon( leftIcon: Node, rightIcon: Node, providedOptions?: WithPlusIconOptions ): Node {

    const options = optionize<WithPlusIconOptions, WithPlusIconSelfOptions, HBoxOptions>()( {
      plusIconSize: new Dimension2( 8, 1.2 ),
      spacing: KeyboardHelpIconFactory.DEFAULT_ICON_SPACING
    }, providedOptions );


    // plus icon
    const plusIconNode = new PlusNode( {
      size: options.plusIconSize
    } );

    options.children = [ leftIcon, plusIconNode, rightIcon ];

    return new HBox( options );
  }

  /**
   * Get horizontally aligned shift key icon plus another icon node. Horizontally aligned in order
   * of shift, plus icon, and desired icon.
   */
  public static shiftPlusIcon( icon: Node, providedOptions?: WithPlusIconOptions ): Node {

    const options = optionize<WithPlusIconOptions, WithPlusIconSelfOptions, HBoxOptions>()( {
      plusIconSize: new Dimension2( 8, 1.2 ),
      spacing: KeyboardHelpIconFactory.DEFAULT_ICON_SPACING
    }, providedOptions );

    // shift key icon
    const shiftKeyIcon = TextKeyNode.shift();

    // plus icon
    const plusIconNode = new PlusNode( {
      size: options.plusIconSize
    } );

    options.children = [ shiftKeyIcon, plusIconNode, icon ];

    return new HBox( options );
  }

  /**
   * "Space or Enter" icon
   */
  public static spaceOrEnter(): Node {
    return KeyboardHelpIconFactory.iconOrIcon( TextKeyNode.space(), TextKeyNode.enter() );
  }

  /**
   * "Up or down" icon
   */
  public static upOrDown(): Node {
    return KeyboardHelpIconFactory.iconOrIcon( new ArrowKeyNode( 'up' ), new ArrowKeyNode( 'down' ) );
  }

  /**
   * Adds a set of icons to a horizontal layout.
   */
  public static iconRow( icons: Node[], providedOptions?: KeyboardHelpIconFactoryOptions ): Node {
    const options = optionize<KeyboardHelpIconFactoryOptions, SelfOptions, HBoxOptions>()( {
      spacing: DEFAULT_HORIZONTAL_KEY_SPACING,
      children: icons
    }, providedOptions );
    return new HBox( options );
  }

  /**
   * An icon containing icons for the up and down arrow keys in a horizontal layout.
   */
  public static wasdRowIcon( providedOptions?: KeyboardHelpIconFactoryOptions ): Node {

    // These are not translated because they map directly to specific key codes.
    const wKeyNode = new LetterKeyNode( 'W' );
    const aKeyNode = new LetterKeyNode( 'A' );
    const sKeyNode = new LetterKeyNode( 'S' );
    const dKeyNode = new LetterKeyNode( 'D' );

    const options = optionize<KeyboardHelpIconFactoryOptions, SelfOptions, HBoxOptions>()( {
      spacing: DEFAULT_HORIZONTAL_KEY_SPACING,
      children: [ wKeyNode, aKeyNode, sKeyNode, dKeyNode ]
    }, providedOptions );

    //TODO https://github.com/phetsims/scenery-phet/issues/759 use KeyboardHelpIconFactory.iconRow?
    return new HBox( options );
  }

  /**
   * Get horizontally aligned arrow keys, all in a row including up, left, down, and right arrow keys in that order.
   */
  public static arrowKeysRowIcon( providedOptions?: KeyboardHelpIconFactoryOptions ): Node {

    const upArrowKeyNode = new ArrowKeyNode( 'up' );
    const leftArrowKeyNode = new ArrowKeyNode( 'left' );
    const downArrowKeyNode = new ArrowKeyNode( 'down' );
    const rightArrowKeyNode = new ArrowKeyNode( 'right' );

    const options = optionize<KeyboardHelpIconFactoryOptions, SelfOptions, HBoxOptions>()( {
      spacing: DEFAULT_HORIZONTAL_KEY_SPACING,
      children: [ upArrowKeyNode, leftArrowKeyNode, downArrowKeyNode, rightArrowKeyNode ]
    }, providedOptions );

    //TODO https://github.com/phetsims/scenery-phet/issues/759 use KeyboardHelpIconFactory.iconRow?
    return new HBox( options );
  }

  /**
   * An icon containing horizontally aligned arrow keys and horizontally aligned WASD keys, separated by an "or".
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
   * An icon containing icons for the page up/down keys aligned horizontally.
   */
  public static pageUpPageDownRowIcon( providedOptions?: KeyboardHelpIconFactoryOptions ): Node {

    const pageUpKeyNode = TextKeyNode.pageUp();
    const pageDownKeyNode = TextKeyNode.pageDown();

    const options = optionize<KeyboardHelpIconFactoryOptions, SelfOptions, HBoxOptions>()( {
      spacing: KeyboardHelpIconFactory.DEFAULT_ICON_SPACING,
      children: [ pageUpKeyNode, pageDownKeyNode ]
    }, providedOptions );

    //TODO https://github.com/phetsims/scenery-phet/issues/759 use KeyboardHelpIconFactory.iconRow?
    return new HBox( options );
  }

  /**
   * An icon containing icons for the up and down arrow keys aligned horizontally.
   */
  public static upDownArrowKeysRowIcon( providedOptions?: KeyboardHelpIconFactoryOptions ): Node {
    return KeyboardHelpIconFactory.iconRow( [ new ArrowKeyNode( 'up' ), new ArrowKeyNode( 'down' ) ], providedOptions );
  }

  /**
   * An icon containing the icons for the left and right arrow keys,  aligned horizontally.
   */
  public static leftRightArrowKeysRowIcon( providedOptions?: KeyboardHelpIconFactoryOptions ): Node {
    return KeyboardHelpIconFactory.iconRow( [ new ArrowKeyNode( 'left' ), new ArrowKeyNode( 'right' ) ], providedOptions );
  }
}

assert && assert( Object.keys( KeyboardHelpIconFactory.prototype ).length === 0,
  'KeyboardHelpIconFactory only has static functions' );

sceneryPhet.register( 'KeyboardHelpIconFactory', KeyboardHelpIconFactory );