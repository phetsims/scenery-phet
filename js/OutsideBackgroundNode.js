// Copyright 2014-2020, University of Colorado Boulder

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

import inherit from '../../phet-core/js/inherit.js';
import merge from '../../phet-core/js/merge.js';
import Node from '../../scenery/js/nodes/Node.js';
import GroundNode from './GroundNode.js';
import sceneryPhet from './sceneryPhet.js';
import SkyNode from './SkyNode.js';

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
      skyGradientHeight: skyHeight / 2,
      groundGradientDepth: groundDepth / 2
    }, options );

  // sky
  this.addChild( new SkyNode( centerX - width / 2, centerY - skyHeight, width, skyHeight, options.skyGradientHeight ) );

  // ground
  this.addChild( new GroundNode( centerX - width / 2, centerY, width, groundDepth, centerY + options.groundGradientDepth ) );
}

sceneryPhet.register( 'OutsideBackgroundNode', OutsideBackgroundNode );

inherit( Node, OutsideBackgroundNode );
export default OutsideBackgroundNode;