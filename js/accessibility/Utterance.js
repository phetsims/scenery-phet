// Copyright 2017-2019, University of Colorado Boulder

/**
 * An utterance to be handed off to the AlertQueue, which manages the order of accessibility alerts
 * read by a screen reader.
 *
 * An utterance to be provided to the AlertQueue. An utterance can be one of AlertableDef or an array of items
 * that conform to AlertableDef. If using an array, alertables in the array will be anounced in order (one at a time)
 * each time this utterances is added to the utteranceQueue.
 *
 * A single Utterance can be added to the utteranceQueue multiple times. This may be so that a
 * number of alerts associated with the utterance get read in order (see alert in options). Or it
 * may be that changes are being alerted rapidly from the same source. An Utterance is considered
 * "unstable" if it is being added rapidly to the utteranceQueue. By default, utterances are only
 * announced when they are "stable", and stop getting added to the queue. This will prevent
 * a large number of alerts from the same interaction from spamming the user. See related options alertStableDelay,
 * and alertMaximumDelay.
 *
 * @author Jesse Greenberg
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const merge = require( 'PHET_CORE/merge' );
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  const validate = require( 'AXON/validate' );

  // constants
  // {string|Array.<string>}
  const ALERT_VALIDATOR = {
    isValidValue: v => typeof v === 'string' ||
                       ( Array.isArray( v ) && _.every( v, item => typeof item === 'string' ) )
  };

  class Utterance {

    /**
     * @param {Object} options
     */
    constructor( options ) {
      options = merge( {

        /**
         * The content of the alert that this Utterance is wrapping. If it is an array, then the Utterance will
         * keep track of number of times that the Utterance has been alerted, and choose from the list "accordingly" see
         * loopingSchema for more details
         * {string|Array.<string>}
         */
        alert: null,

        // if true, then the alert must be of type {Array.<string>}, and alerting will cycle through each alert, and then wrap back
        // to the beginning when complete. The default behavior (loopAlerts:false) is to repeat the last alert in the array until reset.
        loopAlerts: false,

        // @returns {boolean} - if predicate returns false, the alert content associated
        // with this utterance will not be announced by a screen reader
        predicate: function() { return true; },

        // {number} - in ms, how long to wait before the utterance is considered "stable" and stops being
        // added to the queue, at which point it will be spoken. Default value chosen because
        // it sounds nice in most usages of Utterance with alertStableDelay. If you want to hear the utterance as fast
        // as possible, reduce this delay to 0. See https://github.com/phetsims/scenery-phet/issues/491
        alertStableDelay: 200,

        // {number} - if specified, the utterance will be spoken at least this frequently in ms
        // even if the utterance is continuously added to the queue and never becomes "stable"
        alertMaximumDelay: Number.MAX_VALUE
      }, options );

      assert && assert( typeof options.loopAlerts === 'boolean' );
      assert && assert( typeof options.predicate === 'function' );
      assert && assert( typeof options.alertStableDelay === 'number' );
      assert && assert( typeof options.alertMaximumDelay === 'number' );
      assert && options.alert && assert( typeof options.alert === 'string' || Array.isArray( options.alert ) );
      assert && options.alert && options.loopAlerts && assert( Array.isArray( options.alert ),
        'if loopAlerts is provided, options.alert must be an array' );

      // @private
      this._alert = options.alert;
      this.numberOfTimesAlerted = 0; // keep track of the number of times alerted, this will dictate which alert to call.
      this.loopAlerts = options.loopAlerts;

      // @public (read-only, scenery-phet-internal)
      this.predicate = options.predicate;

      // @public {number} (scenery-phet-internal) - In ms, how long this utterance has been in the queue. The
      // same Utterance can be in the queue more than once (for utterance looping or while the utterance stabilizes),
      // in this case the time will be since the first time the utterance was added to the queue.
      this.timeInQueue = 0;

      // @public (scenery-phet-internal) {number}  - in ms, how long this utterance has been "stable", which
      // is the amount of time since this utterance has been added to the utteranceQueue.
      this.stableTime = 0;

      // @public (read-only, scenery-phet-internal) {number} - In ms, how long the utterance should remain in the queue
      // before it is read. The queue is cleared in FIFO order, but utterances are skipped until the delay time is less
      // than the amount of time the utterance has been in the queue
      this.alertStableDelay = options.alertStableDelay;

      // @public {scenery-phet-internal, read-only} {number}- in ms, the maximum amount of time that should
      // pass before this alert should be spoken, even if the utterance is rapidly added to the queue
      // and is not quite "stable"
      this.alertMaximumDelay = options.alertMaximumDelay;
    }

    /**
     * Getter for the text to be alerted for this Utterance. This should only be called when the alert is about to occur
     * because Utterance updates the number of times it has alerted based on this function, see this.numberOfTimesAlerted
     * @returns {string}
     * @public (UtteranceQueue only)
     */
    getTextToAlert() {
      let alert;
      if ( typeof this._alert === 'string' ) {
        alert = this._alert;
      }
      else if ( this.loopAlerts ) {
        alert = this._alert[ this.numberOfTimesAlerted % this._alert.length ];
      }
      else {
        assert && assert( Array.isArray( this._alert ) ); // sanity check
        const currentAlertIndex = Math.min( this.numberOfTimesAlerted, this._alert.length - 1 );
        alert = this._alert[ currentAlertIndex ];
      }
      this.numberOfTimesAlerted++;
      return alert;
    }

    /**
     * Set the alert for the utterance
     * @param {string|Array.<string>} alert
     * @public
     */
    set alert( alert ) {
      validate( alert, ALERT_VALIDATOR );

      this._alert = alert;
    }

    /**
     * @public
     * @returns {null|string|Array.<string>}
     */
    get alert() {
      return this._alert;
    }

    /**
     * Set the alertStableDelay time, see alertStableDelay option for more information.
     *
     * BEWARE! Why does the delay time need to be changed during the lifetime of an Utterance? It did for
     * https://github.com/phetsims/gravity-force-lab-basics/issues/146, but does it for you? Be sure there is good
     * reason changing this value.
     * @param {number} delay
     */
    setAlertStableDelay( delay ) {
      this.alertStableDelay = delay;
    }

    /**
     * Reset variables that track instance variables related to time.
     * @returns {}
     */
    resetTimingVariables() {
      this.timeInQueue = 0;
      this.stableTime = 0;
    }

    /**
     * @public
     */
    reset() {
      this.numberOfTimesAlerted = 0;
      this.resetTimingVariables();
    }
  }

  return sceneryPhet.register( 'Utterance', Utterance );
} );
