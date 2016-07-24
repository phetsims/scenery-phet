// Copyright 2016, University of Colorado Boulder

/**
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare
 */
define( function( require ) {
  'use strict';

  // modules
  var assertInstanceOf = require( 'PHET_IO/assertions/assertInstanceOf' );
  var phetioInherit = require( 'PHET_IO/phetioInherit' );
  var phetioNamespace = require( 'PHET_IO/phetioNamespace' );
  var TNode = require( 'PHET_IO/types/scenery/nodes/TNode' );

  var TNumberControl = phetioInherit( TNode, 'TNumberControl', function( numberControl, phetioID ) {
    TNode.call( this, numberControl, phetioID );
    assertInstanceOf( numberControl, phet.sceneryPhet.NumberControl );
  }, {}, {
    documentation: 'A number control with a title, slider and +/- buttons'
  } );

  phetioNamespace.register( 'TNumberControl', TNumberControl );

  return TNumberControl;
} );