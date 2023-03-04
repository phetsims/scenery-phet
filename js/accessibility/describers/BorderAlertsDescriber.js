// Copyright 2018-2023, University of Colorado Boulder

/**
 * BorderAlertsDescriber is "sub-describer" used in MovementAlerter to manage its border alerts. Border alerts will
 * be alerted either once when object movement intersects with the bounds. With the addition of an option, the
 * border alert will be repeated for as long as the moving object is dragged against that bound, see repeatBorderAlerts.
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import merge from '../../../../phet-core/js/merge.js';
import { KeyboardUtils } from '../../../../scenery/js/imports.js';
import ResponsePacket from '../../../../utterance-queue/js/ResponsePacket.js';
import Utterance from '../../../../utterance-queue/js/Utterance.js';
import sceneryPhet from '../../sceneryPhet.js';
import SceneryPhetStrings from '../../SceneryPhetStrings.js';
import DirectionEnum from './DirectionEnum.js';

// constants
const leftBorderAlertString = SceneryPhetStrings.a11y.movementAlerter.leftBorderAlert;
const rightBorderAlertString = SceneryPhetStrings.a11y.movementAlerter.rightBorderAlert;
const topBorderAlertString = SceneryPhetStrings.a11y.movementAlerter.topBorderAlert;
const bottomBorderAlertString = SceneryPhetStrings.a11y.movementAlerter.bottomBorderAlert;

const DEFAULT_TOP_BORDER_ALERT = topBorderAlertString;

/**
 * Responsible for alerting when the temperature increases
 * @param {Object} [options]
 * @constructor
 */
class BorderAlertsDescriber {
  constructor( options ) {

    options = merge( {

      // {Property<Bounds2>} - The bounds that makes the border we alert when against
      boundsProperty: new Property( new Bounds2( Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY ) ),

      // {TAlertable} At left edge, right edge, top, and bottom with values to alert if you reach that bound.
      // Pass in null if you don't want that border alerted. By default, if these are non-Utterances, they will be wrapped
      // in utterances, and for voicing classified as "object responses", if passing in a custom utterance, it is up to
      // the client to divide into voicing response categories.
      leftAlert: leftBorderAlertString,
      rightAlert: rightBorderAlertString,
      topAlert: DEFAULT_TOP_BORDER_ALERT,
      bottomAlert: bottomBorderAlertString,

      // Applied to any Utterances created from the Alert options above. Utterances are only created to wrap the above
      // options if an Utterance is not already provided
      utteranceOptions: {}
    }, options );

    // @public (Utterance) - these keys should stay the same as keys from DirectionEnum,
    this[ DirectionEnum.LEFT ] = null;
    this[ DirectionEnum.RIGHT ] = null;
    this[ DirectionEnum.UP ] = null;
    this[ DirectionEnum.DOWN ] = null;

    this.setDirectionUtterance( options.leftAlert, DirectionEnum.LEFT, options.utteranceOptions );
    this.setDirectionUtterance( options.rightAlert, DirectionEnum.RIGHT, options.utteranceOptions );
    this.setDirectionUtterance( options.topAlert, DirectionEnum.UP, options.utteranceOptions );
    this.setDirectionUtterance( options.bottomAlert, DirectionEnum.DOWN, options.utteranceOptions );

    // @private
    this.boundsProperty = options.boundsProperty; // The drag border
  }

  /**
   * Wrap the direction property in an Utterance if not already one. Null is supported.
   * @private
   * @param {TAlertable} alert
   * @param {DirectionEnum} direction
   * @param {Object} [utteranceOptions] - if creating an Utterance, options to pass to it
   */
  setDirectionUtterance( alert, direction, utteranceOptions ) {

    // Nothing to set if null;
    if ( alert !== null ) {
      if ( alert instanceof Utterance ) {
        this[ direction ] = alert;
      }
      else {
        assert && utteranceOptions && assert( !utteranceOptions.alert, ' setDirectionUtterance sets its own alert' );
        this[ direction ] = new Utterance( merge( {
            alert: new ResponsePacket( { objectResponse: alert } ) // each alert is an object response
          }, utteranceOptions )
        );
      }
    }
  }

  /**
   * Based on a position and the border bounds, if the position is touching the bounds, then alert that we are at border.
   * By passing in an optional key, you can prioritize that direction if you are at the corner.
   * @private
   *
   * @param {Vector2} position
   * @param {string} [key] - prefer this direction key if provided
   * @returns{TAlertable} - null if there is nothing to alert
   */
  getAlertAtBorder( position, key ) {
    let alertDirection;

    const bordersTouching = [];

    // at left now, but wasn't last position
    if ( position.x === this.boundsProperty.value.left ) {
      bordersTouching.push( DirectionEnum.LEFT );
    }

    // at right now, but wasn't last position
    if ( position.x === this.boundsProperty.value.right ) {
      bordersTouching.push( DirectionEnum.RIGHT );
    }

    // at top now, but wasn't last position
    if ( position.y === this.boundsProperty.value.top ) {
      bordersTouching.push( DirectionEnum.UP );
    }

    // at bottom now, but wasn't last position
    if ( position.y === this.boundsProperty.value.bottom ) {
      bordersTouching.push( DirectionEnum.DOWN );
    }

    // corner case
    if ( bordersTouching.length > 1 ) {
      key = key || '';
      const possibleDirection = DirectionEnum.keyToDirection( key );

      // if the key matches a border direction, use that instead of another wall that we may also be touching
      if ( possibleDirection && bordersTouching.indexOf( possibleDirection ) >= 0 ) {
        alertDirection = possibleDirection;
      }
    }
    // normal single border case
    else if ( bordersTouching.length === 1 ) {
      alertDirection = bordersTouching[ 0 ];
    }

    // Then we are potentially going to alert
    if ( alertDirection ) {
      assert && assert( DirectionEnum.isRelativeDirection( alertDirection ), `unsupported direction: ${alertDirection}` );
      const utterance = this[ alertDirection ];

      // Null means unsupported direction, no alert to be had here.
      if ( utterance ) {
        return utterance;
      }
    }
    return null;
  }

  /**
   * @public
   * @param {Vector2} position
   * @param {KeyboardEvent} [domEvent] - we don't get this from a mouse drag listener
   * @returns{TAlertable} - null if there is nothing to alert
   */
  getAlertOnEndDrag( position, domEvent ) {
    let key;
    if ( domEvent ) {
      key = KeyboardUtils.getEventCode( domEvent );
    }
    return this.getAlertAtBorder( position, key );
  }

  /**
   * @public
   */
  reset() {
    this[ DirectionEnum.LEFT ] && this[ DirectionEnum.LEFT ].reset();
    this[ DirectionEnum.RIGHT ] && this[ DirectionEnum.RIGHT ].reset();
    this[ DirectionEnum.UP ] && this[ DirectionEnum.UP ].reset();
    this[ DirectionEnum.DOWN ] && this[ DirectionEnum.DOWN ].reset();
  }

  /**
   * Default top alert for the border alerts
   * @public
   *
   * @returns {string}
   */
  static getDefaultTopAlert() {
    return DEFAULT_TOP_BORDER_ALERT;
  }
}

sceneryPhet.register( 'BorderAlertsDescriber', BorderAlertsDescriber );
export default BorderAlertsDescriber;