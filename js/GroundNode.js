// Copyright 2014-2019, University of Colorado Boulder

/**
 * Node that, when parameterized correctly, can be used to represent the
 * ground in a simulation screen.
 *
 * @author John Blanco
 * @author Sam Reid
 */
define( require => {
  'use strict';

  // modules
  const Color = require( 'SCENERY/util/Color' );
  const GradientBackgroundNode = require( 'SCENERY_PHET/GradientBackgroundNode' );
  const inherit = require( 'PHET_CORE/inherit' );
  const merge = require( 'PHET_CORE/merge' );
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );

  /**
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {number} height
   * @param {number} gradientEndDepth
   * @param {Object} [options]
   * @constructor
   */
  function GroundNode( x, y, width, height, gradientEndDepth, options ) {
    options = merge(
      {
        topColor: new Color( 144, 199, 86 ),
        bottomColor: new Color( 103, 162, 87 )
      }, options );
    GradientBackgroundNode.call( this, x, y, width, height, options.topColor, options.bottomColor, y, gradientEndDepth );
  }

  sceneryPhet.register( 'GroundNode', GroundNode );

  return inherit( GradientBackgroundNode, GroundNode );
} );

