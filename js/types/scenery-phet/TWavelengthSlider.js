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

  function TWavelengthSlider( slider, phetioID ) {
    TNode.call( this, slider, phetioID );
    assertInstanceOf( slider, phet.sceneryPhet.WavelengthSlider );
  }

  phetioInherit( TNode, 'TWavelengthSlider', TWavelengthSlider, {}, {
    documentation: 'A slider that shows wavelengths for selection'
  } );

  phetioNamespace.register( 'TWavelengthSlider', TWavelengthSlider );

  return TWavelengthSlider;
} );

