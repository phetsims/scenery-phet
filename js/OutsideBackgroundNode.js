// Copyright 2014-2017, University of Colorado Boulder

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

  // modules
  var GroundNode = require( 'SCENERY_PHET/GroundNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var SkyNode = require( 'SCENERY_PHET/SkyNode' );
  var Tandem = require( 'TANDEM/Tandem' );

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
    Tandem.indicateUninstrumentedCode();

    Node.call( this );

    options = _.extend(
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
