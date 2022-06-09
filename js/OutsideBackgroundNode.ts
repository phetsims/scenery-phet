// Copyright 2014-2022, University of Colorado Boulder

/**
 * This node is intended for use as a background on a screen, and shows the
 * ground on the bottom and the sky on the top.
 * <p/>
 * The default size is chosen such that it works well with the default layout
 * size for a PhET HTML5 simulation.
 *
 * @author John Blanco
 * @author Sam Reid (PhET Interactive Simulations)
 */

import { Node } from '../../scenery/js/imports.js';
import GroundNode from './GroundNode.js';
import sceneryPhet from './sceneryPhet.js';
import SkyNode from './SkyNode.js';

class OutsideBackgroundNode extends Node {
  public constructor( centerX: number, centerY: number, width: number, skyHeight: number, groundDepth: number ) {
    super();

    // sky
    this.addChild( new SkyNode( centerX - width / 2, centerY - skyHeight, width, skyHeight, skyHeight / 2 ) );

    // ground
    this.addChild( new GroundNode( centerX - width / 2, centerY, width, groundDepth, centerY + groundDepth / 2 ) );
  }
}

sceneryPhet.register( 'OutsideBackgroundNode', OutsideBackgroundNode );
export default OutsideBackgroundNode;