// Copyright 2019-2020, University of Colorado Boulder

/**
 * Reusable icons to be created for keyboard help shortcuts dialogs. This type is only a collection of static methods, and
 * should not be instantiated.
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import merge from '../../../../phet-core/js/merge.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import PhetFont from '../../PhetFont.js';
import PlusNode from '../../PlusNode.js';
import sceneryPhetStrings from '../../sceneryPhetStrings.js';
import sceneryPhet from '../../sceneryPhet.js';
import ArrowKeyNode from '../ArrowKeyNode.js';
import EnterKeyNode from '../EnterKeyNode.js';
import EscapeKeyNode from '../EscapeKeyNode.js';
import LetterKeyNode from '../LetterKeyNode.js';
import PageDownKeyNode from '../PageDownKeyNode.js';
import PageUpKeyNode from '../PageUpKeyNode.js';
import ShiftKeyNode from '../ShiftKeyNode.js';
import SpaceKeyNode from '../SpaceKeyNode.js';

const keyboardHelpDialogOrString = sceneryPhetStrings.keyboardHelpDialog.or;

// constants
const DEFAULT_LETTER_KEY_SPACING = 1;
const DEFAULT_ICON_SPACING = 5;
const OR_TEXT_MAX_WIDTH = 12;
const LABEL_FONT = new PhetFont( 12 );

class KeyboardHelpIconFactory {
  constructor() {
    assert && assert( false, 'do not construct this, instead use its helper static methods for icon creation' );
  }

  /**
   * Get two icons horizontally aligned and separated by 'or' text.
   *
   * @param {Node} iconA - to the left of 'or' text
   * @param {Node} iconB - to the right of 'or' text
   * @param {Object} [options]
   *
   * @returns {HBox}
   */
  static iconOrIcon( iconA, iconB, options ) {

    options = merge( {
      spacing: DEFAULT_ICON_SPACING
    }, options );
    assert && assert( !options.children );

    const orText = new Text( keyboardHelpDialogOrString, {
      font: LABEL_FONT,
      maxWidth: OR_TEXT_MAX_WIDTH
    } );

    options.children = [ iconA, orText, iconB ];
    return new HBox( options );
  }

  /**
   * Get two icons horizontally aligned and separated by '+' text.
   *
   * @param {Node} iconA - to the left of '+' text
   * @param {Node} iconB - to the right of '+' text
   * @param {Object} [options]
   *
   * @returns {HBox}
   */
  static iconPlusIcon( iconA, iconB, options ) {

    options = merge( {
      spacing: DEFAULT_ICON_SPACING,

      // plus icon
      plusIconSize: new Dimension2( 8, 1.2 )
    }, options );
    assert && assert( !options.children );

    // plus icon
    const plusIconNode = new PlusNode( {
      size: options.plusIconSize
    } );

    options.children = [ iconA, plusIconNode, iconB ];
    return new HBox( options );
  }

  /**
   * Get horizontally aligned shift key icon plus another icon node. Horizontally aligned in order
   * of shift, plus icon, and desired icon.
   *
   * @param {Node} icon - icon to right of 'shift +'
   * @param {Object} [options]
   *
   * @returns {HBox}
   */
  static shiftPlusIcon( icon, options ) {

    options = merge( {
      spacing: DEFAULT_ICON_SPACING,

      // plus icon
      plusIconSize: new Dimension2( 8, 1.2 )
    }, options );
    assert && assert( !options.children );

    // shift key icon
    const shiftKeyIcon = new ShiftKeyNode();

    // plus icon
    const plusIconNode = new PlusNode( {
      size: options.plusIconSize
    } );

    options.children = [ shiftKeyIcon, plusIconNode, icon ];
    return new HBox( options );
  }

  /**
   * @public
   * @returns {EnterKeyNode}
   */
  static enter() {
    return new EnterKeyNode();
  }

  /**
   * "Space or Enter" icon
   * @public
   * @returns {Node}
   */
  static spaceOrEnter() {
    return KeyboardHelpIconFactory.iconOrIcon( new SpaceKeyNode(), new EnterKeyNode() );
  }

  /**
   * "Up or down" icon
   * @public
   * @returns {Node}
   */
  static upOrDown() {
    return KeyboardHelpIconFactory.iconOrIcon( new ArrowKeyNode( 'up' ), new ArrowKeyNode( 'down' ) );
  }

  /**
   * @public
   * @returns {EscapeKeyNode}
   */
  static esc() {
    return new EscapeKeyNode();
  }

  /**
   * An icon containing icons for the up and down arrow keys aligned horizontally.
   *
   * @param {Object} [options]
   * @returns {HBox}
   */
  static wasdRowIcon( options ) {
    options = merge( {
      spacing: DEFAULT_LETTER_KEY_SPACING
    }, options );

    assert && assert( !options.children, 'children cannot be passed to options' );

    // These are not translated because they map directly to specific key codes.
    const wKeyNode = new LetterKeyNode( 'W' );
    const aKeyNode = new LetterKeyNode( 'A' );
    const sKeyNode = new LetterKeyNode( 'S' );
    const dKeyNode = new LetterKeyNode( 'D' );

    options.children = [ wKeyNode, aKeyNode, sKeyNode, dKeyNode ];
    return new HBox( options );
  }


  /**
   * Get horizontally aligned arrow keys, all in a row including up, left, down, and right arrow keys in that order.
   *
   * @param {Object} [options]
   * @returns {HBox}
   */
  static arrowKeysRowIcon( options ) {

    options = merge( {
      spacing: DEFAULT_LETTER_KEY_SPACING
    }, options );
    assert && assert( !options.children, 'children cannot be passed to options' );

    const upArrowKeyNode = new ArrowKeyNode( 'up' );
    const leftArrowKeyNode = new ArrowKeyNode( 'left' );
    const downArrowKeyNode = new ArrowKeyNode( 'down' );
    const rightArrowKeyNode = new ArrowKeyNode( 'right' );

    options.children = [ upArrowKeyNode, leftArrowKeyNode, downArrowKeyNode, rightArrowKeyNode ];
    return new HBox( options );
  }

  /**
   * An icon containing horizontally aligned arrow keys and horizontally aligned WASD keys, separated by an "or".
   *
   * @param {Object} [options]
   * @returns {HBox}
   */
  static arrowOrWasdKeysRowIcon( options ) {
    options = merge( {
      spacing: DEFAULT_ICON_SPACING
    }, options );
    assert && assert( !options.children, 'children cannot be passed to options' );

    const arrowKeys = KeyboardHelpIconFactory.arrowKeysRowIcon();
    const wasdKeys = KeyboardHelpIconFactory.wasdRowIcon();

    return KeyboardHelpIconFactory.iconOrIcon( arrowKeys, wasdKeys, options );
  }

  /**
   * An icon containing icons for the page up/down keys aligned horizontally.
   *
   * @param  {Object} [options]
   * @returns {HBox}
   */
  static pageUpPageDownRowIcon( options ) {
    options = merge( {
      spacing: DEFAULT_ICON_SPACING
    }, options );
    assert && assert( !options.children, 'children cannot be passed to options' );

    const pageUpKeyNode = new PageUpKeyNode();
    const pageDownKeyNode = new PageDownKeyNode();

    options.children = [ pageUpKeyNode, pageDownKeyNode ];

    return new HBox( options );
  }


  /**
   * An icon containing the icons two arrow keys,  aligned horizontally.
   *
   * @param {string} firstKeyName
   * @param {string} secondKeyName
   * @param {Object} [options]
   * @returns {HBox}
   * @private
   */
  static createTwoArrowKeysIcon( firstKeyName, secondKeyName, options ) {
    options = merge( {
      spacing: DEFAULT_LETTER_KEY_SPACING
    }, options );
    assert && assert( !options.children, 'children cannot be passed to options' );

    const upArrowKeyNode = new ArrowKeyNode( firstKeyName );
    const rightArrowKeyNode = new ArrowKeyNode( secondKeyName );

    options.children = [ upArrowKeyNode, rightArrowKeyNode ];
    return new HBox( options );
  }


  /**
   * An icon containing icons for the up and down arrow keys aligned horizontally.
   *
   * @param {Object} [options]
   * @returns {HBox}
   */
  static upDownArrowKeysRowIcon( options ) {
    return KeyboardHelpIconFactory.createTwoArrowKeysIcon( 'up', 'down', options );
  }

  /**
   * An icon containing the icons for the left and right arrow keys,  aligned horizontally.
   *
   * @param {Object} [options]
   * @returns {HBox}
   */
  static leftRightArrowKeysRowIcon( options ) {
    return KeyboardHelpIconFactory.createTwoArrowKeysIcon( 'left', 'right', options );
  }
}

// @public (read-only)
KeyboardHelpIconFactory.DEFAULT_ICON_SPACING = DEFAULT_ICON_SPACING;

assert && assert( Object.keys( KeyboardHelpIconFactory.prototype ).length === 0,
  'KeyboardHelpIconFactory only has static functions' );

sceneryPhet.register( 'KeyboardHelpIconFactory', KeyboardHelpIconFactory );

export default KeyboardHelpIconFactory;