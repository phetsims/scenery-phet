// Copyright 2018-2022, University of Colorado Boulder

/**
 * View that typically connects a sensor (like a ProbeNode) to its body (where the readout value or chart appears).
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import TReadOnlyProperty from '../../axon/js/TReadOnlyProperty.js';
import Multilink, { UnknownMultilink } from '../../axon/js/Multilink.js';
import Vector2 from '../../dot/js/Vector2.js';
import { Shape } from '../../kite/js/imports.js';
import optionize, { EmptySelfOptions } from '../../phet-core/js/optionize.js';
import { Path, PathOptions } from '../../scenery/js/imports.js';
import sceneryPhet from './sceneryPhet.js';

type SelfOptions = EmptySelfOptions;

export type WireNodeOptions = SelfOptions & PathOptions;

export default class WireNode extends Path {

  private readonly multilink: UnknownMultilink;

  /**
   * @param position1Property - connects to one object, often this is a DerivedProperty
   * @param normal1Property - defines the control point of the cubic curve, relative to the position1
   * @param position2Property - connects to another object, often this is a DerivedProperty
   * @param normal2Property - defines the control point of the cubic curve, relative to the position2
   * @param [options]
   */
  public constructor( position1Property: TReadOnlyProperty<Vector2>, normal1Property: TReadOnlyProperty<Vector2>,
                      position2Property: TReadOnlyProperty<Vector2>, normal2Property: TReadOnlyProperty<Vector2>,
                      options?: WireNodeOptions ) {

    options = optionize<WireNodeOptions, SelfOptions, PathOptions>()( {
      stroke: 'black'
    }, options );

    super( null, options );

    this.multilink = Multilink.multilink( [
      position1Property, normal1Property, position2Property, normal2Property
    ], ( position1, normal1, position2, normal2 ) => {
      this.shape = new Shape()
        .moveToPoint( position1 )
        .cubicCurveToPoint(
          position1.plus( normal1 ),
          position2.plus( normal2 ),
          position2
        );
    } );
  }

  public override dispose(): void {
    this.multilink.dispose();
    super.dispose();
  }
}

sceneryPhet.register( 'WireNode', WireNode );