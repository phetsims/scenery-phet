// Copyright 2018-2021, University of Colorado Boulder

/**
 * BorderAlertsDescriber is "sub-describer" used in MovementDescriber to manage its border alerts. Border alerts will
 * be alerted either once when object movement intersects with the bounds. With the addition of an option, the
 * border alert will be repeated for as long as the moving object is dragged against that bound, see repeatBorderAlerts.
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import merge from '../../../../phet-core/js/merge.js';
import KeyboardUtils from '../../../../scenery/js/accessibility/KeyboardUtils.js';
import Utterance from '../../../../utterance-queue/js/Utterance.js';
import sceneryPhet from '../../sceneryPhet.js';
import sceneryPhetStrings from '../../sceneryPhetStrings.js';
import DirectionEnum from './DirectionEnum.js';

// constants
const leftBorderAlertString = sceneryPhetStrings.a11y.movementDescriber.leftBorderAlert;
const rightBorderAlertString = sceneryPhetStrings.a11y.movementDescriber.rightBorderAlert;
const topBorderAlertString = sceneryPhetStrings.a11y.movementDescriber.topBorderAlert;
const bottomBorderAlertString = sceneryPhetStrings.a11y.movementDescriber.bottomBorderAlert;

const DEFAULT_TOP_BORDER_ALERT = topBorderAlertString;

/**
 * Responsible for alerting when the temperature increases
 * @param {Object} [options]
 * @constructor
 */
class BorderAlertsDescriber {
  constructor( options ) {

    options = merge( {

      // {Bounds2} - The bounds that makes the border we alert when against
      bounds: new Bounds2( Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY ),

      // {string|null|Array.<string>} left, right, top, with values to alert if you reach that bound null if you don't want it alerted.
      // If an array of string, each alert in the array will be read each new time that alert occurs. The last alert in
      // the list will be read out each subsequent time if the alert occurs more than the number of items in the list.
      leftAlert: leftBorderAlertString,
      rightAlert: rightBorderAlertString,
      topAlert: DEFAULT_TOP_BORDER_ALERT,
      bottomAlert: bottomBorderAlertString,

      // Applied to any Utterances created from the Alert options above. Utterances are only created to wrap the above
      // options if an Utterance is not already provided
      utteranceOptions: {
        announcerOptions: {
          cancelOther: false
        }
      }
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
    this.bounds = options.bounds; // The drag border
  }

  /**
   * Wrap the direction property in an Utterance if not already one. Null is supported.
   * @private
   * @param {AlertableDef|null} alert
   * @param {DirectionEnum} direction
   * @param {Object} [utteranceOptions] - if creating an Utterance, options to pass to it
   */
  setDirectionUtterance( alert, direction, utteranceOptions ) {

    // Nothing to set if null;
    if ( !alert === null ) {
      if ( alert instanceof Utterance ) {
        this[ direction ] = alert;
      }
      else {
        assert && utteranceOptions && assert( !utteranceOptions.alert, ' setDirectionUtterance sets its own alert' );
        this[ direction ] = new Utterance( merge( {
            alert: alert
          }, utteranceOptions )
        );
      }
    }
  }

  /**
   * Based on a position and the border bounds, if the position is touching the bounds, then alert that we are at border.
   * By passing in an optional key, you can prioritize that direction if you are at the corner.
   * TODO see https://github.com/phetsims/scenery-phet/issues/583 don't alert perpendicular direction if you are sliding against it.
   * @private
   *
   * @param {Vector2} position
   * @param {string} [key] - prefer this direction key if provided
   */
  alertAtBorder( position, key ) {
    let alertDirection;

    const bordersTouching = [];

    // at left now, but wasn't last position
    if ( position.x === this.bounds.left ) {
      bordersTouching.push( DirectionEnum.LEFT );
    }

    // at right now, but wasn't last position
    if ( position.x === this.bounds.right ) {
      bordersTouching.push( DirectionEnum.RIGHT );
    }

    // at top now, but wasn't last position
    if ( position.y === this.bounds.top ) {
      bordersTouching.push( DirectionEnum.UP );
    }

    // at bottom now, but wasn't last position
    if ( position.y === this.bounds.bottom ) {
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
        phet.joist.sim.utteranceQueue.addToBack( utterance );
      }
    }
  }

  /**
   * @public
   * @param {Vector2} position
   * @param {KeyboardEvent} [domEvent] - we don'tget this from a mouse drag listener
   */
  endDrag( position, domEvent ) {
    let key;
    if ( domEvent ) {
      key = KeyboardUtils.getEventCode( domEvent );
    }
    this.alertAtBorder( position, key );
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