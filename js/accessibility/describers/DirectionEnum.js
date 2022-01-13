// Copyright 2018-2022, University of Colorado Boulder

/**
 * Possible directions for a freely draggable item; it can move up, down, left, right,
 * and along the diagonals of these orientations.
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import EnumerationDeprecated from '../../../../phet-core/js/EnumerationDeprecated.js';
import { KeyboardUtils } from '../../../../scenery/js/imports.js';
import sceneryPhet from '../../sceneryPhet.js';

// It is important that the key and value are the same, so that either way you can access the values of the enum.
const DirectionEnum = EnumerationDeprecated.byKeys( [
  'LEFT',
  'RIGHT',
  'UP',
  'DOWN',
  'UP_LEFT',
  'UP_RIGHT',
  'DOWN_LEFT',
  'DOWN_RIGHT'
], {
  beforeFreeze: DirectionEnum => {
    
    /**
     * Returns true if direction is one of the primary relative directions "up", "down", "left", "right".
     *
     * @param {DirectionEnum} direction - one of DirectionEnum
     * @returns {boolean}
     */
    DirectionEnum.isRelativeDirection = function( direction ) {
      assert && assert( DirectionEnum.hasOwnProperty( direction ) );
      return direction === DirectionEnum.LEFT ||
             direction === DirectionEnum.RIGHT ||
             direction === DirectionEnum.UP ||
             direction === DirectionEnum.DOWN;
    };

    /**
     * If the direction is a complex diagonal direction, break it up into its composite pieces
     * @param {DirectionEnum} direction - one of DirectionEnum
     * @returns {Array.<DirectionEnum>}
     */
    DirectionEnum.directionToRelativeDirections = function( direction ) {
      assert && assert( DirectionEnum.hasOwnProperty( direction ) );
      return direction === DirectionEnum.UP_LEFT ? [ DirectionEnum.UP, DirectionEnum.LEFT ] :
             direction === DirectionEnum.UP_RIGHT ? [ DirectionEnum.UP, DirectionEnum.RIGHT ] :
             direction === DirectionEnum.DOWN_LEFT ? [ DirectionEnum.DOWN, DirectionEnum.LEFT ] :
             direction === DirectionEnum.DOWN_RIGHT ? [ DirectionEnum.DOWN, DirectionEnum.RIGHT ] :
               [ DirectionEnum[ direction ] ]; // primary relative direction, so return a single item in the array
    };

    /**
     * Convenience function if a horizontal direction
     * @param {DirectionEnum} direction - one of DirectionEnum
     * @returns {boolean}
     */
    DirectionEnum.isHorizontalDirection = function( direction ) {
      assert && assert( DirectionEnum.hasOwnProperty( direction ) );
      return direction === DirectionEnum.LEFT ||
             direction === DirectionEnum.RIGHT;
    };

    /**
     * Support for converting a key to a direction. Arrow keys and WASD will return a primary relative direction.
     * Return null if unrecognized key is given.
     * @param {string} key
     * @returns {DirectionEnum|null}
     */
    DirectionEnum.keyToDirection = function( key ) {
      assert && assert( typeof key === 'string' );

      if ( key === KeyboardUtils.KEY_UP_ARROW || key === KeyboardUtils.KEY_W ) {
        return DirectionEnum.UP;
      }
      if ( key === KeyboardUtils.KEY_LEFT_ARROW || key === KeyboardUtils.KEY_A ) {
        return DirectionEnum.LEFT;
      }
      if ( key === KeyboardUtils.KEY_DOWN_ARROW || key === KeyboardUtils.KEY_S ) {
        return DirectionEnum.DOWN;
      }
      if ( key === KeyboardUtils.KEY_RIGHT_ARROW || key === KeyboardUtils.KEY_D ) {
        return DirectionEnum.RIGHT;
      }
      return null;
    };
  }
} );

sceneryPhet.register( 'DirectionEnum', DirectionEnum );

export default DirectionEnum;