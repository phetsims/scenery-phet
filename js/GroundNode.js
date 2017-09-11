// Copyright 2014-2017, University of Colorado Boulder

/**
 * Node that, when parameterized correctly, can be used to represent the
 * ground in a simulation screen.
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
   * @param {number} gradientEndDepth
   * @param {Object} [options]
   * @constructor
   */
  function GroundNode( x, y, width, height, gradientEndDepth, options ) {
    Tandem.indicateUninstrumentedCode();
    options = _.extend(
      {
        topColor: new Color( 144, 199, 86 ),
        bottomColor: new Color( 103, 162, 87 )
      }, options );
    GradientBackgroundNode.call( this, x, y, width, height, options.topColor, options.bottomColor, y, gradientEndDepth );
  }

  sceneryPhet.register( 'GroundNode', GroundNode );

  return inherit( GradientBackgroundNode, GroundNode );
} );

