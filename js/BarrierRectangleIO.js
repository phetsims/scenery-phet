// Copyright 2017-2018, University of Colorado Boulder

/**
 * IO type for BarrierRectangle
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var NodeIO = require( 'SCENERY/nodes/NodeIO' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );

  // ifphetio
  var assertInstanceOf = require( 'ifphetio!PHET_IO/assertInstanceOf' );
  var phetioInherit = require( 'ifphetio!PHET_IO/phetioInherit' );

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
