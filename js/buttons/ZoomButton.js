// Copyright 2014-2020, University of Colorado Boulder

/**
 * Zoom button, has an icon with a magnifying glass, with either a plus or minus sign in the center of the glass.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Dimension2 from '../../../dot/js/Dimension2.js';
import InstanceRegistry from '../../../phet-core/js/documentation/InstanceRegistry.js';
import inherit from '../../../phet-core/js/inherit.js';
import merge from '../../../phet-core/js/merge.js';
import Circle from '../../../scenery/js/nodes/Circle.js';
import Line from '../../../scenery/js/nodes/Line.js';
import Node from '../../../scenery/js/nodes/Node.js';
import RectangularPushButton from '../../../sun/js/buttons/RectangularPushButton.js';
import Tandem from '../../../tandem/js/Tandem.js';
import MinusNode from '../MinusNode.js';
import PhetColorScheme from '../PhetColorScheme.js';
import PlusNode from '../PlusNode.js';
import sceneryPhet from '../sceneryPhet.js';

/**
 * @param {Object} [options]
 * @constructor
 */
function ZoomButton( options ) {

  options = merge( {
    in: true, // true: zoom-in button, false: zoom-out button
    radius: 15,
    baseColor: PhetColorScheme.BUTTON_YELLOW,
    magnifyingGlassFill: 'white', // center of the glass
    magnifyingGlassStroke: 'black', // rim and handle
    tandem: Tandem.REQUIRED
  }, options );

  // the magnifying glass
  const glassLineWidth = 0.25 * options.radius;
  const glassNode = new Circle( options.radius, {
    fill: options.magnifyingGlassFill,
    stroke: options.magnifyingGlassStroke,
    lineWidth: glassLineWidth
  } );

  // handle at lower-left of glass, at a 45-degree angle
  const outsideRadius = options.radius + ( glassLineWidth / 2 ); // use outside radius so handle line cap doesn't appear inside glassNode
  const handleNode = new Line(
    outsideRadius * Math.cos( Math.PI / 4 ), outsideRadius * Math.sin( Math.PI / 4 ),
    options.radius * Math.cos( Math.PI / 4 ) + ( 0.65 * options.radius ), options.radius * Math.sin( Math.PI / 4 ) + ( 0.65 * options.radius ), {
      stroke: options.magnifyingGlassStroke,
      lineWidth: 0.4 * options.radius,
      lineCap: 'round'
    } );

  // plus or minus sign in middle of magnifying glass
  const signOptions = {
    size: new Dimension2( 1.3 * options.radius, options.radius / 3 ),
    centerX: glassNode.centerX,
    centerY: glassNode.centerY
  };
  const signNode = options.in ? new PlusNode( signOptions ) : new MinusNode( signOptions );

  options.content = new Node( { children: [ handleNode, glassNode, signNode ] } );

  RectangularPushButton.call( this, options );

  // support for binder documentation, stripped out in builds and only runs when ?binder is specified
  assert && phet.chipper.queryParameters.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'ZoomButton', this );
}

sceneryPhet.register( 'ZoomButton', ZoomButton );

inherit( RectangularPushButton, ZoomButton );
export default ZoomButton;