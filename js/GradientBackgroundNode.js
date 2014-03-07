// Copyright 2002-2013, University of Colorado Boulder

/**
 * Base type for nodes that are used as the background on a tab and that have
 * some sort of gradient to it.  Example include ground and sky.
 *
 * @author John Blanco
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // imports
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  /**
   * @param mvt
   * @param modelRect
   * @param color1
   * @param color2
   * @param y1
   * @param y2
   * @constructor
   */
  function GradientBackgroundNode( mvt, modelRect, color1, color2, y1, y2 ) {
    Node.call( this );
    var viewShape = mvt.modelToViewShape( modelRect );
    var centerX = viewShape.getCenterX();
    var gradient = new LinearGradient( centerX, mvt.modelToViewY( y1 ), centerX, mvt.modelToViewY( y2 ) );
    gradient.addColorStop( 0, color1 );
    gradient.addColorStop( 1, color2 );
    this.addChild( new Rectangle( viewShape.minX, viewShape.minY, viewShape.width, viewShape.height, 0, 0,
      {
        fill: gradient
      } ) );
  }

  return inherit( Node, GradientBackgroundNode );
} );