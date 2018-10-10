// Copyright 2017, University of Colorado Boulder

/**
 * Manages a queue of Utterances that are read in order by a screen reader.  This queue typically reads
 * things in a first-in-first-out manner, but it is possible to send an alert directly to the front of
 * the queue.  Items in the queue are sent to the screen reader front to back with a certain delay interval.
 *
 * Screen readers are inconsistent in the way that they order alerts, some use last-in-first-out order,
 * others use first-in-first-out order, others just read the last alert that was provided. This queue
 * manages order and improves consistency.
 *
 * NOTE: utteranceQueue is a type but instantiated and returned as a singleton.  It is initialized by Sim.js and if
 * something adds an alert to the queue before Sim.js has initialized the queue, the result will be a silent no-op.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var AriaHerald = require( 'SCENERY_PHET/accessibility/AriaHerald' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PhetioObject = require( 'TANDEM/PhetioObject' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var Tandem = require( 'TANDEM/Tandem' );
  var timer = require( 'PHET_CORE/timer' );
  var Utterance = require( 'SCENERY_PHET/accessibility/Utterance' );
  var UtteranceQueueIO = require( 'SCENERY_PHET/accessibility/UtteranceQueueIO' );

  // {Utterance} - array of utterances, spoken in first to last order
  var queue = [];

  // the interval for sending alerts to the screen reader, in milliseconds
  var interval = 500;

  // whether or not Utterances moving through the queue are read by a screen reader
  var muted = false;

  // whether the UtterancesQueue is alerting, and if you can add/remove utterances
  var enabled = true;

  // initialization is like utteranceQueue's constructor. No-ops all around if not initialized (cheers).
  var initialized = false;

  function utteranceQueue() {

    PhetioObject.call( this ); // options will be provided in initialize (if it is ever called)
  }

  inherit( PhetioObject, utteranceQueue, {

    /**
     * Add an utterance ot the end of the queue.  If the utterance has a type of alert which
     * is already in the queue, the older alert will be immediately removed.
     *
     * @public
     * @param {Utterance|string} utterance
     */
    addToBack: function( utterance ) {
      assert && assert( utterance instanceof Utterance || typeof utterance === 'string',
        'utterance queue only supports string or type Utterance.' );

      // No-op function if the utteranceQueue is disabled
      if ( !enabled || !initialized ) {
        return;
      }

      if ( typeof utterance === 'string' ) {
        utterance = new Utterance( utterance );
      }

      // clear utterances of the same group as the one being added
      this.clearUtteranceGroup( utterance.uniqueGroupId );

      queue.push( utterance );
    },

    /**
     * Conventience function to help with nullable values
     * @param {undefined|null|Utterance|string} utterance
     */
    addToBackIfDefined: function( utterance ) {
      if ( utterance !== null && utterance !== undefined ) {
        this.addToBack( utterance );
      }
    },

    /**
     * Add an utterance to the front of the queue to be read immediately.
     * @param {Utterance|string} utterance
     */
    addToFront: function( utterance ) {
      assert && assert( utterance instanceof Utterance || typeof utterance === 'string',
        'utterance queue only supports string or type Utterance.' );

      // No-op function if the utteranceQueue is disabled
      if ( !enabled || !initialized ) {
        return;
      }

      if ( typeof utterance === 'string' ) {
        utterance = new Utterance( utterance );
      }

      // remove any utterances of the same group as the one being added
      this.clearUtteranceGroup( utterance.uniqueGroupId );

      queue.unshift( utterance );
    },


    /**
     * Conventience function to help with nullable values
     * @param {undefined|null|Utterance|string} utterance
     */
    addToFrontIfDefined: function( utterance ) {
      if ( utterance !== null && utterance !== undefined ) {
        this.addToFront( utterance );
      }
    },

    /**
     * Move to the next item in the queue. Checks the Utterance predicate first, if predicate
     * returns false, no alert will be read. Called privately by timer.setInterval
     *
     * @private
     */
    next: function() {

      // find the next item to announce - generally the next item in the queue, unless it has a delay specified that
      // is greater than the amount of time that the utterance has been sitting in the queue
      var nextUtterance;
      for ( var i = 0; i < queue.length; i++ ) {
        var utterance = queue[ i ];
        if ( utterance.timeInQueue > utterance.delayTime ) {
          nextUtterance = utterance;
          queue.splice( i, 1 );
          break;
        }
      }

      // only speak the utterance if the Utterance predicate returns true
      if ( nextUtterance && !muted && nextUtterance.predicate() ) {

        // phet-io event to the data stream
        this.phetioStartEvent( 'announced', { utterance: nextUtterance.text } );

        // Pass the utterance text on to be set in the PDOM.
        AriaHerald.announcePolite( nextUtterance.text );

        this.phetioEndEvent();
      }
    },

    /**
     * Called by addToFront and addToBack, do not call this. Clears the queue of all utterances of the specified group
     * to support the behavior of uniqueGroupId. See Utterance.uniqueGroupId for description of this feature.
     *
     * @param {string|number|null} uniqueGroupId
     * @private
     */
    clearUtteranceGroup: function( uniqueGroupId ) {

      // if there are any other items in the queue of the same type, remove them immediately because the added
      // utterance is meant to replace it
      if ( uniqueGroupId ) {
        for ( var i = queue.length - 1; i >= 0; i-- ) {
          var otherUtterance = queue[ i ];
          if ( otherUtterance.uniqueGroupId === uniqueGroupId ) {
            queue.splice( i, 1 );
          }
        }
      }
    },

    /**
     * Clear the utteranceQueue of all Utterances, any Utterances remaining in the queue will
     * not be announced by the screen reader.
     *
     * @public
     */
    clear: function() {
      queue = [];
    },

    /**
     * Set whether or not the utterance queue is muted.  When muted, Utterances will still
     * move through the queue, but nothing will be sent to assistive technology.
     *
     * @param {boolean} isMuted
     */
    setMuted: function( isMuted ) {
      muted = isMuted;
    },
    set muted( isMuted ) { this.setMuted( isMuted ); },

    /**
     * Get whether or not the utteranceQueue is muted.  When muted, Utterances will still
     * move through the queue, but nothing will be read by asistive technology.
     * @public
     */
    getMuted: function() {
      return muted;
    },
    get muted() { return this.getMuted(); },

    /**
     * Set whether or not the utterance queue is enabled.  When enabled, Utterances cannot be added to
     * the queue, and the Queue cannot be cleared. Also nothing will be sent to assistive technology.
     *
     * @param {boolean} isEnabled
     */
    setEnabled: function( isEnabled ) {
      enabled = isEnabled;
    },
    set enabled( isEnabled ) { this.setEnabled( isEnabled ); },

    /**
     * Get whether or not the utterance queue is enabled.  When enabled, Utterances cannot be added to
     * the queue, and the Queue cannot be cleared. Also nothing will be sent to assistive technology.
     * @public
     */
    getEnabled: function() {
      return enabled;
    },
    get enabled() { return this.getEnabled(); },

    /**
     * Get the interval that alerts are sent to the screen reader.
     *
     * @public
     * @return {number}
     */
    getInterval: function() {
      return interval;
    },
    get interval() { return this.getInterval(); },

    /**
     * Set the alert interval in milliseconds
     * @public
     * @param {number} alertInterval
     */
    setInterval: function( alertInterval ) {
      interval = alertInterval;
    },
    set interval( alertInterval ) { this.setInterval( alertInterval ); },

    /**
     * Basically a constructor for the queue. Setup necessary processes for running the queue and register
     * the phet-io tandem. If utteranceQueue is not initialized (say, when accessibility is not enabled), all functions
     * will be no-ops. See type documentation above for NOTE.
     * @public
     */
    initialize: function() {
      initialized = true;

      var self = this;

      // step the alert queue
      timer.setInterval( function() {

        // No-op function if the utteranceQueue is disabled
        if ( !enabled ) {
          return;
        }

        for ( var i = 0; i < queue.length; i++ ) {
          queue[ i ].timeInQueue += self.interval;
        }

        self.next();
      }, this.interval );

      // TODO: can this be moved to the constructor?
      this.initializePhetioObject( {}, {
        tandem: Tandem.rootTandem.createTandem( 'utteranceQueue' ),
        phetioType: UtteranceQueueIO,
        phetioState: false
      } );
    }
  } );

  var instance = new utteranceQueue();

  sceneryPhet.register( 'utteranceQueue', instance );

  return instance;
} );