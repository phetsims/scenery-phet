// Copyright 2013-2022, University of Colorado Boulder

/**
 * FaceNode is a face that can smile or frown.  This is generally used for indicating success or failure.
 * This was ported from a version that was originally written in Java.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author John Blanco
 */

import DerivedProperty from '../../axon/js/DerivedProperty.js';
import { Shape } from '../../kite/js/imports.js';
import InstanceRegistry from '../../phet-core/js/documentation/InstanceRegistry.js';
import optionize from '../../phet-core/js/optionize.js';
import { Circle, Color, TColor, Node, NodeOptions, PaintColorProperty, Path } from '../../scenery/js/imports.js';
import sceneryPhet from './sceneryPhet.js';

type SelfOptions = {
  headFill?: TColor;
  headStroke?: TColor;
  eyeFill?: TColor;
  mouthStroke?: TColor;
  headLineWidth?: number;
};

export type FaceNodeOptions = SelfOptions & NodeOptions;

export default class FaceNode extends Node {

  private readonly smileMouth: Path;
  private readonly frownMouth: Path;

  public constructor( headDiameter: number, providedOptions?: FaceNodeOptions ) {

    // default options
    const options = optionize<FaceNodeOptions, SelfOptions, NodeOptions>()( {
      headFill: Color.YELLOW,
      headStroke: null,
      eyeFill: 'black',
      mouthStroke: 'black',
      headLineWidth: 1
    }, providedOptions );

    super();

    // Wrap headFill in a Property, so that we can use darkerColor below.
    // See https://github.com/phetsims/scenery-phet/issues/623
    const headFillProperty = new PaintColorProperty( options.headFill );

    // The derived property listens to our headFillProperty which will be disposed. We don't need to keep a reference.
    options.headStroke = options.headStroke ||
                         new DerivedProperty( [ headFillProperty ],
                           color => color.darkerColor()
                         );

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

    this.smileMouth = new Path( new Shape().arc( 0, headDiameter * 0.05, headDiameter * 0.25, Math.PI * 0.2, Math.PI * 0.8 ), {
      stroke: options.mouthStroke,
      lineWidth: mouthLineWidth,
      lineCap: 'round'
    } );
    this.addChild( this.smileMouth );

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

  public smile(): FaceNode {
    this.smileMouth.visible = true;
    this.frownMouth.visible = false;
    return this;
  }

  public frown(): FaceNode {
    this.smileMouth.visible = false;
    this.frownMouth.visible = true;
    return this;
  }
}

sceneryPhet.register( 'FaceNode', FaceNode );