// Copyright 2014-2019, University of Colorado Boulder

/**
 * Base type for nodes that are used as the background on a tab and that have
 * some sort of gradient to it.  Example include ground and sky.
 *
 * @author John Blanco
 * @author Sam Reid
 */
define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const LinearGradient = require( 'SCENERY/util/LinearGradient' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );

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
    var centerX = x + width / 2;
    var gradient = new LinearGradient( centerX, y1, centerX, y2 );
    gradient.addColorStop( 0, color1 );
    gradient.addColorStop( 1, color2 );
    Rectangle.call( this, x, y, width, height, 0, 0, { fill: gradient } );
  }

  sceneryPhet.register( 'GradientBackgroundNode', GradientBackgroundNode );

  return inherit( Rectangle, GradientBackgroundNode );
} );