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
  var assertInstanceOf = require( 'ifphetio!PHET_IO/assertions/assertInstanceOf' );
  var phetioInherit = require( 'ifphetio!PHET_IO/phetioInherit' );
  var TBoolean = require( 'ifphetio!PHET_IO/types/TBoolean' );
  var TString = require( 'ifphetio!PHET_IO/types/TString' );
  var TObject = require( 'ifphetio!PHET_IO/types/TObject' );
  var TVoid = require( 'ifphetio!PHET_IO/types/TVoid' );

  /**
   * Wrapper type for phet/scenery-phet's UtteranceQueue
   * @param utteranceQueue
   * @param phetioID
   * @constructor
   */
  function TUtteranceQueue( utteranceQueue, phetioID ) {
    TObject.call( this, utteranceQueue, phetioID );
    assertInstanceOf( utteranceQueue, Object );
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
      parameterTypes: [ TBoolean ],
      implementation: function( muted ) {
        this.instance.muted( muted );
      },
      documentation: 'Set whether the utteranceQueue will be muted or not. If muted utterances still move through the queue.'
    }
  }, {
    documentation: 'Manages a queue of Utterances that are read in order by a screen reader.'
  } );

  sceneryPhet.register( 'TUtteranceQueue', TUtteranceQueue );

  return TUtteranceQueue;
} );

