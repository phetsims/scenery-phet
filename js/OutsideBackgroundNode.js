// Copyright 2014-2019, University of Colorado Boulder

/**
 * This node is intended for use as a background on a screen, and shows the
 * ground on the bottom and the sky on the top.
 * <p/>
 * The default size is chosen such that it works well with the default layout
 * size for a PhET HTML5 simulation.
 *
 * @author John Blanco
 * @author Sam Reid
 */
define( require => {
  'use strict';

  // modules
  const GroundNode = require( 'SCENERY_PHET/GroundNode' );
  const inherit = require( 'PHET_CORE/inherit' );
  const merge = require( 'PHET_CORE/merge' );
  const Node = require( 'SCENERY/nodes/Node' );
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  const SkyNode = require( 'SCENERY_PHET/SkyNode' );

  /**
   * @param {number} centerX
   * @param {number} centerY
   * @param {number} width
   * @param {number} skyHeight
   * @param {number} groundDepth
   * @param {Object} [options]
   * @constructor
   */
  function OutsideBackgroundNode( centerX, centerY, width, skyHeight, groundDepth, options ) {
    Node.call( this );

    options = merge(
      {
        // Defaults.
        skyGradientHeight:   skyHeight / 2,
        groundGradientDepth: groundDepth / 2
      }, options );

    // parameter checking
    //TODO commenting out this assert, there is no options.skyHeight and height is not declared
//    assert && assert( options.skyHeight < height );

    // sky
    this.addChild( new SkyNode( centerX - width / 2, centerY - skyHeight, width, skyHeight, options.skyGradientHeight ) );

    // ground
    this.addChild( new GroundNode( centerX - width / 2, centerY, width, groundDepth, centerY + options.groundGradientDepth ) );
  }

  sceneryPhet.register( 'OutsideBackgroundNode', OutsideBackgroundNode );

  return inherit( Node, OutsideBackgroundNode );
} );
