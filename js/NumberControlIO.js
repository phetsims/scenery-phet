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
   * @param {NumberControl} numberControl
   * @param {string} phetioID
   * @constructor
   */
  function NumberControlIO( numberControl, phetioID ) {
    assert && assertInstanceOf( numberControl, phet.sceneryPhet.NumberControl );
    NodeIO.call( this, numberControl, phetioID );
  }

  phetioInherit( NodeIO, 'NumberControlIO', NumberControlIO, {}, {
    documentation: 'A number control with a title, slider and +/- buttons'
  } );

  sceneryPhet.register( 'NumberControlIO', NumberControlIO );

  return NumberControlIO;
} );