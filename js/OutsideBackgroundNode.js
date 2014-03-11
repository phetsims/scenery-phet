// Copyright 2002-2014, University of Colorado Boulder

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
define( function( require ) {
  'use strict';

  // Imports
  var Rectangle = require( 'DOT/Rectangle' );
  var SkyNode = require( 'SCENERY_PHET/SkyNode' );
  var GroundNode = require( 'SCENERY_PHET/GroundNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );

  /**
   * @param x
   * @param y
   * @param width
   * @param height
   * @param options
   * @constructor
   */
  function OutsideBackgroundNode( x, y, width, height, options ) {

    Node.call( this );

    options = _.extend(
      {
        // Defaults.
        skyHeight: height / 2, // Height of the sky, which defines where the ground/sky interface is.
        skyGradientHeight: height / 4,
        groundGradientDepth: height / 4
      }, options );

    // parameter checking
    assert && assert( options.skyHeight < height );

    // sky
    this.addChild( new SkyNode( x, y, width, options.skyHeight, options.skyGradientHeight ) );

    // ground
    this.addChild( new GroundNode( x, y + options.skyHeight, width, height - options.skyHeight, options.groundGradientDepth ) );
  }

  return inherit( Node, OutsideBackgroundNode );
} );
