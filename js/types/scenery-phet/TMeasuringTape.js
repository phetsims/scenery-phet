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
  var TNode = require( 'PHET_IO/api/scenery/nodes/TNode' );
  var TTandemDragHandler = require( 'PHET_IO/api/tandem/scenery/input/TTandemDragHandler' );

  var TMeasuringTape = phetioInherit( TNode, 'TMeasuringTape', function( measuringTape, phetioID ) {
    TNode.call( this, measuringTape, phetioID );
    assertInstanceOf( measuringTape, phet.sceneryPhet.MeasuringTape );
  }, {}, {
    documentation: 'A measuring tape with a draggable base and tip',
    api: {
      baseDragHandler: TTandemDragHandler,
      tipDragHandler: TTandemDragHandler
    }
  } );

  phetioNamespace.register( 'TMeasuringTape', TMeasuringTape );

  return TMeasuringTape;
} );

