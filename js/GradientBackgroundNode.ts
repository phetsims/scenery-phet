// Copyright 2014-2022, University of Colorado Boulder

/**
 * Base type for nodes that are used as the background on a tab and that have
 * some sort of gradient to it.  Example include ground and sky.
 *
 * @author John Blanco
 * @author Sam Reid (PhET Interactive Simulations)
 */

import { TColor, LinearGradient, Rectangle } from '../../scenery/js/imports.js';
import sceneryPhet from './sceneryPhet.js';

export default class GradientBackgroundNode extends Rectangle {
  public constructor( x: number, y: number, width: number, height: number, color1: TColor, color2: TColor, y1: number, y2: number ) {
    const centerX = x + width / 2;
    const gradient = new LinearGradient( centerX, y1, centerX, y2 );
    gradient.addColorStop( 0, color1 );
    gradient.addColorStop( 1, color2 );
    super( x, y, width, height, 0, 0, { fill: gradient } );
  }
}

sceneryPhet.register( 'GradientBackgroundNode', GradientBackgroundNode );