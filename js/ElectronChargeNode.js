// Copyright 2017-2020, University of Colorado Boulder

/**
 * Renders a shaded 2d electron with a "-" sign in the middle.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import InstanceRegistry from '../../phet-core/js/documentation/InstanceRegistry.js';
import inherit from '../../phet-core/js/inherit.js';
import merge from '../../phet-core/js/merge.js';
import Circle from '../../scenery/js/nodes/Circle.js';
import Node from '../../scenery/js/nodes/Node.js';
import Rectangle from '../../scenery/js/nodes/Rectangle.js';
import RadialGradient from '../../scenery/js/util/RadialGradient.js';
import sceneryPhet from './sceneryPhet.js';

// constants
const RADIUS = 10;

/**
 * @constructor
 */
function ElectronChargeNode( options ) {

  // No options supported yet
  options = merge( {

    // Workaround for https://github.com/phetsims/circuit-construction-kit-dc/issues/160
    sphereOpacity: 1,
    minusSignOpacity: 1

  }, options );
  options.children = [

    // The blue shaded sphere
    new Circle( RADIUS, {
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
  Node.call( this, options );

  // support for binder documentation, stripped out in builds and only runs when ?binder is specified
  assert && phet.chipper.queryParameters.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'ElectronChargeNode', this );
}

sceneryPhet.register( 'ElectronChargeNode', ElectronChargeNode );

inherit( Node, ElectronChargeNode );
export default ElectronChargeNode;