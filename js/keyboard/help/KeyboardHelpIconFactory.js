// Copyright 2019, University of Colorado Boulder

/**
 * Reusable icons to be created for keyboard help shortcuts dialogs. This type is only a collection of static methods, and
 * should not be instantiated.
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const ArrowKeyNode = require( 'SCENERY_PHET/keyboard/ArrowKeyNode' );
  const EnterKeyNode = require( 'SCENERY_PHET/keyboard/EnterKeyNode' );
  const EscapeKeyNode = require( 'SCENERY_PHET/keyboard/EscapeKeyNode' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const merge = require( 'PHET_CORE/merge' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  const SpaceKeyNode = require( 'SCENERY_PHET/keyboard/SpaceKeyNode' );
  const Text = require( 'SCENERY/nodes/Text' );

  // strings
  const keyboardHelpDialogOrString = require( 'string!SCENERY_PHET/keyboardHelpDialog.or' );

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
     * @public
     * @returns {EnterKeyNode}
     */
    static enter() {
      return new EnterKeyNode();
    }

    /**
     * "Enter or down" icon
     * @public
     * @returns {Node}
     */
    static enterOrSpace() {
      return KeyboardHelpIconFactory.iconOrIcon( new EnterKeyNode(), new SpaceKeyNode() );
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
  }

  sceneryPhet.register( 'KeyboardHelpIconFactory', KeyboardHelpIconFactory );

  return KeyboardHelpIconFactory;
} );
