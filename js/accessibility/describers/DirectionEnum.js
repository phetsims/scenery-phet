// Copyright 2018-2019, University of Colorado Boulder

/**
 * Possible directions for a freely draggable item; it can move up, down, left, right,
 * and along the diagonals of these orientations.
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  const KeyboardUtil = require( 'SCENERY/accessibility/KeyboardUtil' );
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );

  // It is important that the key and value are the same, so that either way you can access the values of the enum.
  const DirectionEnum = {
    LEFT: 'LEFT',
    RIGHT: 'RIGHT',
    UP: 'UP',
    DOWN: 'DOWN',
    UP_LEFT: 'UP_LEFT',
    UP_RIGHT: 'UP_RIGHT',
    DOWN_LEFT: 'DOWN_LEFT',
    DOWN_RIGHT: 'DOWN_RIGHT'
  };

  /**
   * @type {string[]} - the keys tha make up the enum
   */
  DirectionEnum.keys = Object.keys( DirectionEnum );

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
   * Support for converting a keyCode to a direction. Arrow keys and WASD will return a primary relative direction.
   * Return null if unrecognized keyCode is given.
   * @param keyCode
   * @returns {DirectionEnum|null}
   */
  DirectionEnum.keyCodeToDirection = function( keyCode ) {
    assert && assert( typeof keyCode === 'number' );

    if ( keyCode === KeyboardUtil.KEY_UP_ARROW || keyCode === KeyboardUtil.KEY_W ) {
      return DirectionEnum.UP;
    }
    if ( keyCode === KeyboardUtil.KEY_LEFT_ARROW || keyCode === KeyboardUtil.KEY_A ) {
      return DirectionEnum.LEFT;
    }
    if ( keyCode === KeyboardUtil.KEY_DOWN_ARROW || keyCode === KeyboardUtil.KEY_S ) {
      return DirectionEnum.DOWN;
    }
    if ( keyCode === KeyboardUtil.KEY_RIGHT_ARROW || keyCode === KeyboardUtil.KEY_D ) {
      return DirectionEnum.RIGHT;
    }
    return null;
  };

  // verify that enum is immutable, without the runtime penalty in production code
  if ( assert ) { Object.freeze( DirectionEnum ); }

  sceneryPhet.register( 'DirectionEnum', DirectionEnum );

  return DirectionEnum;
} );
