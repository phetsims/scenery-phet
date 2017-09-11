// Copyright 2014-2017, University of Colorado Boulder

/**
 * Node that can be used to represent the sky.
 *
 * @author John Blanco
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var Color = require( 'SCENERY/util/Color' );
  var GradientBackgroundNode = require( 'SCENERY_PHET/GradientBackgroundNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var Tandem = require( 'TANDEM/Tandem' );

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
    Tandem.indicateUninstrumentedCode();
    options = _.extend(
      {
        topColor: new Color( 1, 172, 228 ),
        bottomColor: new Color( 208, 236, 251 )
      }, options );
    GradientBackgroundNode.call( this, x, y, width, height, options.bottomColor, options.topColor, gradientEndHeight, y );
  }

  sceneryPhet.register( 'SkyNode', SkyNode );

  return inherit( GradientBackgroundNode, SkyNode );
} );

