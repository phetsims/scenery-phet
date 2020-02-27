// Copyright 2019-2020, University of Colorado Boulder

/**
 * The symbol is the universal "no" symbol, which shows a circle with a line through it, see
 * https://en.wikipedia.org/wiki/No_symbol. It's known by a number of  different emoji names, include "banned", see
 * https://emojipedia.org/no-entry-sign/.  It is also referred to as a prohibition sign.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../phet-core/js/merge.js';
import Circle from '../../scenery/js/nodes/Circle.js';
import Line from '../../scenery/js/nodes/Line.js';
import Node from '../../scenery/js/nodes/Node.js';
import sceneryPhet from './sceneryPhet.js';

class BannedNode extends Node {

  /**
   * @param {Object} [options]
   * @constructor
   */
  constructor( options ) {

    options = merge( {
      radius: 20,
      lineWidth: 5,
      stroke: 'red',
      fill: null
    }, options );

    const circleNode = new Circle( options.radius, {
      lineWidth: options.lineWidth,
      stroke: options.stroke,
      fill: options.fill
    } );

    const slashNode = new Line( 0, 0, 2 * options.radius, 0, {
      lineWidth: options.lineWidth,
      stroke: options.stroke,
      rotation: Math.PI / 4,
      center: circleNode.center
    } );

    assert && assert( !options.children, 'decoration not supported' );

    options.children = [ circleNode, slashNode ];

    super( options );
  }
}

sceneryPhet.register( 'BannedNode', BannedNode );

export default BannedNode;