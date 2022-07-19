// Copyright 2022, University of Colorado Boulder

/**
 * Demo for SpinningIndicatorNode
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { Node } from '../../../../scenery/js/imports.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import SpinningIndicatorNode from '../../SpinningIndicatorNode.js';
import stepTimer from '../../../../axon/js/stepTimer.js';

export default function demoSpinningIndicatorNode( layoutBounds: Bounds2 ) {
  return new DemoNode( layoutBounds );
}

class DemoNode extends Node {

  private readonly disposeDemoNode: () => void;

  public constructor( layoutBounds: Bounds2 ) {

    const spinningIndicatorNode = new SpinningIndicatorNode( {
      indicatorSize: 100
    } );

    const stepTimerListener = ( dt: number ) => spinningIndicatorNode.step( dt );

    stepTimer.addListener( stepTimerListener );

    super( {
      children: [ spinningIndicatorNode ],
      center: layoutBounds.center
    } );

    this.disposeDemoNode = () => {
      spinningIndicatorNode.dispose();
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