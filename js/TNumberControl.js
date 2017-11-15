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
   * Wrapper type for phet/scenery-phet's NumberControl class.
   * @param numberControl
   * @param phetioID
   * @constructor
   */
  function TNumberControl( numberControl, phetioID ) {
    assert && assertInstanceOf( numberControl, phet.sceneryPhet.NumberControl );
    NodeIO.call( this, numberControl, phetioID );
  }

  phetioInherit( NodeIO, 'TNumberControl', TNumberControl, {}, {
    documentation: 'A number control with a title, slider and +/- buttons'
  } );

  sceneryPhet.register( 'TNumberControl', TNumberControl );

  return TNumberControl;
} );