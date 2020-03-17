// Copyright 2014-2020, University of Colorado Boulder

/**
 * Restart button.
 *
 * @author Sam Reid
 */

import Shape from '../../../kite/js/Shape.js';
import InstanceRegistry from '../../../phet-core/js/documentation/InstanceRegistry.js';
import inherit from '../../../phet-core/js/inherit.js';
import HBox from '../../../scenery/js/nodes/HBox.js';
import Path from '../../../scenery/js/nodes/Path.js';
import Rectangle from '../../../scenery/js/nodes/Rectangle.js';
import RoundPushButton from '../../../sun/js/buttons/RoundPushButton.js';
import sceneryPhet from '../sceneryPhet.js';

/**
 * @param {Object} [options] - see RoundPushButton
 * @constructor
 */
function RestartButton( options ) {
  options = options || {};

  const scale = 0.75;
  const vscale = 1.15;
  const barWidth = 6 * scale;
  const barHeight = 18 * scale * vscale;

  const triangleWidth = 14 * scale;
  const triangleHeight = 18 * scale * vscale;

  const barPath = new Rectangle( 0, 0, barWidth, barHeight, { fill: 'black', stroke: '#bbbbbb', lineWidth: 1 } );
  const trianglePath = new Path( new Shape().moveTo( 0, triangleHeight / 2 ).lineTo( -triangleWidth, 0 ).lineTo( 0, -triangleHeight / 2 ).close(), {
    fill: 'black',
    stroke: '#bbbbbb',
    lineWidth: 1
  } );
  const trianglePath2 = new Path( new Shape().moveTo( 0, triangleHeight / 2 ).lineTo( -triangleWidth, 0 ).lineTo( 0, -triangleHeight / 2 ).close(), {
    fill: 'black',
    stroke: '#bbbbbb',
    lineWidth: 1
  } );

  assert && assert( !options.content, 'this button creates its own content' );
  options.content = new HBox( { children: [ barPath, trianglePath, trianglePath2 ], spacing: -1 } );

  RoundPushButton.call( this, options );

  // support for binder documentation, stripped out in builds and only runs when ?binder is specified
  assert && phet.chipper.queryParameters.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'RestartButton', this );
}

sceneryPhet.register( 'RestartButton', RestartButton );

inherit( RoundPushButton, RestartButton );
export default RestartButton;