// Copyright 2013-2020, University of Colorado Boulder

/**
 * A face that can smile or frown.  This is generally used for indicating success or failure.
 * This was ported from a version that was originally written in Java.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author John Blanco
 */

import Shape from '../../kite/js/Shape.js';
import InstanceRegistry from '../../phet-core/js/documentation/InstanceRegistry.js';
import merge from '../../phet-core/js/merge.js';
import Circle from '../../scenery/js/nodes/Circle.js';
import Node from '../../scenery/js/nodes/Node.js';
import Path from '../../scenery/js/nodes/Path.js';
import Color from '../../scenery/js/util/Color.js';
import sceneryPhet from './sceneryPhet.js';

class FaceNode extends Node {

  /**
   * @param {number} headDiameter
   * @param {Object} [options]
   */
  constructor( headDiameter, options ) {

    // default options
    options = merge( {
      headFill: 'yellow',
      headStroke: null, // {ColorDef} defaults to darker version of headFill, see below
      eyeFill: 'black',
      mouthStroke: 'black',
      headLineWidth: 1
    }, options );

    options.headStroke = options.headStroke || Color.toColor( options.headFill ).darkerColor();

    super();

    // Add head.
    this.addChild( new Circle( headDiameter / 2, {
      fill: options.headFill,
      stroke: options.headStroke,
      lineWidth: options.headLineWidth
    } ) );

    // Add the eyes.
    const eyeDiameter = headDiameter * 0.075;
    this.addChild( new Circle( eyeDiameter, {
      fill: options.eyeFill,
      centerX: -headDiameter * 0.2,
      centerY: -headDiameter * 0.1
    } ) );
    this.addChild( new Circle( eyeDiameter, {
      fill: options.eyeFill,
      centerX: headDiameter * 0.2,
      centerY: -headDiameter * 0.1
    } ) );

    // Add the mouths.
    const mouthLineWidth = headDiameter * 0.05;

    // @private
    this.smileMouth = new Path( new Shape().arc( 0, headDiameter * 0.05, headDiameter * 0.25, Math.PI * 0.2, Math.PI * 0.8 ), {
      stroke: options.mouthStroke,
      lineWidth: mouthLineWidth,
      lineCap: 'round'
    } );
    this.addChild( this.smileMouth );

    // @private
    this.frownMouth = new Path( new Shape().arc( 0, headDiameter * 0.4, headDiameter * 0.20, -Math.PI * 0.75, -Math.PI * 0.25 ), {
      stroke: options.mouthStroke,
      lineWidth: mouthLineWidth,
      lineCap: 'round'
    } );
    this.addChild( this.frownMouth );
    this.smile();

    // Pass through any options for positioning and such.
    this.mutate( options );

    // support for binder documentation, stripped out in builds and only runs when ?binder is specified
    assert && phet.chipper.queryParameters.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'FaceNode', this );
  }

  // @public
  smile() {
    this.smileMouth.visible = true;
    this.frownMouth.visible = false;
    return this; // allow chaining
  }

  // @public
  frown() {
    this.smileMouth.visible = false;
    this.frownMouth.visible = true;
    return this; // allow chaining
  }
}

sceneryPhet.register( 'FaceNode', FaceNode );
export default FaceNode;