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
  let leftBorderAlertString = SceneryPhetA11yStrings.leftBorderAlert.value;
  let rightBorderAlertString = SceneryPhetA11yStrings.rightBorderAlert.value;
  let topBorderAlertString = SceneryPhetA11yStrings.topBorderAlert.value;
  let bottomBorderAlertString = SceneryPhetA11yStrings.bottomBorderAlert.value;

  // constants
  let BORDER_ALERT_REPETITION_THRESHOLD = 1000;  // in ms

  let DEFAULT_TOP_BORDER_ALERT = topBorderAlertString;

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
        bottomAlert: bottomBorderAlertString,

        // Repeat a border alert if movement continues against that border, see https://github.com/phetsims/friction/issues/116#issuecomment-425501140
        repeatBorderAlerts: false
      }, options );

      // @public - these keys should stay the same as keys from DirectionEnum
      this[ DirectionEnum.LEFT ] = new BorderAlert( options.leftAlert );
      this[ DirectionEnum.RIGHT ] = new BorderAlert( options.rightAlert );
      this[ DirectionEnum.UP ] = new BorderAlert( options.topAlert );
      this[ DirectionEnum.DOWN ] = new BorderAlert( options.bottomAlert );

      // @private
      this.repeatBorderAlerts = options.repeatBorderAlerts;
      this.bounds = options.bounds; // The drag border
    }


    /**
     * If we should be looking at the edge to see if we should be repeating border alerts
     * @returns {boolean}
     */
    get isMonitoringEdge() {
      return this[ DirectionEnum.LEFT ].monitoring ||
             this[ DirectionEnum.RIGHT ].monitoring ||
             this[ DirectionEnum.UP ].monitoring ||
             this[ DirectionEnum.DOWN ].monitoring;
    }

    /**
     * Returns the BorderAlert that we are monitoring.
     * NOTE: if we are monitoring more than one (in corner), it will only return the first BorderAlert
     * @returns {BorderAlert}
     * @private
     */
    get alertWeAreMonitoring() {
      if ( this[ DirectionEnum.LEFT ].monitoring ) {
        return this[ DirectionEnum.LEFT ];
      }
      if ( this[ DirectionEnum.RIGHT ].monitoring ) {
        return this[ DirectionEnum.RIGHT ];
      }
      if ( this[ DirectionEnum.UP ].monitoring ) {
        return this[ DirectionEnum.UP ];
      }
      if ( this[ DirectionEnum.DOWN ].monitoring ) {
        return this[ DirectionEnum.DOWN ];
      }
      assert && assert( false, 'you probably did not want to call this method right now' );
    }


    /**
     * Based on a position and the border bounds, if the position is touching the bounds, then monitor that border for
     * an alert on drag.
     * @param {Vector2} position
     * @param {number} [keyCode]
     */
    startBorderAlertMonitoring( position, keyCode ) {
      let alertDirection;

      let bordersTouching = [];

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
        let possibleDirection = DirectionEnum.keyCodeToDirection( keyCode );

        // if the keyCode matches a border direction, use that instead of another wall that we may also be touching
        if ( possibleDirection && bordersTouching.indexOf( possibleDirection ) >= 0 ) {
          alertDirection = possibleDirection;
        }
      }
      // normal single border case
      else if ( bordersTouching.length === 1 ) {
        alertDirection = bordersTouching[ 0 ];
      }

      // Then we are potentially going to monitor/alert
      if ( alertDirection ) {
        assert && assert( DirectionEnum.isRelativeDirection( alertDirection ), `unsupported direction: ${alertDirection}` );
        let borderAlert = this[ alertDirection ];
        assert && assert( borderAlert instanceof BorderAlert, 'sanity check' );

        // set up monitoring if we are repeating the alert at the border
        if ( this.repeatBorderAlerts ) {
          borderAlert.monitoring = true;
        }

        // If not repeating alerts, then just alert a single time here since we won't be monitoring the drag for the alert
        else {
          borderAlert.alert();
        }
      }

      // stop all monitoring because we aren't touching any border
      else {
        this.stopMonitoring();
      }
    }

    /**
     * Stop monitoring all borders
     * @private
     */
    stopMonitoring() {
      this[ DirectionEnum.LEFT ].monitoring = false;
      this[ DirectionEnum.RIGHT ].monitoring = false;
      this[ DirectionEnum.UP ].monitoring = false;
      this[ DirectionEnum.DOWN ].monitoring = false;
    }

    /**
     * @public
     * @param {Vector2} location
     * @param {KeyboardEvent} [domEvent] - we don'tget this from a mouse drag listener
     */
    startDrag( location, domEvent ) {
      let keyCode;
      if ( domEvent ) {
        keyCode = domEvent.keyCode;
      }
      this.startBorderAlertMonitoring( location, keyCode );
    }

    /**
     * @public
     */
    drag() {
      if ( this.isMonitoringEdge && this.repeatBorderAlerts ) {
        let borderAlert = this.alertWeAreMonitoring;

        if ( phet.joist.elapsedTime - borderAlert.lastAlerted > BORDER_ALERT_REPETITION_THRESHOLD ) {
          borderAlert.alert();
        }
      }
    }

    /**
     * @public
     */
    endDrag() {
      this.stopMonitoring();
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
      this._alert = alert; // {string|null|Array.<string>}
      this._lastAlerted = null; // {null|number}

      // @public - whether or not we are monitoring this border. If we are monitoring it, then it can be repeated while dragging
      this.monitoring = false;
    }

    /**
     * Manages all the different supported types of alert and will get the appropriate alert.
     * @private
     * @returns {string}
     */
    getAlert() {
      let alert = this._alert;
      if ( Array.isArray( alert ) ) {
        let index = Util.clamp( this._numberOfTimesAlerted, 0, alert.length - 1 );
        alert = alert[ index ];
      }
      return alert;
    }

    alert() {
      utteranceQueue.addToBackIfDefined( this.getAlert() );
      this._numberOfTimesAlerted++;
      this._lastAlerted = phet.joist.elapsedTime;
    }

    /**
     * @public
     * @returns {null|number}
     */
    get lastAlerted() { return this._lastAlerted; }

    /**
     * @public
     */
    reset() {
      this._numberOfTimesAlerted = 0;
      this._lastAlerted = null;
    }
  }

  sceneryPhet.register( 'BorderAlert', BorderAlert );

  return sceneryPhet.register( 'BorderAlertsDescriber', BorderAlertsDescriber );
} );