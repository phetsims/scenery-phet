// Copyright 2020, University of Colorado Boulder

import merge from '../../phet-core/js/merge.js';
import Circle from '../../scenery/js/nodes/Circle.js';
import Line from '../../scenery/js/nodes/Line.js';
import Node from '../../scenery/js/nodes/Node.js';
import sceneryPhet from './sceneryPhet.js';

/**
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

class MagnifyingGlassNode extends Node {

  constructor( options ) {

    options = merge( {
      glassRadius: 15,
      glassFill: 'white', // center of the glass
      glassStroke: 'black', // rim and handle
      icon: null // optional icon will be centered in the glass area, if provided
    }, options );

    // the magnifying glass
    const glassLineWidth = 0.25 * options.glassRadius;
    const glassNode = new Circle( options.glassRadius, {
      fill: options.glassFill,
      stroke: options.glassStroke,
      lineWidth: glassLineWidth
    } );

    // handle at lower-left of glass, at a 45-degree angle
    const outsideRadius = options.glassRadius + ( glassLineWidth / 2 ); // use outside radius so handle line cap doesn't appear inside glassNode
    const handleNode = new Line(
      outsideRadius * Math.cos( Math.PI / 4 ), outsideRadius * Math.sin( Math.PI / 4 ),
      options.glassRadius * Math.cos( Math.PI / 4 ) + ( 0.65 * options.glassRadius ), options.glassRadius * Math.sin( Math.PI / 4 ) + ( 0.65 * options.glassRadius ), {
        stroke: options.glassStroke,
        lineWidth: 0.4 * options.glassRadius,
        lineCap: 'round'
      } );

    options.children = [ glassNode, handleNode ];

    if ( options.icon ) {
      options.icon.center = glassNode.center;
      options.children.push( options.icon );
    }

    super( options );
  }
}

sceneryPhet.register( 'MagnifyingGlassNode', MagnifyingGlassNode );
export default MagnifyingGlassNode;