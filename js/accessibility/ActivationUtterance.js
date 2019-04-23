// Copyright 2019, University of Colorado Boulder

/**
 * An utterance that should generally be used for announcing a change after an "activation" interaction such
 * as clicking a button or a checkbox. The delay for waiting for utterance stability is chosen such that the alert won't
 * become stable and be spoken faster than the press and hold delay for continuous clicking with the "enter" key. See
 * Utterance.js for a description of utterance "stability". The result is that pressing and holding "enter" on a
 * button will result in only a single utterance. 
 * 
 * @author Jesse Greenberg
 */
define( require => {
  'use strict';

  // modules
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  const Utterance = require( 'SCENERY_PHET/accessibility/Utterance' );

  class ActivationUtterance extends Utterance {

    /**
     * @param {Object} options
     */
    constructor( options ) {

      options = _.extend( {

        // {number} - in ms, should be larger than 500, prevents the utterance from being duplicated within the delay
        // of press and hold for most typical user settings
        alertStableDelay: 500
      }, options );

      assert && assert( options.alertStableDelay >= 500, 'Utterance will likely be duplicated if activated with key press and hold' );

      // wait until this Utterance related to activation stops being added to the queue to be spoken
      assert && assert( options.alertStable === undefined, 'ActivationUtterance sets alertStable' );
      options.alertStable = true;

      super( options );
    }
  }

  return sceneryPhet.register( 'ActivationUtterance', ActivationUtterance );
} );
