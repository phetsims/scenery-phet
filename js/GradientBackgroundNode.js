// Copyright 2014-2020, University of Colorado Boulder

/**
 * Base type for nodes that are used as the background on a tab and that have
 * some sort of gradient to it.  Example include ground and sky.
 *
 * @author John Blanco
 * @author Sam Reid
 */

import inherit from '../../phet-core/js/inherit.js';
import Rectangle from '../../scenery/js/nodes/Rectangle.js';
import LinearGradient from '../../scenery/js/util/LinearGradient.js';
import sceneryPhet from './sceneryPhet.js';

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
  const centerX = x + width / 2;
  const gradient = new LinearGradient( centerX, y1, centerX, y2 );
  gradient.addColorStop( 0, color1 );
  gradient.addColorStop( 1, color2 );
  Rectangle.call( this, x, y, width, height, 0, 0, { fill: gradient } );
}

sceneryPhet.register( 'GradientBackgroundNode', GradientBackgroundNode );

inherit( Rectangle, GradientBackgroundNode );
export default GradientBackgroundNode;