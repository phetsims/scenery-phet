// Copyright 2017, University of Colorado Boulder

/**
 * An utterance to be provided to the AlertQueue.  
 * 
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );

  var alertTypeId = 1;

  /**
   * An utterance to be handed off to the AlertQueue, which manages the order of accessibility alerts
   * read by a screen reader.
   * 
   * @param {string} text   
   * @param {Object} options
   */
  function Utterance( text, options ) {

    options = _.extend( {

      // @returns {boolean} - if predicate returns false, the alert content associated
      // with this utterance will not be announced by a screen reader
      predicate: function() { return true; },

      // {number|string|null} - if more than one Utterance of the same typeId is added to the queue, only 
      // the older Utterance of the same typeId will be automatically removed
      typeId: null,

      // {number} - if provided, this utterance won't be spoken until it has been in the queue for at least this long.
      // But beware! The queue will otherwise still prioritize items in FIFO, so the utterance could sit in the 
      // queue for longer than this amount.
      delayTime: 0
    }, options );

    // @public (read-only, scenery-phet-internal)
    this.predicate = options.predicate;
    this.text = text;
    this.typeId = options.typeId;

    // @public {number} (scenery-phet-internal) - In ms, how long this utterance has been in the queue in ms. Useful
    // for doing things like determining if an utterance is stale by time, or adding a delay before the utterance
    // should be read.
    this.timeInQueue = 0;

    // @public {number} (scenery-phet-internal) - In ms, how long the utterance should remain in the queue before it
    // is read. The queue is cleared in FIFO order, but utterances are skipped until the delay time is less than the
    // amount of time the utterance has been in the queue
    this.delayTime = options.delayTime;
  }

  sceneryPhet.register( 'Utterance', Utterance );

  return inherit( Object, Utterance, {}, {

    /**
     * Get the next type for alerts - if an utterance is added to the queue that is the same
     * type as others, it will replace them. Any string or number can be used, but using this
     * makes things less error prone.
     * @return {number}
     */
    getNextTypeId: function() {
      return alertTypeId++;
    }
  } );
} );
