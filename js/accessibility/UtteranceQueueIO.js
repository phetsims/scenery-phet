// Copyright 2017-2019, University of Colorado Boulder

/**
 * IO type for UtteranceQueue
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const BooleanIO = require( 'TANDEM/types/BooleanIO' );
  const ObjectIO = require( 'TANDEM/types/ObjectIO' );
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  const StringIO = require( 'TANDEM/types/StringIO' );
  const VoidIO = require( 'TANDEM/types/VoidIO' );

  class UtteranceQueueIO extends ObjectIO {}

  UtteranceQueueIO.methods = {
    addToBack: {
      returnType: VoidIO,
      parameterTypes: [ StringIO ],
      implementation: function( textContent ) {
        return this.phetioObject.addToBack( textContent );
      },
      documentation: 'Add the utterance (string) to the end of the queue.',
      invocableForReadOnlyElements: false
    },

    addToFront: {
      returnType: VoidIO,
      parameterTypes: [ StringIO ],
      implementation: function( textContent ) {
        return this.phetioObject.addToFront( textContent );
      },
      documentation: 'Add the utterance (string) to the beginning of the queue.',
      invocableForReadOnlyElements: false
    },

    setMuted: {
      returnType: VoidIO,
      parameterTypes: [ BooleanIO ],
      implementation: function( muted ) {
        this.phetioObject.muted( muted );
      },
      documentation: 'Set whether the utteranceQueue will be muted or not. If muted, utterances still move through the ' +
                     'queue but will not be read by screen readers.',
      invocableForReadOnlyElements: false
    },
    getMuted: {
      returnType: BooleanIO,
      parameterTypes: [ VoidIO ],
      implementation: function() {
        return this.phetioObject.muted();
      },
      documentation: 'Get whether the utteranceQueue is muted. If muted, utterances still move through the ' +
                     'queue but will not be read by screen readers.'
    },
    setEnabled: {
      returnType: VoidIO,
      parameterTypes: [ BooleanIO ],
      implementation: function( enabled ) {
        this.phetioObject.enabled( enabled );
      },
      documentation: 'Set whether the utteranceQueue will be enabled or not. When enabled, Utterances cannot be added to ' +
                     'the queue, and the Queue cannot be cleared. Also nothing will be sent to assistive technology.',
      invocableForReadOnlyElements: false
    },
    getEnabled: {
      returnType: BooleanIO,
      parameterTypes: [ VoidIO ],
      implementation: function() {
        return this.phetioObject.enabled();
      },
      documentation: 'Get whether the utteranceQueue is enabled. When enabled, Utterances cannot be added to ' +
                     'the queue, and the Queue cannot be cleared. Also nothing will be sent to assistive technology.'
    }
  };

  UtteranceQueueIO.documentation = 'Manages a queue of Utterances that are read in order by a screen reader.';
  UtteranceQueueIO.events = [ 'announced' ];
  UtteranceQueueIO.validator = { valueType: Object };
  UtteranceQueueIO.typeName = 'UtteranceQueueIO';
  ObjectIO.validateSubtype( UtteranceQueueIO );

  return sceneryPhet.register( 'UtteranceQueueIO', UtteranceQueueIO );
} );