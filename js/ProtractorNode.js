// Copyright 2020, University of Colorado Boulder

/**
 * The protractor node is a circular device for measuring angles. In this sim it is used for measuring the angle of the
 * incident, reflected and refracted light.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Chandrashekar Bemagoni (Actual Concepts)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../axon/js/Property.js';
import Shape from '../../kite/js/Shape.js';
import merge from '../../phet-core/js/merge.js';
import sceneryPhet from '../../scenery-phet/js/sceneryPhet.js';
import protractorImage from '../../scenery-phet/mipmaps/protractor_png.js';
import DragListener from '../../scenery/js/listeners/DragListener.js';
import Image from '../../scenery/js/nodes/Image.js';
import Node from '../../scenery/js/nodes/Node.js';
import Path from '../../scenery/js/nodes/Path.js';

class ProtractorNode extends Node {

  /**
   * @param {Property.<boolean>} showProtractorProperty - controls the protractor visibility
   * @param {Object} [options]
   */
  constructor( showProtractorProperty, options ) {

    options = merge( {
      rotatable: false,
      cursor: 'pointer'
    }, options );
    assert && assert( !options.children, 'ProtractorNode sets children' );

    super();

    const showProtractorListener = showProtractorProperty.linkAttribute( this, 'visible' );

    // Image
    const protractorImageNode = new Image( protractorImage, {
      hitTestPixels: true // hit test only non-transparent pixels in the image
    } );
    this.addChild( protractorImageNode );

    if ( options.rotatable ) {

      // @private
      this.protractorAngleProperty = new Property( 0.0 );

      // Use nicknames for width and height, to make the Shape code easier to understand.
      const w = protractorImageNode.getWidth();
      const h = protractorImageNode.getHeight();

      // Outer ring of the protractor. Shape must match protractorImage!
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
      let start;
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
          this.protractorAngleProperty.value += angle - startAngle;
          start = end;
        }
      } ) );

      // Rotate to match the protractor angle
      this.protractorAngleProperty.link( angle => {
        this.rotateAround( this.center, angle - this.getRotation() );
      } );
    }

    // @private
    this.disposeProtractorNode = () => {
      showProtractorProperty.unlinkAttribute( showProtractorListener );
    };

    this.mutate( options );
  }

  /**
   * @public
   * @override
   */
  dispose() {
    this.disposeProtractorNode();
    super.dispose();
  }

  /**
   * @public
   */
  reset() {
    this.protractorAngleProperty && this.protractorAngleProperty.reset();
  }

  /**
   * Creates an icon, to be used for toolboxes, checkboxes, etc.
   * @param {Object} [options] - options to scenery.Node
   * @returns {Node}
   * @public
   */
  static createIcon( options ) {
    return new Image( protractorImage, options );
  }
}

sceneryPhet.register( 'ProtractorNode', ProtractorNode );

export default ProtractorNode;