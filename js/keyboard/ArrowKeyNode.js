// Copyright 2017-2020, University of Colorado Boulder

/**
 * Node that looks like an arrow key on the keyboard.  Default is a rounded triangle centered in a square key.
 *
 * @author Jesse Greenberg
 */

import Shape from '../../../kite/js/Shape.js';
import merge from '../../../phet-core/js/merge.js';
import Path from '../../../scenery/js/nodes/Path.js';
import sceneryPhet from '../sceneryPhet.js';
import KeyNode from './KeyNode.js';

// constants
const DEFAULT_ARROW_HEIGHT = 10;
const DEFAULT_ARROW_WIDTH = 0.6 * Math.sqrt( 3 ) * DEFAULT_ARROW_HEIGHT; // for an isosceles triangle

// possible directions for the arrows in the key
const DIRECTION_ANGLES = {
  up: 0,
  down: Math.PI,
  left: -Math.PI / 2,
  right: Math.PI / 2
};

class ArrowKeyNode extends KeyNode {

  /**
   * @param {string} direction - direction of arrow, 'up'|'down'|'left'|'right'
   * @param {Object} [options]
   */
  constructor( direction, options ) {

    assert && assert( DIRECTION_ANGLES[ direction ] !== undefined, 'Arrow direction must be one of DIRECTION_ANGLES' );

    options = merge( {

      // options for the arrow
      arrowFill: 'black',
      arrowStroke: 'black',
      arrowLineJoin: 'round',
      arrowLineWidth: 3,
      arrowHeight: DEFAULT_ARROW_HEIGHT,
      arrowWidth: DEFAULT_ARROW_WIDTH,

      yPadding: 13, // this way the arrows will be scaled down and given proper margin in the key
      forceSquareKey: true // arrow keys are typically square
    }, options );

    const arrowHeight = options.arrowHeight;
    const arrowWidth = options.arrowWidth;
    const arrowLineJoin = options.arrowLineJoin;
    const arrowLineWidth = options.arrowLineWidth;
    const arrowFill = options.arrowFill;
    const arrowStroke = options.arrowStroke;

    // draw the arrow shape - default shape pointing up
    const arrowShape = new Shape();
    arrowShape.moveTo( arrowHeight / 2, 0 ).lineTo( arrowHeight, arrowWidth + 0 ).lineTo( 0, arrowWidth + 0 ).close();

    const arrowPath = new Path( arrowShape, {
      fill: arrowFill,
      stroke: arrowStroke,
      lineJoin: arrowLineJoin,
      lineWidth: arrowLineWidth,
      rotation: DIRECTION_ANGLES[ direction ]
    } );

    // place the arrow in the key
    super( arrowPath, options );
  }
}

sceneryPhet.register( 'ArrowKeyNode', ArrowKeyNode );
export default ArrowKeyNode;