// Copyright 2020-2022, University of Colorado Boulder

/**
 * ProtractorNode is a device for measuring angles.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Chandrashekar Bemagoni (Actual Concepts)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../axon/js/NumberProperty.js';
import Property from '../../axon/js/Property.js';
import Vector2 from '../../dot/js/Vector2.js';
import { Shape } from '../../kite/js/imports.js';
import optionize from '../../phet-core/js/optionize.js';
import StrictOmit from '../../phet-core/js/types/StrictOmit.js';
import sceneryPhet from '../../scenery-phet/js/sceneryPhet.js';
import protractor_png from '../../scenery-phet/mipmaps/protractor_png.js';
import { DragListener, Image, Node, NodeOptions, Path } from '../../scenery/js/imports.js';

type SelfOptions = {

  // whether the protractor is rotatable via user interaction
  rotatable?: boolean;

  // the initial angle of the protractor, in radians
  angle?: number;
};
export type ProtractorNodeOptions = SelfOptions & StrictOmit<NodeOptions, 'children'>;

export default class ProtractorNode extends Node {

  // angle of the protractor, in radians
  public readonly angleProperty: Property<number>;

  public constructor( providedOptions?: ProtractorNodeOptions ) {

    const options = optionize<ProtractorNodeOptions, SelfOptions, NodeOptions>()( {
      angle: 0,
      rotatable: false,
      cursor: 'pointer'
    }, providedOptions );

    super();

    // Image
    const protractor_pngNode = new Image( protractor_png, {
      hitTestPixels: true // hit test only non-transparent pixels in the image
    } );
    this.addChild( protractor_pngNode );

    this.angleProperty = new NumberProperty( options.angle );

    if ( options.rotatable ) {

      // Use nicknames for width and height, to make the Shape code easier to understand.
      const w = protractor_pngNode.getWidth();
      const h = protractor_pngNode.getHeight();

      // Outer ring of the protractor. Shape must match protractor_png!
      const outerRingShape = new Shape()
        .moveTo( w, h / 2 )
        .ellipticalArc( w / 2, h / 2, w / 2, h / 2, 0, 0, Math.PI, true )
        .lineTo( w * 0.2, h / 2 )
        .ellipticalArc( w / 2, h / 2, w * 0.3, h * 0.3, 0, Math.PI, 0, false )
        .lineTo( w, h / 2 )
        .ellipticalArc( w / 2, h / 2, w / 2, h / 2, 0, 0, Math.PI, false )
        .lineTo( w * 0.2, h / 2 )
        .ellipticalArc( w / 2, h / 2, w * 0.3, h * 0.3, 0, Math.PI, 0, true );
      const outerRingPath = new Path( outerRingShape, {
        stroke: phet.chipper.queryParameters.dev ? 'red' : null // show the Shape with ?dev
      } );
      this.addChild( outerRingPath );

      // Rotate the protractor when its outer ring is dragged.
      let start: Vector2;
      outerRingPath.addInputListener( new DragListener( {
        start: event => {
          start = this.globalToParentPoint( event.pointer.point );
        },
        drag: event => {

          // compute the change in angle based on the new drag event
          const end = this.globalToParentPoint( event.pointer.point );
          const centerX = this.getCenterX();
          const centerY = this.getCenterY();
          const startAngle = Math.atan2( centerY - start.y, centerX - start.x );
          const angle = Math.atan2( centerY - end.y, centerX - end.x );

          // rotate the protractor model
          this.angleProperty.value += angle - startAngle;
          start = end;
        }
      } ) );

      // Rotate to match the protractor angle
      this.angleProperty.link( angle => {
        this.rotateAround( this.center, angle - this.getRotation() );
      } );
    }

    this.mutate( options );
  }

  public reset(): void {
    this.angleProperty.reset();
  }

  /**
   * Creates an icon, to be used for toolboxes, checkboxes, etc.
   */
  public static createIcon( options: NodeOptions ): Node {
    return new Image( protractor_png, options );
  }
}

sceneryPhet.register( 'ProtractorNode', ProtractorNode );