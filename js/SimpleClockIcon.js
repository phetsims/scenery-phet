// Copyright 2013-2020, University of Colorado Boulder

/**
 * Scenery node that represents a simple, non-interactive clock.  It is
 * intended for use in situations where an icon representing time is needed.
 *
 * @author John Blanco
 */

import inherit from '../../phet-core/js/inherit.js';
import merge from '../../phet-core/js/merge.js';
import Circle from '../../scenery/js/nodes/Circle.js';
import Line from '../../scenery/js/nodes/Line.js';
import Node from '../../scenery/js/nodes/Node.js';
import sceneryPhet from './sceneryPhet.js';

/**
 * @param {number} radius
 * @param {Object} [options]
 * @constructor
 */
function SimpleClockIcon( radius, options ) {

  Node.call( this );
  options = merge( { fill: 'white', stroke: 'black', lineWidth: 2 }, options );
  this.addChild( new Circle( radius, options ) );
  this.addChild( new Circle( radius * 0.15, { fill: options.stroke } ) );
  const lineOptionsForClockHands = {
    stroke: options.stroke,
    lineWidth: options.lineWidth,
    lineCap: 'round',
    lineJoin: 'round'
  };
  // Hands at 4 o'clock
  this.addChild( new Line( 0, 0, 0, -radius * 0.75, lineOptionsForClockHands ) );
  this.addChild( new Line( 0, 0, radius * 0.45, radius * 0.3, lineOptionsForClockHands ) );
  this.centerX = radius;
  this.centerY = radius;
  this.mutate( options );
}

sceneryPhet.register( 'SimpleClockIcon', SimpleClockIcon );

inherit( Node, SimpleClockIcon );
export default SimpleClockIcon;