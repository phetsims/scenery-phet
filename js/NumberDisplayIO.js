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
  var phetioInherit = require( 'TANDEM/phetioInherit' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );

  /**
   * IO type for phet/scenery-phet's NumberDisplay class.
   * @param {NumberDisplay} numberControl
   * @param {string} phetioID
   * @constructor
   */
  function NumberDisplayIO( numberControl, phetioID ) {
    NodeIO.call( this, numberControl, phetioID );
  }

  phetioInherit( NodeIO, 'NumberControlIO', NumberDisplayIO, {}, {
    validator: { isValidValue: v => v instanceof phet.sceneryPhet.NumberDisplay },
    documentation: 'A numeric readout with a background'
  } );

  sceneryPhet.register( 'NumberDisplayIO', NumberDisplayIO );

  return NumberDisplayIO;
} );