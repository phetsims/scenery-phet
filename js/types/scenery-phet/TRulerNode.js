// Copyright 2016, University of Colorado Boulder

/**
 * wrapper type for RulerNode
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var assertInstanceOf = require( 'PHET_IO/assertions/assertInstanceOf' );
  var phetioInherit = require( 'PHET_IO/phetioInherit' );
  var phetioNamespace = require( 'PHET_IO/phetioNamespace' );
  var TNode = require( 'PHET_IO/types/scenery/nodes/TNode' );

  /**
   * @param {RulerNode} rulerNode
   * @param {string} phetioID
   * @constructor
   */
  function TRulerNode( rulerNode, phetioID ) {
    TNode.call( this, rulerNode, phetioID );
    assertInstanceOf( rulerNode, phet.sceneryPhet.RulerNode );
  }

  phetioInherit( TNode, 'TRulerNode', TRulerNode, {}, {
    documentation: 'A node with the visual appearance of a ruler'
  } );

  phetioNamespace.register( 'TRulerNode', TRulerNode );

  return TRulerNode;
} );

