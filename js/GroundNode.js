// Copyright 2002-2013, University of Colorado Boulder

/**
 * Node that, when parameterized correctly, can be used to represent the
 * ground in a simulation screen.
 *
 * @author John Blanco
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // Imports
  var inherit = require( 'PHET_CORE/inherit' );
  var GradientBackgroundNode = require( 'SCENERY_PHET/GradientBackgroundNode' );
  var Color = require( 'SCENERY/util/Color' );

  /**
   * @param x
   * @param y
   * @param width
   * @param height
   * @param gradientEndDepth
   * @param {Object} [options]
   * @constructor
   */
  function GroundNode( x, y, width, height, gradientEndDepth, options ) {
    options = _.extend(
      {
        topColor: new Color( 144, 199, 86 ),
        bottomColor: new Color( 103, 162, 87 )
      }, options );
    GradientBackgroundNode.call( this, x, y, width, height, options.topColor, options.bottomColor, y, gradientEndDepth );
  }

  return inherit( GradientBackgroundNode, GroundNode );
} );

