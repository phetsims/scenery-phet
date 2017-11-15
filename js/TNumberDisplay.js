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
   * Wrapper type for phet/scenery-phet's NumberDisplay class.
   * @param numberControl
   * @param phetioID
   * @constructor
   */
  function TNumberDisplay( numberControl, phetioID ) {
    assert && assertInstanceOf( numberControl, phet.sceneryPhet.NumberDisplay );
    NodeIO.call( this, numberControl, phetioID );
  }

  phetioInherit( NodeIO, 'TNumberControl', TNumberDisplay, {}, {
    documentation: 'A numeric readout with a background'
  } );

  sceneryPhet.register( 'TNumberDisplay', TNumberDisplay );

  return TNumberDisplay;
} );