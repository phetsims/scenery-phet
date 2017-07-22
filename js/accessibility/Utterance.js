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
      typeId: null
    }, options );

    // @public (read-only, scenery-phet-internal)
    this.predicate = options.predicate;
    this.text = text;
    this.typeId = options.typeId;
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
