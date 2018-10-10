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

      // {number|string|null} - Adds a signifier to the utterance that prevents too many alerts of the same type
      // spamming the queue. If more than one Utterance of the same uniqueGroupId is added to the queue, all others
      // of the same type that were previously added will be removed. If null, this feature is ignored and
      // all will  be announced.
      uniqueGroupId: null,

      // {number} - if provided, this utterance won't be spoken until it has been in the queue for at least this long.
      // But beware! The queue will otherwise still prioritize items in FIFO, so the utterance could sit in the 
      // queue for longer than this amount.
      delayTime: 0
    }, options );

    // @public (read-only, scenery-phet-internal)
    this.predicate = options.predicate;
    this.text = text;
    this.uniqueGroupId = options.uniqueGroupId;

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

  return inherit( Object, Utterance );
} );
