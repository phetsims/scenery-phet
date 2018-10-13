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

      // @public
      this.left = new BorderAlert( options.leftAlert );
      this.right = new BorderAlert( options.rightAlert );
      this.top = new BorderAlert( options.topAlert );
      this.bottom = new BorderAlert( options.bottomAlert );

      // @private TODO: do these need an enum?
      this.permittedBorders = [ 'left', 'right', 'top', 'bottom' ];

      // @private
      this.repeatBorderAlerts = options.repeatBorderAlerts;
      this.bounds = options.bounds; // The drag border
    }


    /**
     * If we should be looking at the edge to see if we should be repeating border alerts
     * @returns {boolean}
     */
    get isMonitoringEdge() {
      return this.left.monitoring ||
             this.right.monitoring ||
             this.top.monitoring ||
             this.bottom.monitoring;
    }

    /**
     * Returns the BorderAlert that we are monitoring.
     * NOTE: if we are monitoring more than one (in corner), it will only return the first BorderAlert
     * @returns {BorderAlert}
     * @private
     */
    get alertWeAreMonitoring() {
      if ( this.left.monitoring ) {
        return this.left;
      }
      if ( this.right.monitoring ) {
        return this.right;
      }
      if ( this.top.monitoring ) {
        return this.top;
      }
      if ( this.bottom.monitoring ) {
        return this.bottom;
      }
      assert && assert( false, 'you probably did not want to call this method right now' );
    }


    /**
     * Based on a position and the border bounds, if the position is touching the bounds, then monitor that border for
     * an alert on drag.
     * @param {Vector2} position
     */
    startBorderAlertMonitoring( position ) {
      var alertDirection;

      // at left now, but wasn't last location
      if ( position.x === this.bounds.left ) {
        alertDirection = 'left';
      }

      // at right now, but wasn't last location
      if ( position.x === this.bounds.right ) {
        alertDirection = 'right';
      }

      // at top now, but wasn't last location
      if ( position.y === this.bounds.top ) {
        alertDirection = 'top';
      }

      // at bottom now, but wasn't last location
      if ( position.y === this.bounds.bottom ) {
        alertDirection = 'bottom';
      }

      // Then we are potentially going to monitor/alert
      if ( alertDirection ) {
        assert && assert( this.permittedBorders.indexOf( alertDirection ) >= 0 );

        var borderAlert = this[ alertDirection ];
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
      this.left.monitoring = false;
      this.right.monitoring = false;
      this.top.monitoring = false;
      this.bottom.monitoring = false;
    }

    /**
     * @public
     * @param {Vector2} location
     */
    startDrag( location ) {
      this.startBorderAlertMonitoring( location );
    }

    /**
     * @public
     */
    drag() {
      if ( this.isMonitoringEdge && this.repeatBorderAlerts ) {
        var borderAlert = this.alertWeAreMonitoring;

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
      this.left.reset();
      this.right.reset();
      this.top.reset();
      this.bottom.reset();
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
      var alert = this._alert;
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