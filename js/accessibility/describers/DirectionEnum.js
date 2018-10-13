// Copyright 2018, University of Colorado Boulder

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
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );

  var DirectionEnum = {
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
   * @return {boolean}
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

  // verify that enum is immutable, without the runtime penalty in production code
  if ( assert ) { Object.freeze( DirectionEnum ); }

  sceneryPhet.register( 'DirectionEnum', DirectionEnum );

  return DirectionEnum;
} );
