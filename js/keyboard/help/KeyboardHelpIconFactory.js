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
  const KeyboardHelpSection = require( 'SCENERY_PHET/keyboard/help/KeyboardHelpSection' );
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  const SpaceKeyNode = require( 'SCENERY_PHET/keyboard/SpaceKeyNode' );

  class KeyboardHelpIconFactory {
    constructor() {
      assert && assert( false, 'do not construct this, instead use its helper static methods for icon creation' );
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
      return KeyboardHelpSection.iconOrIcon( new EnterKeyNode(), new SpaceKeyNode() );
    }

    /**
     * "Up or down" icon
     * @public
     * @returns {Node}
     */
    static upOrDown() {
      return KeyboardHelpSection.iconOrIcon( new ArrowKeyNode( 'up' ), new ArrowKeyNode( 'down' ) );
    }

    /**
     * @public
     * @returns {EscapeKeyNode}
     */
    static esc() {
      return new EscapeKeyNode();
    }
  }

  sceneryPhet.register( 'KeyboardHelpIconFactory', KeyboardHelpIconFactory );

  return KeyboardHelpIconFactory;
} );
