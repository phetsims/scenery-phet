// Copyright 2014-2020, University of Colorado Boulder

/**
 * Zoom button, has an icon with a magnifying glass, with either a plus or minus sign in the center of the glass.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Dimension2 from '../../../dot/js/Dimension2.js';
import InstanceRegistry from '../../../phet-core/js/documentation/InstanceRegistry.js';
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

class ZoomButton extends RectangularPushButton {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {
      in: true, // true: zoom-in button, false: zoom-out button
      baseColor: PhetColorScheme.BUTTON_YELLOW,
      magnifyingGlassRadius: 15,
      magnifyingGlassFill: 'white', // center of the glass
      magnifyingGlassStroke: 'black', // rim and handle
      tandem: Tandem.REQUIRED
    }, options );

    // the magnifying glass
    const glassLineWidth = 0.25 * options.magnifyingGlassRadius;
    const glassNode = new Circle( options.magnifyingGlassRadius, {
      fill: options.magnifyingGlassFill,
      stroke: options.magnifyingGlassStroke,
      lineWidth: glassLineWidth
    } );

    // handle at lower-left of glass, at a 45-degree angle
    const outsideRadius = options.magnifyingGlassRadius + ( glassLineWidth / 2 ); // use outside radius so handle line cap doesn't appear inside glassNode
    const handleNode = new Line(
      outsideRadius * Math.cos( Math.PI / 4 ), outsideRadius * Math.sin( Math.PI / 4 ),
      options.magnifyingGlassRadius * Math.cos( Math.PI / 4 ) + ( 0.65 * options.magnifyingGlassRadius ), options.magnifyingGlassRadius * Math.sin( Math.PI / 4 ) + ( 0.65 * options.magnifyingGlassRadius ), {
        stroke: options.magnifyingGlassStroke,
        lineWidth: 0.4 * options.magnifyingGlassRadius,
        lineCap: 'round'
      } );

    // plus or minus sign in middle of magnifying glass
    const signOptions = {
      size: new Dimension2( 1.3 * options.magnifyingGlassRadius, options.magnifyingGlassRadius / 3 ),
      centerX: glassNode.centerX,
      centerY: glassNode.centerY
    };
    const signNode = options.in ? new PlusNode( signOptions ) : new MinusNode( signOptions );

    assert && assert( !options.content, 'ZoomButton sets content' );
    options.content = new Node( { children: [ handleNode, glassNode, signNode ] } );

    super( options );

    // support for binder documentation, stripped out in builds and only runs when ?binder is specified
    assert && phet.chipper.queryParameters.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'ZoomButton', this );
  }
}

sceneryPhet.register( 'ZoomButton', ZoomButton );
export default ZoomButton;