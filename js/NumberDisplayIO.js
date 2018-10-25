// Copyright 2017-2018, University of Colorado Boulder

/**
 * IO type for NumberDisplay
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var NodeIO = require( 'SCENERY/nodes/NodeIO' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var phetioInherit = require( 'TANDEM/phetioInherit' );

  // ifphetio
  var assertInstanceOf = require( 'ifphetio!PHET_IO/assertInstanceOf' );

  /**
   * IO type for phet/scenery-phet's NumberDisplay class.
   * @param {NumberDisplay} numberControl
   * @param {string} phetioID
   * @constructor
   */
  function NumberDisplayIO( numberControl, phetioID ) {
    assert && assertInstanceOf( numberControl, phet.sceneryPhet.NumberDisplay );
    NodeIO.call( this, numberControl, phetioID );
  }

  phetioInherit( NodeIO, 'NumberControlIO', NumberDisplayIO, {}, {
    documentation: 'A numeric readout with a background'
  } );

  sceneryPhet.register( 'NumberDisplayIO', NumberDisplayIO );

  return NumberDisplayIO;
} );