// Copyright 2018-2022, University of Colorado Boulder

/**
 * View that typically connects a sensor (like a ProbeNode) to its body (where the readout value or chart appears).
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import IReadOnlyProperty from '../../axon/js/IReadOnlyProperty.js';
import Multilink from '../../axon/js/Multilink.js';
import Property from '../../axon/js/Property.js';
import Vector2 from '../../dot/js/Vector2.js';
import { Shape } from '../../kite/js/imports.js';
import optionize from '../../phet-core/js/optionize.js';
import { Path, PathOptions } from '../../scenery/js/imports.js';
import sceneryPhet from './sceneryPhet.js';

export type WireNodeOptions = PathOptions;

class WireNode extends Path {

  private multilink: Multilink<[ Vector2, Vector2, Vector2, Vector2 ]>

  /**
   * @param position1Property - connects to one object, often this is a DerivedProperty
   * @param normal1Property - defines the control point of the cubic curve, relative to the position1
   * @param position2Property - connects to another object, often this is a DerivedProperty
   * @param normal2Property - defines the control point of the cubic curve, relative to the position2
   * @param [options]
   */
  constructor( position1Property: IReadOnlyProperty<Vector2>, normal1Property: IReadOnlyProperty<Vector2>, position2Property: IReadOnlyProperty<Vector2>, normal2Property: IReadOnlyProperty<Vector2>, options?: WireNodeOptions ) {

    options = optionize<WireNodeOptions, {}, PathOptions>( {
      stroke: 'black'
    }, options );

    super( null, options );

    // @private
    this.multilink = Property.multilink( [
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

  dispose() {
    this.multilink.dispose();
    super.dispose();
  }
}

sceneryPhet.register( 'WireNode', WireNode );
export default WireNode;