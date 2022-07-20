// Copyright 2022, University of Colorado Boulder

/**
 * Demo for SpinningIndicatorNode
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { Color, HBox, Node } from '../../../../scenery/js/imports.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import SpinningIndicatorNode from '../../SpinningIndicatorNode.js';
import stepTimer from '../../../../axon/js/stepTimer.js';

export default function demoSpinningIndicatorNode( layoutBounds: Bounds2 ): Node {
  return new DemoNode( layoutBounds );
}

class DemoNode extends HBox {

  private readonly disposeDemoNode: () => void;

  public constructor( layoutBounds: Bounds2 ) {

    const spinningIndicatorNode1 = new SpinningIndicatorNode( {
      diameter: 100
    } );

    const spinningIndicatorNode2 = new SpinningIndicatorNode( {
      diameter: 100,
      numberOfElements: 30,
      elementFactory: SpinningIndicatorNode.circleFactory,
      activeColor: Color.RED,
      inactiveColor: Color.RED.withAlpha( 0.15 )
    } );

    const stepTimerListener = ( dt: number ) => {
      spinningIndicatorNode1.step( dt );
      spinningIndicatorNode2.step( dt );
    };

    stepTimer.addListener( stepTimerListener );

    super( {
      children: [ spinningIndicatorNode1, spinningIndicatorNode2 ],
      spacing: 100,
      center: layoutBounds.center
    } );

    this.disposeDemoNode = () => {
      spinningIndicatorNode1.dispose();
      spinningIndicatorNode2.dispose();
      if ( stepTimer.hasListener( stepTimerListener ) ) {
        stepTimer.removeListener( stepTimerListener );
      }
    };
  }

  public override dispose(): void {
    this.disposeDemoNode();
    super.dispose();
  }
}