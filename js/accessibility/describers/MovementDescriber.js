// Copyright 2018, University of Colorado Boulder

/**
 * A generic accessibility type that will alert positional alerts based on a locationProperty and bounds (see
 * BorderAlertsDescriber) encapsulating the draggable area.
 *
 * General usage involves calling this endDrag() function from all dragListeners that you want this functionality to describe
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const BorderAlertsDescriber = require( 'SCENERY_PHET/accessibility/describers/BorderAlertsDescriber' );
  const DirectionEnum = require( 'SCENERY_PHET/accessibility/describers/DirectionEnum' );
  const Range = require( 'DOT/Range' );
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  const SceneryPhetA11yStrings = require( 'SCENERY_PHET/SceneryPhetA11yStrings' );
  const Utterance = require( 'SCENERY_PHET/accessibility/Utterance' );
  const utteranceQueue = require( 'SCENERY_PHET/accessibility/utteranceQueue' );

  // a11y strings
  let downString = SceneryPhetA11yStrings.down.value;
  let leftString = SceneryPhetA11yStrings.left.value;
  let rightString = SceneryPhetA11yStrings.right.value;
  let upString = SceneryPhetA11yStrings.up.value;

  // constants
  // in radians - threshold for diagonal movement is +/- 15 degrees from diagonals
  let DIAGONAL_MOVEMENT_THRESHOLD = 15 * Math.PI / 180;

  // mapping from alerting direction to the radian range that fills that space in the unit circle.
  // The diagnal directions take up the middle third of each quadrant, such that each "outside" third is in the range for
  // a relative (primary) direction. Therefore each diagonal direction is 1/9 of the Unit circle, and each primary direction
  // is 2/9 of the unit circle.
  let DIRECTION_MAP = {
    UP: new Range( -3 * Math.PI / 4 + DIAGONAL_MOVEMENT_THRESHOLD, -Math.PI / 4 - DIAGONAL_MOVEMENT_THRESHOLD ),
    DOWN: new Range( Math.PI / 4 + DIAGONAL_MOVEMENT_THRESHOLD, 3 * Math.PI / 4 - DIAGONAL_MOVEMENT_THRESHOLD ),
    RIGHT: new Range( -Math.PI / 4 + DIAGONAL_MOVEMENT_THRESHOLD, Math.PI / 4 - DIAGONAL_MOVEMENT_THRESHOLD ),

    // atan2 wraps around PI, so we will use absolute value in checks
    LEFT: new Range( 3 * Math.PI / 4 + DIAGONAL_MOVEMENT_THRESHOLD, Math.PI ),

    UP_LEFT: new Range( -3 * Math.PI - DIAGONAL_MOVEMENT_THRESHOLD, -3 * Math.PI / 4 + DIAGONAL_MOVEMENT_THRESHOLD ),
    DOWN_LEFT: new Range( 3 * Math.PI / 4 - DIAGONAL_MOVEMENT_THRESHOLD, 3 * Math.PI / 4 + DIAGONAL_MOVEMENT_THRESHOLD ),
    UP_RIGHT: new Range( -Math.PI / 4 - DIAGONAL_MOVEMENT_THRESHOLD, -Math.PI / 4 + DIAGONAL_MOVEMENT_THRESHOLD ),
    DOWN_RIGHT: new Range( Math.PI / 4 - DIAGONAL_MOVEMENT_THRESHOLD, Math.PI / 4 + DIAGONAL_MOVEMENT_THRESHOLD )
  };
  let DIRECTION_MAP_KEYS = Object.keys( DIRECTION_MAP );

  let DEFAULT_MOVEMENT_ALERTS = {
    LEFT: leftString,
    RIGHT: rightString,
    UP: upString,
    DOWN: downString
  };

  /**
   * @param {Object} [options]
   * @constructor
   */
  class MovementDescriber {
    constructor( locationProperty, options ) {

      options = _.extend( {

        // see BorderAlertsDescriber
        borderAlertsOptions: null,

        // see DirectionEnum for allowed keys. Any missing keys will not be alerted. Use `{}` to omit movementAlerts
        movementAlerts: DEFAULT_MOVEMENT_ALERTS,

        // if false then diagonal alerts will be converted to two primary direction alerts that are alerted back to back
        // i.e. UP_LEFT becomes "UP" and "LEFT"
        alertDiagonal: false
      }, options );

      assert && assert( options.movementAlerts instanceof Object );
      assert && assert( !Array.isArray( options.movementAlerts ) ); // should not be an Array
      if ( assert ) {
        const movementAlertKeys = Object.keys( options.movementAlerts );

        for ( let i = 0; i < movementAlertKeys.length; i++ ) {
          let key = movementAlertKeys[ i ];
          assert( DirectionEnum.keys.indexOf( key ) >= 0, `unexpected key: ${key}. Keys should be the same as those in DirectionEnum` );
          assert( typeof options.movementAlerts[ key ] === 'string' || options.movementAlerts[ key ] instanceof Utterance );
        }
      }

      // @private
      this.movementAlerts = options.movementAlerts;
      this.alertDiagonal = options.alertDiagonal;

      // This sub-describer handles the logic for alerting when an item is on the edge of the movement space
      this.borderAlertsDescriber = new BorderAlertsDescriber( options.borderAlertsOptions );

      // @protected
      this.locationProperty = locationProperty;
      this.lastAlertedLocation = locationProperty.get(); // initial value of the locationProperty
    }

    /**
     * Simple alert for the Describer
     * @param {AlertableDef} alertable - anything that can be passed to UtteranceQueue
     */
    alert( alertable ) {
      utteranceQueue.addToBack( alertable );
      this.lastAlertedLocation = this.locationProperty.get();
    }

    /**
     * Can be called with multiple directions, or just a single direction
     * @protected
     * @param {Array.<DirectionEnum>|DirectionEnum} directions
     */
    alertDirections( directions ) {
      if ( typeof directions === 'string' ) {
        directions = [ directions ];
      }

      // support if an instance doesn't want to alert in all directions
      directions.forEach( direction => {
        this.alert( new Utterance( {
          alert: this.movementAlerts[ direction ],
          uniqueGroupId: 'directionalMovement' + direction
        } ) );
      } );
    }

    /**
     * Alert a movement direction. The direction from this.lastAlertedLocation relative to the current value of the locationProperty
     * Call this from a listener or when the locationProperty has changed enough.
     * Can be overridden. Easy to implement method with the following schema:
     * (1) get the current value of the location property, and make sure it has changed enough from the lastAlertedLocation
     * (2) get the directions from the difference,
     * (3) alert those directions by calling this.alertDirections or this.alert,
     * see friction/view/describers/BookMovementDescriber.
     *
     * NOTE: don't call UtteranceQueue from the subtype!!!
     * NOTE: PhET a11y convention suggests that this should be called on drag end.
     *
     * @public
     */
    alertDirectionalMovement() {

      let newLocation = this.locationProperty.get();
      if ( !newLocation.equals( this.lastAlertedLocation ) ) {

        let directions = this.getDirections( newLocation, this.lastAlertedLocation );

        // make sure that these alerts exist
        if ( assert ) {
          directions.map( direction => { assert( this.movementAlerts[ direction ] && typeof this.movementAlerts[ direction ] === 'string' ); } );
        }
        this.alertDirections( directions );
      }
    }

    /**
     * Get the direction of movement that would take you from point A to point B, returning one of DirectionEnum,
     * LEFT, RIGHT,  UP, DOWN,  UP_LEFT, UP_RIGHT, DOWN_LEFT, DOWN_RIGHT. Uses Math.atan2, so the angle is mapped from
     * 0 to +/- Math.PI.
     *
     * @param  {Vector2} pointA
     * @param  {Vector2} pointB
     * @returns {Array.<DirectionEnum>} - contains one or two of the values in DirectionEnum, depending on whether or no you get
     *                            diagonal directions or their composite. See options.alertDiagonal for more info
     * @static
     */
    getDirections( pointA, pointB ) {
      let direction;

      let dx = pointA.x - pointB.x;
      let dy = pointA.y - pointB.y;
      let angle = Math.atan2( dy, dx );

      // atan2 wraps around Math.PI, so special check for moving left from absolute value
      if ( DIRECTION_MAP.LEFT.contains( Math.abs( angle ) ) ) {
        direction = DirectionEnum.LEFT;
      }

      // otherwise, angle will be in one of the ranges in DIRECTION_MAP
      for ( let i = 0; i < DIRECTION_MAP_KEYS.length; i++ ) {
        let entry = DIRECTION_MAP[ DIRECTION_MAP_KEYS[ i ] ];
        if ( entry.contains( angle ) ) {
          direction = DirectionEnum[ DIRECTION_MAP_KEYS[ i ] ];
          break;
        }
      }

      // This includes complex directions like "UP_LEFT"
      if ( this.alertDiagonal ) {
        return [ direction ];
      }
      else {
        return DirectionEnum.directionToRelativeDirections( direction );
      }

    }

    /**
     * @public
     * @param {window.Event} [domEvent]
     */
    endDrag( domEvent ) {

      // better to have the movement alerts, then the alert about the border
      this.alertDirectionalMovement();
      this.borderAlertsDescriber.endDrag( this.locationProperty.get(), domEvent );
    }

    /**
     * @public
     */
    reset() {
      this.borderAlertsDescriber.reset();
    }

    /**
     * get the default movement alerts
     * @returns {{LEFT: string, RIGHT: string, UP: string, DOWN: string}}
     */
    static getDefaultMovementAlerts() {
      return _.extend( {}, DEFAULT_MOVEMENT_ALERTS ); // clone
    }
  }

  return sceneryPhet.register( 'MovementDescriber', MovementDescriber );
} );