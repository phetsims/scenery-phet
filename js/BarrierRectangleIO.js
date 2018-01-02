// Copyright 2017, University of Colorado Boulder

/**
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var NodeIO = require( 'SCENERY/nodes/NodeIO' );

  // phet-io modules
  var assertInstanceOf = require( 'ifphetio!PHET_IO/assertInstanceOf' );
  var phetioInherit = require( 'ifphetio!PHET_IO/phetioInherit' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );

  /**
   * @param {BarrierRectangle} barrierRectangle
   * @param {string} phetioID
   * @constructor
   */
  function BarrierRectangleIO( barrierRectangle, phetioID ) {
    assert && assertInstanceOf( barrierRectangle, phet.sceneryPhet.BarrierRectangle );
    NodeIO.call( this, barrierRectangle, phetioID );
  }

  phetioInherit( NodeIO, 'BarrierRectangleIO', BarrierRectangleIO, {}, {
    documentation: 'Shown when a dialog is present, so that clicking on the invisible barrier rectangle will dismiss the dialog',
    events: [ 'fired' ]
  } );

  sceneryPhet.register( 'BarrierRectangleIO', BarrierRectangleIO );

  return BarrierRectangleIO;
} );

