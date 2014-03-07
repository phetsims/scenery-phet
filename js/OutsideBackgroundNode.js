// Copyright 2002-2014, University of Colorado Boulder

/**
 * This node is intended for use as a background on a screen, and shows the
 * ground on the bottom and the sky on the top.
 * <p/>
 * This assumes that the horizon is at Y=0.
 *
 * @author John Blanco
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // Imports
  var Rectangle = require( 'DOT/Rectangle' );
  var SkyNode = require( 'SCENERY_PHET/SkyNode' );
  var GroundNode = require( 'SCENERY_PHET/GroundNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );

  /**
   * @param {ModelViewTransform2} mvt Model view transform
   * @param {number} skyGradientTopY Top of the gradient in model coordinates
   * @param {number} groundGradientBottomY Bottom of the gradient in model coordinates
   * @param {Object} options
   * @constructor
   */
  function OutsideBackgroundNode( mvt, skyGradientTopY, groundGradientBottomY, options ) {

    Node.call( this );

    options = _.extend(
      {
        // Defaults.
        modelRect: new Rectangle( -2000, -2000, 4000, 4000 )
      }, options );

    if ( options.modelRect.getMinY() < 0 ) {
      // Add the ground first, because we're earthy people.
      var groundRect = new Rectangle( options.modelRect.minX, options.modelRect.minY, options.modelRect.width, -options.modelRect.minY );
      this.addChild( new GroundNode( mvt, groundRect, groundGradientBottomY ) );
    }
    if ( options.modelRect.getMaxY() > 0 ) {
      // Add the sky.
      var skyRect = new Rectangle( options.modelRect.x, 0, options.modelRect.width, options.modelRect.maxY );
      this.addChild( new SkyNode( mvt, skyRect, skyGradientTopY ) );
    }
  }

  return inherit( Node, OutsideBackgroundNode );
} );
