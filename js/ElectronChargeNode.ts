// Copyright 2017-2022, University of Colorado Boulder

/**
 * ElectronChargeNode renders a shaded 2d electron with a "-" sign in the middle.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import InstanceRegistry from '../../phet-core/js/documentation/InstanceRegistry.js';
import StrictOmit from '../../phet-core/js/types/StrictOmit.js';
import optionize from '../../phet-core/js/optionize.js';
import { Circle, Node, NodeOptions, RadialGradient, Rectangle } from '../../scenery/js/imports.js';
import sceneryPhet from './sceneryPhet.js';

type SelfOptions = {
  sphereOpacity?: number;
  minusSignOpacity?: number;
  radius?: number;
};

export type ElectronChargeNodeOptions = SelfOptions & StrictOmit<NodeOptions, 'children'>;

export default class ElectronChargeNode extends Node {

  public constructor( providedOptions?: ElectronChargeNodeOptions ) {

    const options = optionize<ElectronChargeNodeOptions, SelfOptions, NodeOptions>()( {

      // Workaround for https://github.com/phetsims/circuit-construction-kit-dc/issues/160
      sphereOpacity: 1,
      minusSignOpacity: 1,
      radius: 10

    }, providedOptions );

    options.children = [

      // The blue shaded sphere
      new Circle( options.radius, {
        opacity: options.sphereOpacity,
        fill: new RadialGradient(
          2, -3, 2,
          2, -3, 7 )
          .addColorStop( 0, '#4fcfff' )
          .addColorStop( 0.5, '#2cbef5' )
          .addColorStop( 1, '#00a9e8' )
      } ),

      // Minus sign, intentionally not internationalized
      new Rectangle( 0, 0, 11, 2, {
        opacity: options.minusSignOpacity,
        fill: 'white',
        centerX: 0,
        centerY: 0
      } )
    ];

    super( options );

    // support for binder documentation, stripped out in builds and only runs when ?binder is specified
    assert && phet.chipper.queryParameters.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'ElectronChargeNode', this );
  }
}

sceneryPhet.register( 'ElectronChargeNode', ElectronChargeNode );