// Copyright 2014-2019, University of Colorado Boulder

/**
 * Node that can be used to represent the sky.
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
   * @param {number} gradientEndHeight
   * @param {Object} [options]
   * @constructor
   */
  function SkyNode( x, y, width, height, gradientEndHeight, options ) {
    options = merge(
      {
        topColor: new Color( 1, 172, 228 ),
        bottomColor: new Color( 208, 236, 251 )
      }, options );
    GradientBackgroundNode.call( this, x, y, width, height, options.bottomColor, options.topColor, gradientEndHeight, y );
  }

  sceneryPhet.register( 'SkyNode', SkyNode );

  return inherit( GradientBackgroundNode, SkyNode );
} );

