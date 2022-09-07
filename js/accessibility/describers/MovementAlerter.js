// Copyright 2018-2022, University of Colorado Boulder

/**
 * A generic alerting type that will alert positional alerts based on a positionProperty and bounds (see
 * BorderAlertsDescriber) encapsulating the draggable area.
 *
 * This alerter supports response to description (see options.descriptionAlertNode), and voicing (see options.alertToVoicing).
 *
 * General usage involves calling this endDrag() function from all dragListeners that you want this functionality to describe
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import ResponsePacket from '../../../../utterance-queue/js/ResponsePacket.js';
import Utterance from '../../../../utterance-queue/js/Utterance.js';
import sceneryPhet from '../../sceneryPhet.js';
import SceneryPhetStrings from '../../SceneryPhetStrings.js';
import Alerter from './Alerter.js';
import BorderAlertsDescriber from './BorderAlertsDescriber.js';
import DirectionEnum from './DirectionEnum.js';

// constants
const downString = SceneryPhetStrings.a11y.movementAlerter.down;
const leftString = SceneryPhetStrings.a11y.movementAlerter.left;
const rightString = SceneryPhetStrings.a11y.movementAlerter.right;
const upString = SceneryPhetStrings.a11y.movementAlerter.up;
const upAndToTheLeftString = SceneryPhetStrings.a11y.movementAlerter.upAndToTheLeft;
const upAndToTheRightString = SceneryPhetStrings.a11y.movementAlerter.upAndToTheRight;
const downAndToTheLeftString = SceneryPhetStrings.a11y.movementAlerter.downAndToTheLeft;
const downAndToTheRightString = SceneryPhetStrings.a11y.movementAlerter.downAndToTheRight;

// in radians - threshold for diagonal movement is +/- 15 degrees from diagonals
const DIAGONAL_MOVEMENT_THRESHOLD = 15 * Math.PI / 180;

// mapping from alerting direction to the radian range that fills that space in the unit circle.
//
// 'UP' is in the bottom two quadrants and 'DOWN' is in the top two quadrants because y increases down for scenery.
//
// The diagonal directions take up the middle third of each quadrant, such that each "outside" third is in the range
// for a relative (primary) direction. Therefore each diagonal direction is 1/9 of the Unit circle, and each
// primary direction is 2/9 of the unit circle.
const DIRECTION_MAP = {
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
const DIRECTION_MAP_KEYS = Object.keys( DIRECTION_MAP );

if ( assert ) {
  DIRECTION_MAP_KEYS.forEach( direction => {
    assert( DirectionEnum.keys.indexOf( direction ) >= 0, `unexpected direction: ${direction}. Keys should be the same as those in DirectionEnum` );
  } );
}

// the set of directional alerts including cardinal and intercardinal directions
const DEFAULT_MOVEMENT_DESCRIPTIONS = {
  LEFT: leftString,
  RIGHT: rightString,
  UP: upString,
  DOWN: downString,
  UP_LEFT: upAndToTheLeftString,
  UP_RIGHT: upAndToTheRightString,
  DOWN_LEFT: downAndToTheLeftString,
  DOWN_RIGHT: downAndToTheRightString
};

class MovementAlerter extends Alerter {

  /**
   * @param {Property.<Vector2>} positionProperty - Property that drives movement, in model coordinate frame
   * @param {Object} [options]
   */
  constructor( positionProperty, options ) {

    options = merge( {

      // see BorderAlertsDescriber
      borderAlertsOptions: null,

      // {Object.<DIRECTION, TAlertable> see DirectionEnum for allowed keys. Any missing keys will not be alerted.
      // Use `{}` to omit movementAlerts.
      movementAlerts: DEFAULT_MOVEMENT_DESCRIPTIONS,

      // {ModelViewTransform2} - if provided, this will transform between the model and view coordinate frames, so
      // that movement in the view is described
      modelViewTransform: ModelViewTransform2.createIdentity(),

      // if false then diagonal alerts will be converted to two primary direction alerts that are alerted back to back
      // i.e. UP_LEFT becomes "UP" and "LEFT"
      alertDiagonal: false
    }, options );

    assert && assert( options.movementAlerts instanceof Object );
    assert && assert( !Array.isArray( options.movementAlerts ) ); // should not be an Array

    super( options );

    // @private
    this.movementAlertKeys = Object.keys( options.movementAlerts );
    if ( assert ) {

      for ( let i = 0; i < this.movementAlertKeys.length; i++ ) {
        const key = this.movementAlertKeys[ i ];
        assert( DirectionEnum.keys.indexOf( key ) >= 0, `unexpected key: ${key}. Keys should be the same as those in DirectionEnum` );
      }
    }

    // @private
    this.movementAlerts = options.movementAlerts;
    this.alertDiagonal = options.alertDiagonal;
    this.modelViewTransform = options.modelViewTransform;

    // @private
    // This sub-describer handles the logic for alerting when an item is on the edge of the movement space
    this.borderAlertsDescriber = new BorderAlertsDescriber( options.borderAlertsOptions );

    // @private {Utterance} - single utterance to describe direction changes so that when this
    // happens frequently only the last change is announced
    this.directionChangeUtterance = new Utterance( {
      alert: new ResponsePacket()
    } );

    // @private
    this.initialFirstPosition = positionProperty.get();

    // @protected
    this.positionProperty = positionProperty;
    this.lastAlertedPosition = this.initialFirstPosition; // initial value of the positionProperty
  }

  /**
   * Override to keep track of positioning between alerts
   * @public
   * @override
   *
   * @param {TAlertable} alertable - anything that can be passed to UtteranceQueue
   */
  alert( alertable ) {
    super.alert( alertable );
    this.lastAlertedPosition = this.positionProperty.get();
  }

  /**
   * Can be called with multiple directions, or just a single direction
   * @protected
   * @param {Array.<DirectionEnum>|DirectionEnum} directions
   */
  alertDirections( directions ) {
    if ( DirectionEnum.includes( directions ) ) {
      directions = [ directions ];
    }

    // support if an instance doesn't want to alert in all directions
    directions.forEach( direction => {
      this.directionChangeUtterance.alert.objectResponse = this.movementAlerts[ direction ];
      this.alert( this.directionChangeUtterance );
    } );
  }

  /**
   * Alert a movement direction. The direction from this.lastAlertedPosition relative to the current value of the positionProperty
   * Call this from a listener or when the positionProperty has changed enough.
   * Can be overridden. Easy to implement method with the following schema:
   * (1) get the current value of the position property, and make sure it has changed enough from the lastAlertedPosition
   * (2) get the directions from the difference,
   * (3) alert those directions by calling this.alertDirections or this.alert,
   * see friction/view/describers/BookMovementAlerter.
   *
   * NOTE: don't call UtteranceQueue from the subtype!!!
   * NOTE: PhET a11y convention suggests that this should be called on drag end.
   *
   * @public
   */
  alertDirectionalMovement() {

    const newPosition = this.positionProperty.get();
    if ( !newPosition.equals( this.lastAlertedPosition ) ) {

      const directions = this.getDirections( newPosition, this.lastAlertedPosition );

      // make sure that these alerts exist
      if ( assert ) {
        directions.forEach( direction => { assert( this.movementAlerts[ direction ] && typeof this.movementAlerts[ direction ] === 'string' ); } );
      }
      this.alertDirections( directions );
    }
  }

  /**
   * Get the direction of movement that would take you from point A to point B, returning one of DirectionEnum.
   * These directions are described as they appear visually, with positive y going up.
   *
   * Uses Math.atan2, so the angle is mapped from 0 to +/- Math.PI.
   *
   * @param  {Vector2} newPoint - in the model coordinate frame
   * @param  {Vector2} oldPoint - in the model coordinate frame
   * @returns {Array.<DirectionEnum>} - contains one or two of the values in DirectionEnum, depending on whether or no you get
   *                            diagonal directions or their composite. See options.alertDiagonal for more info
   * @protected
   */
  getDirections( newPoint, oldPoint ) {

    const direction = MovementAlerter.getDirectionEnumerable( newPoint, oldPoint, this.modelViewTransform );

    // This includes complex directions like "UP_LEFT"
    if ( this.alertDiagonal ) {
      return [ direction ];
    }
    else {
      return DirectionEnum.directionToRelativeDirections( direction );
    }
  }

  /**
   * Get one of DirectionEnum from a newPoint and an oldPoint that would describe the direction of movement
   * from the old point to the new point. These directions are described as they would appear visually, with
   * +y going up.
   * @private
   *
   * @param {Vector2} newPoint - in model coordinate frame
   * @param {Vector2} oldPoint - in model coordinate frame
   * @param {ModelViewTransform2} modelViewTransform
   * @returns {DirectionEnum}
   */
  static getDirectionEnumerable( newPoint, oldPoint, modelViewTransform ) {
    let direction;

    // to view coordinates to motion in the screen
    const newViewPoint = modelViewTransform.modelToViewPosition( newPoint );
    const oldViewPoint = modelViewTransform.modelToViewPosition( oldPoint );

    const dx = newViewPoint.x - oldViewPoint.x;
    const dy = newViewPoint.y - oldViewPoint.y;
    const angle = Math.atan2( dy, dx );

    // atan2 wraps around Math.PI, so special check for moving left from absolute value
    if ( DIRECTION_MAP.LEFT.contains( Math.abs( angle ) ) ) {
      direction = DirectionEnum.LEFT;
    }

    // otherwise, angle will be in one of the ranges in DIRECTION_MAP
    for ( let i = 0; i < DIRECTION_MAP_KEYS.length; i++ ) {
      const entry = DIRECTION_MAP[ DIRECTION_MAP_KEYS[ i ] ];
      if ( entry.contains( angle ) ) {
        direction = DirectionEnum[ DIRECTION_MAP_KEYS[ i ] ];
        break;
      }
    }

    return direction;
  }

  /**
   * Get a description of direction from the provided angle. This will describe the motion as it appears
   * on screen. The angle should go from 0 to 2PI. Angles in the top two quadrants are described as going 'up'.
   * Angles in bottom two quadrants are described as going 'down'. Angles in the right two quadrants are described
   * as going "right", and angles in the left two quadrants are described as going to the left.
   *
   * For now, this will always include diagonal alerts. In the future we can exclude the primary intercardinal
   * directions.
   * @public
   *
   * @param {number} angle - an angle of directional movement in the model coordinate frame
   * @param {Object} [options]
   * @returns {string}
   */
  static getDirectionDescriptionFromAngle( angle, options ) {

    options = merge( {

      // see constructor options for description
      modelViewTransform: ModelViewTransform2.createIdentity()
    }, options );

    // start and end positions to determine angle in view coordinate frame
    const modelStartPoint = new Vector2( 0, 0 );

    // trim off precision error when very close to 0 or 1 so that cardinal direction is still described
    // when off by a minuscule amount
    const dx = Utils.toFixedNumber( Math.cos( angle ), 8 );
    const dy = Utils.toFixedNumber( Math.sin( angle ), 8 );
    const modelEndPoint = new Vector2( dx, dy );

    const direction = MovementAlerter.getDirectionEnumerable( modelEndPoint, modelStartPoint, options.modelViewTransform );
    return DEFAULT_MOVEMENT_DESCRIPTIONS[ direction ];
  }

  /**
   * @public
   * @param {window.Event} [domEvent]
   */
  endDrag( domEvent ) {

    // better to have the movement alerts, then the alert about the border
    this.alertDirectionalMovement();
    const alert = this.borderAlertsDescriber.getAlertOnEndDrag( this.positionProperty.get(), domEvent );
    alert && this.alert( alert );
  }

  /**
   * @public
   */
  reset() {
    this.lastAlertedPosition = this.initialFirstPosition;

    // if any alerts are of type Utterance, reset them.
    this.movementAlertKeys.forEach( direction => {
      const alert = this.movementAlerts[ direction ];
      alert && alert.reset && alert.reset();
    } );

    this.borderAlertsDescriber.reset();
  }

  /**
   * Get the default movement descriptions
   * @returns {Object.<DirectionEnum, string>}} - not an actual DirectionEnum, but the toString() of it (as a key).
   * @public
   */
  static getDefaultMovementDescriptions() {
    return merge( {}, DEFAULT_MOVEMENT_DESCRIPTIONS ); // clone
  }
}

sceneryPhet.register( 'MovementAlerter', MovementAlerter );
export default MovementAlerter;