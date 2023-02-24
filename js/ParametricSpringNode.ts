// Copyright 2015-2023, University of Colorado Boulder

/**
 * Spring described by a parametric equation. This implementation is a variation of the cycloid equation.
 * A prolate cycloid (see http://mathworld.wolfram.com/ProlateCycloid.html) comes closest to this implementation,
 * although it doesn't include aspect ratio and delta phase.
 *
 * The origin (0, 0) of this node is at its left center.
 * The front and back of the spring are drawn as separate paths to provide pseudo-3D visual cues.
 * Performance can be improved dramatically by setting options.pathBoundsMethod to 'none', at
 * the expense of layout accuracy. If you use this option, you can only rely on Node.x and Node.y for
 * doing layout.  See Path.boundsMethod for additional details.
 *
 * The "Spring" screen in the scenery-demo application provides an extensive test harness for ParametricSpringNode.
 *
 * @author Martin Veillette (Berea College)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../axon/js/NumberProperty.js';
import Multilink from '../../axon/js/Multilink.js';
import Range from '../../dot/js/Range.js';
import Vector2 from '../../dot/js/Vector2.js';
import { Shape } from '../../kite/js/imports.js';
import InstanceRegistry from '../../phet-core/js/documentation/InstanceRegistry.js';
import { Circle, TColor, LinearGradient, Node, NodeOptions, Path, PathOptions } from '../../scenery/js/imports.js';
import Tandem from '../../tandem/js/Tandem.js';
import sceneryPhet from './sceneryPhet.js';
import optionize, { combineOptions } from '../../phet-core/js/optionize.js';
import PickOptional from '../../phet-core/js/types/PickOptional.js';

// constants
const SHOW_ORIGIN = false; // {boolean} draws a red circle at the origin, for layout debugging

type SelfOptions = {

  // colors used for the gradient strokes
  frontColor?: TColor;
  middleColor?: TColor; // the dominant color
  backColor?: TColor;

  // length of the horizontal line added to the left end of the coil
  leftEndLength?: number;

  // {number} length of the horizontal line added to the right end of the coil
  rightEndLength?: number;

  // number of loops in the coil
  loops?: number;

  // number of points used to approximate 1 loop of the coil
  pointsPerLoop?: number;

  // radius of a loop with aspect ratio of 1:1
  radius?: number;

  // y:x aspect ratio of the loop radius
  aspectRatio?: number;

  // lineWidth used to stroke the Paths
  lineWidth?: number;

  // phase angle of where the loop starts, period is (0,2*PI) radians, counterclockwise
  phase?: number;

  // responsible for the leaning of the coil, variation on a Lissjoue curve, period is (0,2*PI) radians
  deltaPhase?: number;

  // multiplier for radius in the x dimension, makes the coil appear to get longer
  xScale?: number;

} & PickOptional<PathOptions, 'boundsMethod'>;

export type ParametricSpringNodeOptions = SelfOptions & NodeOptions;

export default class ParametricSpringNode extends Node {

  public readonly loopsProperty: NumberProperty;
  public readonly radiusProperty: NumberProperty;
  public readonly aspectRatioProperty: NumberProperty;
  public readonly pointsPerLoopProperty: NumberProperty;
  public readonly lineWidthProperty: NumberProperty;
  public readonly phaseProperty: NumberProperty;
  public readonly deltaPhaseProperty: NumberProperty;
  public readonly xScaleProperty: NumberProperty;

  public constructor( providedOptions?: ParametricSpringNodeOptions ) {

    const options = optionize<ParametricSpringNodeOptions, SelfOptions, NodeOptions>()( {

      // SelfOptions
      frontColor: 'lightGray',
      middleColor: 'gray',
      backColor: 'black',
      leftEndLength: 15,
      rightEndLength: 25,
      loops: 10,
      pointsPerLoop: 40,
      radius: 10,
      aspectRatio: 4,
      lineWidth: 3,
      phase: Math.PI,
      deltaPhase: Math.PI / 2,
      xScale: 2.5,
      boundsMethod: 'accurate', // method used to compute bounds for phet.scenery.Path components, see Path.boundsMethod

      // phet-io
      tandem: Tandem.OPTIONAL
    }, providedOptions );

    super();

    this.loopsProperty = new NumberProperty( options.loops, {
      tandem: options.tandem.createTandem( 'loopsProperty' ),
      numberType: 'Integer',
      range: new Range( 1, Number.POSITIVE_INFINITY )
    } );

    this.radiusProperty = new NumberProperty( options.radius, {
      tandem: options.tandem.createTandem( 'radiusProperty' ),
      range: new Range( 0, Number.POSITIVE_INFINITY )
    } );

    this.aspectRatioProperty = new NumberProperty( options.aspectRatio, {
      tandem: options.tandem.createTandem( 'aspectRatioProperty' ),
      range: new Range( 0, Number.POSITIVE_INFINITY )
    } );

    this.pointsPerLoopProperty = new NumberProperty( options.pointsPerLoop, {
      tandem: options.tandem.createTandem( 'pointsPerLoopProperty' ),
      numberType: 'Integer',
      range: new Range( 0, Number.POSITIVE_INFINITY )
    } );

    this.lineWidthProperty = new NumberProperty( options.lineWidth, {
      tandem: options.tandem.createTandem( 'lineWidthProperty' ),
      range: new Range( 0, Number.POSITIVE_INFINITY )
    } );

    this.phaseProperty = new NumberProperty( options.phase, {
      tandem: options.tandem.createTandem( 'phaseProperty' ),
      range: new Range( Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY )
    } );

    this.deltaPhaseProperty = new NumberProperty( options.deltaPhase, {
      tandem: options.tandem.createTandem( 'deltaPhaseProperty' ),
      range: new Range( Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY )
    } );

    this.xScaleProperty = new NumberProperty( options.xScale, {
      tandem: options.tandem.createTandem( 'xScaleProperty' ),
      range: new Range( Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY )
    } );

    // Paths for the front (foreground) and back (background) parts of the spring
    const pathOptions: PathOptions = {
      boundsMethod: options.boundsMethod,
      lineCap: 'round',
      lineJoin: 'round'
    };
    const frontPath = new Path( null, combineOptions<PathOptions>( {
      tandem: options.tandem.createTandem( 'frontPath' )
    }, pathOptions ) );
    const backPath = new Path( null, combineOptions<PathOptions>( {
      tandem: options.tandem.createTandem( 'backPath' )
    }, pathOptions ) );

    // Update the line width
    this.lineWidthProperty.link( lineWidth => {
      frontPath.lineWidth = backPath.lineWidth = lineWidth;
    } );

    // Mutate these to improve performance
    const springPoints: Vector2[] = []; // points in the spring (includes the horizontal ends)
    let frontShape: Shape;
    let backShape: Shape;

    // Changes to these properties require new points (Vector2) and Shapes, because they change
    // the number of points and/or how the points are allocated to frontShape and backShape.
    Multilink.multilink( [
        this.loopsProperty, this.pointsPerLoopProperty,
        this.aspectRatioProperty, this.phaseProperty, this.deltaPhaseProperty
      ],
      ( loops, pointsPerLoop, aspectRatio, phase, deltaPhase ) => {

        // new points and Shapes
        springPoints.length = 0;
        frontShape = new Shape();
        backShape = new Shape();

        // Values of other properties, to improve readability
        const radius = this.radiusProperty.get();
        const xScale = this.xScaleProperty.get();

        // compute the points for the coil
        const coilPoints = []; // {Vector2[]}
        const numberOfCoilPoints = computeNumberOfCoilPoints( loops, pointsPerLoop );
        let index;
        for ( index = 0; index < numberOfCoilPoints; index++ ) {
          const coilX = computeCoilX( index, radius, pointsPerLoop, phase, xScale, options.leftEndLength );
          const coilY = computeCoilY( index, radius, pointsPerLoop, phase, deltaPhase, aspectRatio );
          coilPoints.push( new Vector2( coilX, coilY ) );
        }

        let p; // {Vector2} reusable point, hoisted explicitly
        let wasFront = true; // was the previous point on the front path?

        // Add points to Shapes
        for ( index = 0; index < numberOfCoilPoints; index++ ) {

          // is the current point on the front path?
          const isFront = ( ( 2 * Math.PI * index / pointsPerLoop + phase + deltaPhase ) % ( 2 * Math.PI ) > Math.PI );

          // horizontal line at left end
          if ( index === 0 ) {
            p = new Vector2( 0, coilPoints[ 0 ].y );
            springPoints.push( p );
            if ( isFront ) {
              frontShape.moveToPoint( p );
            }
            else {
              backShape.moveToPoint( p );
            }
          }

          // coil point
          springPoints.push( coilPoints[ index ] );
          if ( isFront ) {
            // we're in the front
            if ( !wasFront && index !== 0 ) {
              // ... and we've just moved to the front
              frontShape.moveToPoint( coilPoints[ index - 1 ] );
            }
            frontShape.lineToPoint( coilPoints[ index ] );
          }
          else {
            // we're in the back
            if ( wasFront && index !== 0 ) {
              // ... and we've just moved to the back
              backShape.moveToPoint( coilPoints[ index - 1 ] );
            }
            backShape.lineToPoint( coilPoints[ index ] );
          }

          wasFront = isFront;
        }

        // horizontal line at right end
        const lastCoilPoint = coilPoints[ numberOfCoilPoints - 1 ];
        p = new Vector2( lastCoilPoint.x + options.rightEndLength, lastCoilPoint.y );
        springPoints.push( p );
        if ( wasFront ) {
          frontShape.lineToPoint( p );
        }
        else {
          backShape.lineToPoint( p );
        }
        assert && assert( springPoints.length === coilPoints.length + 2,
          `missing some points, have ${springPoints.length}, expected ${coilPoints.length}${2}` ); // +2 for horizontal ends

        frontPath.shape = frontShape;
        backPath.shape = backShape;
      } );

    // Changes to these properties can be accomplished by mutating existing points (Vector2) and Shapes,
    // because the number of points remains the same, as does their allocation to frontShape and backShape.
    Multilink.lazyMultilink(
      [ this.radiusProperty, this.xScaleProperty ],
      ( radius, xScale ) => {

        // Values of other properties, to improve readability
        const loops = this.loopsProperty.get();
        const pointsPerLoop = this.pointsPerLoopProperty.get();
        const aspectRatio = this.aspectRatioProperty.get();
        const phase = this.phaseProperty.get();
        const deltaPhase = this.deltaPhaseProperty.get();

        // number of points in the coil
        const numberOfCoilPoints = computeNumberOfCoilPoints( loops, pointsPerLoop );
        assert && assert( numberOfCoilPoints === springPoints.length - 2,
          `unexpected number of coil points: ${numberOfCoilPoints}, expected ${springPoints.length - 2}` ); // -2 for horizontal ends

        // mutate the coil points
        for ( let index = 0; index < numberOfCoilPoints; index++ ) {
          const coilX = computeCoilX( index, radius, pointsPerLoop, phase, xScale, options.leftEndLength );
          const coilY = computeCoilY( index, radius, pointsPerLoop, phase, deltaPhase, aspectRatio );
          springPoints[ index + 1 ].setXY( coilX, coilY );
        }

        // mutate horizontal line at left end
        const firstCoilPoint = springPoints[ 1 ];
        springPoints[ 0 ].setXY( 0, firstCoilPoint.y );

        // mutate horizontal line at right end
        const lastCoilPoint = springPoints[ springPoints.length - 2 ];
        springPoints[ springPoints.length - 1 ].setXY( lastCoilPoint.x + options.rightEndLength, lastCoilPoint.y );

        // Tell shapes that their points have changed.
        frontShape.invalidatePoints();
        backShape.invalidatePoints();
      } );

    // Update the stroke gradients
    Multilink.multilink(
      [ this.radiusProperty, this.aspectRatioProperty ],
      ( radius, aspectRatio ) => {

        const yRadius = radius * aspectRatio;

        frontPath.stroke = new LinearGradient( 0, -yRadius, 0, yRadius )
          .addColorStop( 0, options.middleColor )
          .addColorStop( 0.35, options.frontColor )
          .addColorStop( 0.65, options.frontColor )
          .addColorStop( 1, options.middleColor );

        backPath.stroke = new LinearGradient( 0, -yRadius, 0, yRadius )
          .addColorStop( 0, options.middleColor )
          .addColorStop( 0.5, options.backColor )
          .addColorStop( 1, options.middleColor );
      } );

    assert && assert( !options.children, 'ParametricSpringNode sets children' );
    options.children = [ backPath, frontPath ];

    this.mutate( options );

    if ( SHOW_ORIGIN ) {
      this.addChild( new Circle( 3, { fill: 'red' } ) );
    }

    // support for binder documentation, stripped out in builds and only runs when ?binder is specified
    assert && phet.chipper.queryParameters.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'ParametricSpringNode', this );
  }

  public reset(): void {
    this.loopsProperty.reset();
    this.radiusProperty.reset();
    this.aspectRatioProperty.reset();
    this.pointsPerLoopProperty.reset();
    this.lineWidthProperty.reset();
    this.phaseProperty.reset();
    this.deltaPhaseProperty.reset();
    this.xScaleProperty.reset();
  }
}

/**
 * Gets the number of points in the coil part of the spring.
 */
function computeNumberOfCoilPoints( loops: number, pointsPerLoop: number ): number {
  return loops * pointsPerLoop + 1;
}

/**
 * Computes the x coordinate for a point on the coil.
 */
function computeCoilX( index: number, radius: number, pointsPerLoop: number, phase: number, xScale: number,
                       leftEndLength: number ): number {
  return ( leftEndLength + radius ) + radius * Math.cos( 2 * Math.PI * index / pointsPerLoop + phase ) + xScale * ( index / pointsPerLoop ) * radius;
}

/**
 * Computes the y coordinate for a point on the coil.
 */
function computeCoilY( index: number, radius: number, pointsPerLoop: number, phase: number, deltaPhase: number,
                       aspectRatio: number ): number {
  return aspectRatio * radius * Math.cos( 2 * Math.PI * index / pointsPerLoop + deltaPhase + phase );
}

sceneryPhet.register( 'ParametricSpringNode', ParametricSpringNode );