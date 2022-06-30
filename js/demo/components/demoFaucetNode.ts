// Copyright 2022, University of Colorado Boulder

/**
 * Demo for FaucetNode
 */

import FaucetNode from '../../FaucetNode.js';
import PhetFont from '../../PhetFont.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import { Node, Text } from '../../../../scenery/js/imports.js';
import Property from '../../../../axon/js/Property.js';
import Checkbox from '../../../../sun/js/Checkbox.js';

export default function demoFaucetNode( layoutBounds: Bounds2 ): Node {

  const fluidRateProperty = new Property( 0 );
  const faucetEnabledProperty = new Property( true );

  const faucetNode = new FaucetNode( 10, fluidRateProperty, faucetEnabledProperty, {
    shooterOptions: {
      touchAreaXDilation: 37,
      touchAreaYDilation: 60
    }
  } );

  const faucetEnabledCheckbox = new Checkbox( faucetEnabledProperty, new Text( 'faucet enabled', { font: new PhetFont( 20 ) } ), {
    left: faucetNode.left,
    bottom: faucetNode.top - 20
  } );

  return new Node( {
    children: [ faucetNode, faucetEnabledCheckbox ],
    center: layoutBounds.center
  } );
}