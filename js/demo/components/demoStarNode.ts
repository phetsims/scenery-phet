// Copyright 2022, University of Colorado Boulder

/**
 * Demo for StarNode
 */

import StarNode from '../../StarNode.js';
import { Node } from '../../../../scenery/js/imports.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Range from '../../../../dot/js/Range.js';
import Property from '../../../../axon/js/Property.js';
import HSlider from '../../../../sun/js/HSlider.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';

export default function demoStarNode( layoutBounds: Bounds2 ): Node {

  const starValueProperty = new Property( 1 );

  const starSlider = new HSlider( starValueProperty, new Range( 0, 1 ), {
    thumbSize: new Dimension2( 25, 50 ),
    thumbFillHighlighted: 'yellow',
    thumbFill: 'rgb(220,220,0)',
    thumbCenterLineStroke: 'black'
  } );

  const starNodeContainer = new Node( {
    children: [ new StarNode() ],
    top: starSlider.bottom + 30,
    right: starSlider.right
  } );

  /*
   * Fill up a star by creating new StarNodes dynamically.
   * Shouldn't be a problem for sims since stars are relatively static.
   * Stars should be rewritten if they need to support smooth dynamic filling (may require mutable kite paths).
   */
  starValueProperty.link( value => {
    starNodeContainer.children = [
      new StarNode( {
        value: value,
        starShapeOptions: {
          outerRadius: 30,
          innerRadius: 15
        }
      } )
    ];
  } );

  return new Node( {
    children: [ starNodeContainer, starSlider ],
    center: layoutBounds.center
  } );
}