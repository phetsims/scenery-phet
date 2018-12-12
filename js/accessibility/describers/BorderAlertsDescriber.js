// Copyright 2018, University of Colorado Boulder

/**
 * BorderAlertsDescriber is "sub-describer" used in MovementDescriber to manage its border alerts. Border alerts will
 * be alerted either once when object movement intersects with the bounds. With the addition of an option, the
 * border alert will be repeated for as long as the moving object is dragged against that bound, see repeatBorderAlerts.
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */
define( ( require ) => {
  'use strict';

  // modules
  const Bounds2 = require( 'DOT/Bounds2' );
  const DirectionEnum = require( 'SCENERY_PHET/accessibility/describers/DirectionEnum' );
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  const SceneryPhetA11yStrings = require( 'SCENERY_PHET/SceneryPhetA11yStrings' );
  const Util = require( 'DOT/Util' );
  const Utterance = require( 'SCENERY_PHET/accessibility/Utterance' );
  const utteranceQueue = require( 'SCENERY_PHET/accessibility/utteranceQueue' );

  // a11y strings
  const leftBorderAlertString = SceneryPhetA11yStrings.leftBorderAlert.value;
  const rightBorderAlertString = SceneryPhetA11yStrings.rightBorderAlert.value;
  const topBorderAlertString = SceneryPhetA11yStrings.topBorderAlert.value;
  const bottomBorderAlertString = SceneryPhetA11yStrings.bottomBorderAlert.value;

  const DEFAULT_TOP_BORDER_ALERT = topBorderAlertString;

  /**
   * Responsible for alerting when the temperature increases
   * @param {Object} [options]
   * @constructor
   */
  class BorderAlertsDescriber {
    constructor( options ) {

      options = _.extend( {

        // {Bounds2} - The bounds that makes the border we alert when against
        bounds: new Bounds2( Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY ),

        // {string|null|Array.<string>} left, right, top, with values to alert if you reach that bound null if you don't want it alerted.
        // If an array of string, each alert in the array will be read each new time that alert occurs. The last alert in
        // the list will be read out each subsequent time if the alert occurs more than the number of items in the list.
        leftAlert: leftBorderAlertString,
        rightAlert: rightBorderAlertString,
        topAlert: DEFAULT_TOP_BORDER_ALERT,
        bottomAlert: bottomBorderAlertString
      }, options );

      // @public - these keys should stay the same as keys from DirectionEnum
      this[ DirectionEnum.LEFT ] = new BorderAlert( options.leftAlert );
      this[ DirectionEnum.RIGHT ] = new BorderAlert( options.rightAlert );
      this[ DirectionEnum.UP ] = new BorderAlert( options.topAlert );
      this[ DirectionEnum.DOWN ] = new BorderAlert( options.bottomAlert );

      // @private
      this.bounds = options.bounds; // The drag border
    }

    /**
     * Based on a position and the border bounds, if the position is touching the bounds, then alert that we are at border.
     * By passing in an optional keyCode, you can prioritize that direction if you are at the corner.
     * TODO: don't alert perpendicular direction if you are sliding against it.
     * @param {Vector2} position
     * @param {number} [keyCode]
     */
    alertAtBorder( position, keyCode ) {
      let alertDirection;

      const bordersTouching = [];

      // at left now, but wasn't last location
      if ( position.x === this.bounds.left ) {
        bordersTouching.push( DirectionEnum.LEFT );
      }

      // at right now, but wasn't last location
      if ( position.x === this.bounds.right ) {
        bordersTouching.push( DirectionEnum.RIGHT );
      }

      // at top now, but wasn't last location
      if ( position.y === this.bounds.top ) {
        bordersTouching.push( DirectionEnum.UP );
      }

      // at bottom now, but wasn't last location
      if ( position.y === this.bounds.bottom ) {
        bordersTouching.push( DirectionEnum.DOWN );
      }

      // corner case
      if ( bordersTouching.length > 1 ) {
        keyCode = keyCode || -1;
        const possibleDirection = DirectionEnum.keyCodeToDirection( keyCode );

        // if the keyCode matches a border direction, use that instead of another wall that we may also be touching
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
        const borderAlert = this[ alertDirection ];
        assert && assert( borderAlert instanceof BorderAlert, 'sanity check' );

        borderAlert.alert();
      }
    }

    /**
     * @public
     * @param {Vector2} location
     * @param {KeyboardEvent} [domEvent] - we don'tget this from a mouse drag listener
     */
    endDrag( location, domEvent ) {
      let keyCode;
      if ( domEvent ) {
        keyCode = domEvent.keyCode;
      }
      this.alertAtBorder( location, keyCode );
    }

    /**
     * @public
     */
    reset() {
      this[ DirectionEnum.LEFT ].reset();
      this[ DirectionEnum.RIGHT ].reset();
      this[ DirectionEnum.UP ].reset();
      this[ DirectionEnum.DOWN ].reset();
    }

    /**
     * Default top alert for the border alerts
     * @returns {string}
     */
    static getDefaultTopAlert() {
      return DEFAULT_TOP_BORDER_ALERT;
    }
  }


  /**
   * Data structure type that holds structure about a single alert that happens at the border of a describer.
   * @param alert {Utterance|string|Array.<string>|null}
   */
  class BorderAlert {
    constructor( alert ) {
      assert && assert( alert instanceof Utterance || Array.isArray( alert ) || alert === null || typeof alert === 'string' );


      // @private
      // {number} - the number of times that alert has been alerted. It is assumed that every time you get an alert this is incremented
      this._numberOfTimesAlerted = 0;
      this._alert = alert; // {AlertDef|null}
    }

    /**
     * Manages all the different supported types of alert and will get the appropriate alert.
     * @private
     * @returns {string}
     */
    getAlert() {
      let alert = this._alert;
      if ( Array.isArray( alert ) ) {
        const index = Util.clamp( this._numberOfTimesAlerted, 0, alert.length - 1 );
        alert = alert[ index ];
      }
      return alert;
    }

    alert() {
      utteranceQueue.addToBackIfDefined( this.getAlert() );
      this._numberOfTimesAlerted++;
    }

    /**
     * @public
     */
    reset() {

      // If the alert is an Utterance, reset it
      this._alert && this._alert.reset && this._alert.reset();
      this._numberOfTimesAlerted = 0;
    }
  }

  sceneryPhet.register( 'BorderAlert', BorderAlert );

  return sceneryPhet.register( 'BorderAlertsDescriber', BorderAlertsDescriber );
} );