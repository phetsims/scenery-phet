// Copyright 2016, University of Colorado Boulder

/**
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var TNode = require( 'SCENERY/nodes/TNode' );

  // phet-io modules
  var assertInstanceOf = require( 'ifphetio!PHET_IO/assertions/assertInstanceOf' );
  var phetioInherit = require( 'ifphetio!PHET_IO/phetioInherit' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var toEventOnEmit = require( 'ifphetio!PHET_IO/toEventOnEmit' );

  /**
   * Wrapper type for phet/scenery's BarrierRectangle
   * @param barrierRectangle
   * @param phetioID
   * @constructor
   */
  function TBarrierRectangle( barrierRectangle, phetioID ) {
    assertInstanceOf( barrierRectangle, phet.sceneryPhet.BarrierRectangle );
    TNode.call( this, barrierRectangle, phetioID );

    toEventOnEmit( barrierRectangle.startedCallbacksForFiredEmitter,
      barrierRectangle.endedCallbacksForFiredEmitter,
      'user',
      phetioID,
      this.constructor,
      'fired' );
  }

  phetioInherit( TNode, 'TBarrierRectangle', TBarrierRectangle, {}, {
    documentation: 'Shown when a dialog is present, so that clicking on the invisible barrier rectangle will dismiss the dialog',
    events: [ 'fired' ],
    dataStreamOnlyType: true
  } );

  sceneryPhet.register( 'TBarrierRectangle', TBarrierRectangle );

  return TBarrierRectangle;
} );

