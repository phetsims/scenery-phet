// Copyright 2020-2022, University of Colorado Boulder

/**
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import optionize from '../../phet-core/js/optionize.js';
import StrictOmit from '../../phet-core/js/types/StrictOmit.js';
import { Circle, TColor, Line, Node, NodeOptions } from '../../scenery/js/imports.js';
import sceneryPhet from './sceneryPhet.js';

type SelfOptions = {
  glassRadius?: number;
  glassFill?: TColor; // center of the glass
  glassStroke?: TColor; // rim and handle
  icon?: Node | null; // optional icon will be centered in the glass area, if provided
};

export type MagnifyingGlassNodeOptions = SelfOptions & StrictOmit<NodeOptions, 'children'>;

export default class MagnifyingGlassNode extends Node {

  public constructor( providedOptions: MagnifyingGlassNodeOptions ) {

    const options = optionize<MagnifyingGlassNodeOptions, SelfOptions, NodeOptions>()( {

      // SelfOptions
      glassRadius: 15,
      glassFill: 'white',
      glassStroke: 'black',
      icon: null
    }, providedOptions );

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