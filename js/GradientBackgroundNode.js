// Copyright 2014-2017, University of Colorado Boulder

/**
 * Base type for nodes that are used as the background on a tab and that have
 * some sort of gradient to it.  Example include ground and sky.
 *
 * @author John Blanco
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var Tandem = require( 'TANDEM/Tandem' );

  /**
   *
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {number} height
   * @param {string||Color} color1
   * @param {string||Color} color2
   * @param {number} y1
   * @param {number} y2
   * @constructor
   */
  function GradientBackgroundNode( x, y, width, height, color1, color2, y1, y2 ) {
    Tandem.indicateUninstrumentedCode();
    var centerX = x + width / 2;
    var gradient = new LinearGradient( centerX, y1, centerX, y2 );
    gradient.addColorStop( 0, color1 );
    gradient.addColorStop( 1, color2 );
    Rectangle.call( this, x, y, width, height, 0, 0, { fill: gradient } );
  }

  sceneryPhet.register( 'GradientBackgroundNode', GradientBackgroundNode );

  return inherit( Rectangle, GradientBackgroundNode );
} );