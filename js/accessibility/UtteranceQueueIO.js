// Copyright 2017-2018, University of Colorado Boulder

/**
 * IO type for UtteranceQueue
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var BooleanIO = require( 'TANDEM/types/BooleanIO' );
  var ObjectIO = require( 'TANDEM/types/ObjectIO' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var StringIO = require( 'TANDEM/types/StringIO' );
  var VoidIO = require( 'TANDEM/types/VoidIO' );

  // ifphetio
  var assertInstanceOf = require( 'ifphetio!PHET_IO/assertInstanceOf' );
  var phetioInherit = require( 'ifphetio!PHET_IO/phetioInherit' );

  /**
   * IO type for phet/scenery-phet's utteranceQueue
   * @param {Object} utteranceQueue
   * @param {string} phetioID
   * @constructor
   */
  function UtteranceQueueIO( utteranceQueue, phetioID ) {
    assert && assertInstanceOf( utteranceQueue, Object );
    ObjectIO.call( this, utteranceQueue, phetioID );
  }

  phetioInherit( ObjectIO, 'UtteranceQueueIO', UtteranceQueueIO, {

    addToBack: {
      returnType: VoidIO,
      parameterTypes: [ StringIO ],
      implementation: function( textContent ) {
        return this.instance.addToBack( textContent );
      },
      documentation: 'Add the utterance (string) to the end of the queue.',
      invocableForReadOnlyInstances: false
    },

    addToFront: {
      returnType: VoidIO,
      parameterTypes: [ StringIO ],
      implementation: function( textContent ) {
        return this.instance.addToFront( textContent );
      },
      documentation: 'Add the utterance (string) to the beginning of the queue.',
      invocableForReadOnlyInstances: false
    },

    setMuted: {
      returnType: VoidIO,
      parameterTypes: [ BooleanIO ],
      implementation: function( muted ) {
        this.instance.muted( muted );
      },
      documentation: 'Set whether the utteranceQueue will be muted or not. If muted, utterances still move through the ' +
                     'queue but will not be read by screen readers.',
      invocableForReadOnlyInstances: false
    },
    getMuted: {
      returnType: BooleanIO,
      parameterTypes: [ VoidIO ],
      implementation: function() {
        return this.instance.muted();
      },
      documentation: 'Get whether the utteranceQueue is muted. If muted, utterances still move through the ' +
                     'queue but will not be read by screen readers.'
    },
    setEnabled: {
      returnType: VoidIO,
      parameterTypes: [ BooleanIO ],
      implementation: function( enabled ) {
        this.instance.enabled( enabled );
      },
      documentation: 'Set whether the utteranceQueue will be enabled or not. When enabled, Utterances cannot be added to ' +
                     'the queue, and the Queue cannot be cleared. Also nothing will be sent to assistive technology.',
      invocableForReadOnlyInstances: false
    },
    getEnabled: {
      returnType: BooleanIO,
      parameterTypes: [ VoidIO ],
      implementation: function() {
        return this.instance.enabled();
      },
      documentation: 'Get whether the utteranceQueue is enabled. When enabled, Utterances cannot be added to ' +
                     'the queue, and the Queue cannot be cleared. Also nothing will be sent to assistive technology.'
    }
  }, {
    documentation: 'Manages a queue of Utterances that are read in order by a screen reader.',
    events: [ 'announced' ]
  } );

  sceneryPhet.register( 'UtteranceQueueIO', UtteranceQueueIO );

  return UtteranceQueueIO;
} );

