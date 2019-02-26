// Copyright 2017-2018, University of Colorado Boulder

/**
 * IO type for NumberControl
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
   * IO type for phet/scenery-phet's NumberControl class.
   * @param {NumberControl} numberControl
   * @param {string} phetioID
   * @constructor
   */
  function NumberControlIO( numberControl, phetioID ) {
    NodeIO.call( this, numberControl, phetioID );
  }

  phetioInherit( NodeIO, 'NumberControlIO', NumberControlIO, {}, {
    validator: { isValidValue: v => v instanceof phet.sceneryPhet.NumberControl },
    documentation: 'A number control with a title, slider and +/- buttons'
  } );

  sceneryPhet.register( 'NumberControlIO', NumberControlIO );

  return NumberControlIO;
} );