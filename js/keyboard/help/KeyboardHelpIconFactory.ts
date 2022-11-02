// Copyright 2019-2022, University of Colorado Boulder

/**
 * Reusable icons to be created for keyboard help shortcuts dialogs.
 * This type is only a collection of static methods, and should not be instantiated.
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import Emitter from '../../../../axon/js/Emitter.js';
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

class KeyboardIconNode extends Node {
  public readonly disposeEmitter = new Emitter();

  public override dispose(): void {
    this.disposeEmitter.emit();
    super.dispose();
  }
}

export default class KeyboardHelpIconFactory {

  public static readonly DEFAULT_ICON_SPACING = 6.5;

  public constructor() {
    assert && assert( false, 'do not construct this, instead use its helper static methods for icon creation' );
  }

  /**
   * Horizontal layout of a set of icons, in left-to-right order.
   */
  public static iconRow( icons: Node[], providedOptions?: KeyboardHelpIconFactoryOptions ): KeyboardIconNode {
    const options = optionize<KeyboardHelpIconFactoryOptions, SelfOptions, HBoxOptions>()( {
      spacing: DEFAULT_HORIZONTAL_KEY_SPACING,
      children: icons
    }, providedOptions );
    const hBox = new HBox( options );
    const icon = new KeyboardIconNode( { children: [ hBox ] } );
    icon.disposeEmitter.addListener( () => {
      hBox.dispose();
    } );
    return icon;
  }

  /**
   * Two icons with horizontal layout, separated by 'or' text.
   */
  public static iconOrIcon( leftIcon: Node, rightIcon: Node, providedOptions?: KeyboardHelpIconFactoryOptions ): KeyboardIconNode {

    const options = combineOptions<KeyboardHelpIconFactoryOptions>( {
      spacing: KeyboardHelpIconFactory.DEFAULT_ICON_SPACING
    }, providedOptions );

    const orText = new Text( SceneryPhetStrings.keyboardHelpDialog.orStringProperty, {
      font: LABEL_FONT,
      maxWidth: OR_TEXT_MAX_WIDTH
    } );

    const icon = KeyboardHelpIconFactory.iconRow( [ new Node( { children: [ leftIcon ] } ), orText,
      new Node( { children: [ rightIcon ] } ) ], options );
    icon.disposeEmitter.addListener( () => {
      orText.dispose();
    } );
    return icon;
  }

  /**
   * Two icons with horizontal layout, and separated by '-' text. This is useful for a range, like 0-9.
   */
  public static iconToIcon( leftIcon: Node, rightIcon: Node, providedOptions?: KeyboardHelpIconFactoryOptions ): KeyboardIconNode {

    const options = combineOptions<KeyboardHelpIconFactoryOptions>( {
      spacing: KeyboardHelpIconFactory.DEFAULT_ICON_SPACING / 2
    }, providedOptions );

    const hyphenText = new Text( SceneryPhetStrings.keyboardHelpDialog.hyphenStringProperty, {
      font: LABEL_FONT,
      maxWidth: OR_TEXT_MAX_WIDTH
    } );

    const icon = KeyboardHelpIconFactory.iconRow( [ new Node( { children: [ leftIcon ] } ), hyphenText, new Node( { children: [ rightIcon ] } ) ], options );
    icon.disposeEmitter.addListener( () => {
      hyphenText.dispose();
    } );
    return icon;
  }

  /**
   * Two icons with horizontal layout, separated by '+' text.
   */
  public static iconPlusIcon( leftIcon: Node, rightIcon: Node, providedOptions?: WithPlusIconOptions ): KeyboardIconNode {

    const options = combineOptions<WithPlusIconOptions>( {
      plusIconSize: new Dimension2( 8, 1.2 ),
      spacing: KeyboardHelpIconFactory.DEFAULT_ICON_SPACING
    }, providedOptions );

    const plusIconNode = new PlusNode( {
      size: options.plusIconSize
    } );

    return KeyboardHelpIconFactory.iconRow( [ new Node( { children: [ leftIcon ] } ), plusIconNode, new Node( { children: [ rightIcon ] } ) ], options );
  }

  /**
   * An icon with horizontal layout in order: shift, plus, and provided icon.
   */
  public static shiftPlusIcon( icon: Node, providedOptions?: WithPlusIconOptions ): KeyboardIconNode {

    const options = combineOptions<WithPlusIconOptions>( {
      plusIconSize: new Dimension2( 8, 1.2 ),
      spacing: KeyboardHelpIconFactory.DEFAULT_ICON_SPACING
    }, providedOptions );

    const shiftKeyIcon = TextKeyNode.shift();

    const plusIconNode = new PlusNode( {
      size: options.plusIconSize
    } );

    const iconNode = KeyboardHelpIconFactory.iconRow( [ shiftKeyIcon, plusIconNode, new Node( { children: [ icon ] } ) ], options );
    iconNode.disposeEmitter.addListener( () => {
      shiftKeyIcon.dispose();
      plusIconNode.dispose();
    } );
    return iconNode;
  }

  /**
   * "Space or Enter" icon
   */
  public static spaceOrEnter(): KeyboardIconNode {
    const spaceKey = TextKeyNode.space();
    const enterKey = TextKeyNode.enter();
    const icon = KeyboardHelpIconFactory.iconOrIcon( spaceKey, enterKey );
    icon.disposeEmitter.addListener( () => {
      spaceKey.dispose();
      enterKey.dispose();
    } );
    return icon;
  }

  /**
   * An icon with up and down arrows, separated by 'or', in horizontal layout.
   */
  public static upOrDown(): KeyboardIconNode {
    const upArrowKeyNode = new ArrowKeyNode( 'up' );
    const downArrowKeyNode = new ArrowKeyNode( 'down' );
    const icon = KeyboardHelpIconFactory.iconOrIcon( upArrowKeyNode, downArrowKeyNode );
    icon.disposeEmitter.addListener( () => {
      upArrowKeyNode.dispose();
      downArrowKeyNode.dispose();
    } );
    return icon;
  }

  /**
   * An icon with up and down arrow keys, in a horizontal layout.
   */
  public static wasdRowIcon( providedOptions?: KeyboardHelpIconFactoryOptions ): KeyboardIconNode {

    const options = optionize<KeyboardHelpIconFactoryOptions, SelfOptions, HBoxOptions>()( {
      spacing: DEFAULT_HORIZONTAL_KEY_SPACING
    }, providedOptions );

    const WKeyNode = new LetterKeyNode( 'W' );
    const AKeyNode = new LetterKeyNode( 'A' );
    const SKeyNode = new LetterKeyNode( 'S' );
    const DKeyNode = new LetterKeyNode( 'D' );

    // Strings are not translated because they map directly to specific key codes.
    const icons = [ WKeyNode, AKeyNode, SKeyNode, DKeyNode ];

    const icon = KeyboardHelpIconFactory.iconRow( icons, options );
    icon.disposeEmitter.addListener( () => {
      WKeyNode.dispose();
      AKeyNode.dispose();
      SKeyNode.dispose();
      DKeyNode.dispose();
    } );
    return icon;
  }

  /**
   * An icon with the 4 arrow keys, in a horizontal layout.
   */
  public static arrowKeysRowIcon( providedOptions?: KeyboardHelpIconFactoryOptions ): KeyboardIconNode {

    const options = optionize<KeyboardHelpIconFactoryOptions, SelfOptions, HBoxOptions>()( {
      spacing: DEFAULT_HORIZONTAL_KEY_SPACING
    }, providedOptions );

    const upArrowKeyNode = new ArrowKeyNode( 'up' );
    const leftArrowKeyNode = new ArrowKeyNode( 'left' );
    const rightArrowKeyNode = new ArrowKeyNode( 'right' );
    const downArrowKeyNode = new ArrowKeyNode( 'down' );
    const icon = KeyboardHelpIconFactory.iconRow( [ upArrowKeyNode, leftArrowKeyNode, rightArrowKeyNode, downArrowKeyNode ], options );
    icon.disposeEmitter.addListener( () => {
      upArrowKeyNode.dispose();
      downArrowKeyNode.dispose();
      leftArrowKeyNode.dispose();
      rightArrowKeyNode.dispose();
    } );
    return icon;
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

    const icon = KeyboardHelpIconFactory.iconOrIcon( arrowKeys, wasdKeys, options );
    icon.disposeEmitter.addListener( () => {
      arrowKeys.dispose();
      wasdKeys.dispose();
    } );
    return icon;
  }

  /**
   * An icon with page up/down keys, in horizontal layout.
   */
  public static pageUpPageDownRowIcon( providedOptions?: KeyboardHelpIconFactoryOptions ): KeyboardIconNode {

    const options = optionize<KeyboardHelpIconFactoryOptions, SelfOptions, HBoxOptions>()( {
      spacing: KeyboardHelpIconFactory.DEFAULT_ICON_SPACING
    }, providedOptions );

    const pageUpKeyNode = TextKeyNode.pageUp();
    const pageDownKeyNode = TextKeyNode.pageDown();
    const icons = [ pageUpKeyNode, pageDownKeyNode ];

    const icon = KeyboardHelpIconFactory.iconRow( icons, options );
    icon.disposeEmitter.addListener( () => {
      pageUpKeyNode.dispose();
      pageDownKeyNode.dispose();
    } );
    return icon;
  }

  /**
   * An icon with up and down arrow keys, in horizontal layout.
   */
  public static upDownArrowKeysRowIcon( providedOptions?: KeyboardHelpIconFactoryOptions ): KeyboardIconNode {
    const upArrowKeyNode = new ArrowKeyNode( 'up' );
    const downArrowKeyNode = new ArrowKeyNode( 'down' );
    const icon = KeyboardHelpIconFactory.iconRow( [ upArrowKeyNode, downArrowKeyNode ], providedOptions );
    icon.disposeEmitter.addListener( () => {
      upArrowKeyNode.dispose();
      downArrowKeyNode.dispose();
    } );
    return icon;
  }

  /**
   * An icon with left and right arrow keys, in horizontal layout.
   */
  public static leftRightArrowKeysRowIcon( providedOptions?: KeyboardHelpIconFactoryOptions ): KeyboardIconNode {
    const leftArrowKeyNode = new ArrowKeyNode( 'left' );
    const rightArrowKeyNode = new ArrowKeyNode( 'right' );
    const icon = KeyboardHelpIconFactory.iconRow( [ leftArrowKeyNode, rightArrowKeyNode ], providedOptions );
    icon.disposeEmitter.addListener( () => {
      leftArrowKeyNode.dispose();
      rightArrowKeyNode.dispose();
    } );
    return icon;
  }
}

assert && assert( Object.keys( KeyboardHelpIconFactory.prototype ).length === 0,
  'KeyboardHelpIconFactory only has static functions' );

sceneryPhet.register( 'KeyboardHelpIconFactory', KeyboardHelpIconFactory );