// Copyright 2017, University of Colorado Boulder

/**
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );

  // phet-io modules
  var assertInstanceOf = require( 'ifphetio!PHET_IO/assertInstanceOf' );
  var phetioInherit = require( 'ifphetio!PHET_IO/phetioInherit' );
  var BooleanIO = require( 'ifphetio!PHET_IO/types/BooleanIO' );
  var TObject = require( 'ifphetio!PHET_IO/types/TObject' );
  var TString = require( 'ifphetio!PHET_IO/types/TString' );
  var TVoid = require( 'ifphetio!PHET_IO/types/TVoid' );

  /**
   * Wrapper type for phet/scenery-phet's UtteranceQueue
   * @param utteranceQueue
   * @param phetioID
   * @constructor
   */
  function TUtteranceQueue( utteranceQueue, phetioID ) {
    assert && assertInstanceOf( utteranceQueue, Object );
    TObject.call( this, utteranceQueue, phetioID );
  }

  phetioInherit( TObject, 'TUtteranceQueue', TUtteranceQueue, {

    addToBack: {
      returnType: TVoid,
      parameterTypes: [ TString ],
      implementation: function( textContent ) {
        return this.instance.addToBack( textContent );
      },
      documentation: 'Add the utterance (string) to the end of the queue.'
    },

    addToFront: {
      returnType: TVoid,
      parameterTypes: [ TString ],
      implementation: function( textContent ) {
        return this.instance.addToFront( textContent );
      },
      documentation: 'Add the utterance (string) to the beginning of the queue.'
    },

    setMuted: {
      returnType: TVoid,
      parameterTypes: [ BooleanIO ],
      implementation: function( muted ) {
        this.instance.muted( muted );
      },
      documentation: 'Set whether the utteranceQueue will be muted or not. If muted, utterances still move through the ' +
                     'queue but will not be read by screen readers.'
    },
    getMuted: {
      returnType: BooleanIO,
      parameterTypes: [ TVoid ],
      implementation: function() {
        return this.instance.muted();
      },
      documentation: 'Get whether the utteranceQueue is muted. If muted, utterances still move through the ' +
                     'queue but will not be read by screen readers.'
    },
    setEnabled: {
      returnType: TVoid,
      parameterTypes: [ BooleanIO ],
      implementation: function( enabled ) {
        this.instance.enabled( enabled );
      },
      documentation: 'Set whether the utteranceQueue will be enabled or not. When enabled, Utterances cannot be added to ' +
                     'the queue, and the Queue cannot be cleared. Also nothing will be sent to assistive technology.'
    },
    getEnabled: {
      returnType: BooleanIO,
      parameterTypes: [ TVoid ],
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

  sceneryPhet.register( 'TUtteranceQueue', TUtteranceQueue );

  return TUtteranceQueue;
} );

