// Copyright 2016, University of Colorado Boulder

/**
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var TNode = require( 'SCENERY/nodes/TNode' );

  // phet-io modules
  var assertInstanceOf = require( 'ifphetio!PHET_IO/assertions/assertInstanceOf' );
  var phetioInherit = require( 'ifphetio!PHET_IO/phetioInherit' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );

  /**
   * Wrapper type for phet/scenery-phet's WavelengthSlider class.
   * @param slider
   * @param phetioID
   * @constructor
   */
  function TWavelengthSlider( slider, phetioID ) {
    TNode.call( this, slider, phetioID );
    assertInstanceOf( slider, phet.sceneryPhet.WavelengthSlider );
  }

  phetioInherit( TNode, 'TWavelengthSlider', TWavelengthSlider, {}, {
    documentation: 'A slider that shows wavelengths for selection'
  } );

  sceneryPhet.register( 'TWavelengthSlider', TWavelengthSlider );

  return TWavelengthSlider;
} );

