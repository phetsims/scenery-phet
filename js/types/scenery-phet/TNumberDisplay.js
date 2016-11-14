// Copyright 2016, University of Colorado Boulder

/**
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var assertInstanceOf = require( 'PHET_IO/assertions/assertInstanceOf' );
  var phetioInherit = require( 'PHET_IO/phetioInherit' );
  var phetioNamespace = require( 'PHET_IO/phetioNamespace' );
  var TNode = require( 'PHET_IO/types/scenery/nodes/TNode' );

  /**
   * Wrapper type for phet/scenery-phet's NumberDisplay class.
   * @param numberControl
   * @param phetioID
   * @constructor
   */
  function TNumberDisplay( numberControl, phetioID ) {
    TNode.call( this, numberControl, phetioID );
    assertInstanceOf( numberControl, phet.sceneryPhet.NumberDisplay );
  }

  phetioInherit( TNode, 'TNumberControl', TNumberDisplay, {}, {
    documentation: 'A numeric readout with a background'
  } );

  phetioNamespace.register( 'TNumberDisplay', TNumberDisplay );

  return TNumberDisplay;
} );