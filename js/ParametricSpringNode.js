// Copyright 2015-2021, University of Colorado Boulder

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
 * The "Experimental" screen provides an extensive test harness for ParametricSpringNode.
 * Run with query parameter "exp" to add the "Experimental" screen to the sim.
 *
 * @author Martin Veillette (Berea College)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../axon/js/NumberProperty.js';
import Property from '../../axon/js/Property.js';
import Range from '../../dot/js/Range.js';
import Vector2 from '../../dot/js/Vector2.js';
import Shape from '../../kite/js/Shape.js';
import InstanceRegistry from '../../phet-core/js/documentation/InstanceRegistry.js';
import merge from '../../phet-core/js/merge.js';
import Circle from '../../scenery/js/nodes/Circle.js';
import Node from '../../scenery/js/nodes/Node.js';
import Path from '../../scenery/js/nodes/Path.js';
import LinearGradient from '../../scenery/js/util/LinearGradient.js';
import Tandem from '../../tandem/js/Tandem.js';
import sceneryPhet from './sceneryPhet.js';

// constants
const SHOW_ORIGIN = false; // {boolean} draws a red circle at the origin, for layout debugging

class ParametricSpringNode extends Node {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {

      // {Color|string} colors used for the gradient strokes. middleColor is the dominant color.
      frontColor: 'lightGray',
      middleColor: 'gray',
      backColor: 'black',

      // {number} length of the horizontal line added to the left end of the coil
      leftEndLength: 15,

      // {number} length of the horizontal line added to the right end of the coil
      rightEndLength: 25,

      // {number} number of loops in the coil
      loops: 10,

      // {number} number of points used to approximate 1 loop of the coil
      pointsPerLoop: 40,

      // {number} radius of a loop with aspect ratio of 1:1
      radius: 10,

      // {number} y:x aspect ratio of the loop radius
      aspectRatio: 4,

      // {number} lineWidth used to stroke the Paths
      lineWidth: 3,

      // {number} phase angle of where the loop starts, period is (0,2*PI) radians, counterclockwise
      phase: Math.PI,

      // {number} responsible for the leaning of the coil, variation on a Lissjoue curve, period is (0,2*PI) radians
      deltaPhase: Math.PI / 2,

      // {number} multiplier for radius in the x dimensions, makes the coil appear to get longer
      xScale: 2.5,

      // {string} method used to compute bounds for scenery.Path components, see Path.boundsMethod
      pathBoundsMethod: 'accurate',

      // phet-io
      tandem: Tandem.OPTIONAL
    }, options );

    super();

    // @public
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
    const pathOptions = {
      boundsMethod: options.pathBoundsMethod,
      lineCap: 'round',
      lineJoin: 'round'
    };
    const frontPath = new Path( null, merge( { tandem: options.tandem.createTandem( 'frontPath' ) }, pathOptions ) );
    const backPath = new Path( null, merge( { tandem: options.tandem.createTandem( 'backPath' ) }, pathOptions ) );

    // Update the line width
    this.lineWidthProperty.link( lineWidth => {
      frontPath.lineWidth = backPath.lineWidth = lineWidth;
    } );

    // Mutate these to improve performance
    const springPoints = []; // {Vector2[]} points in the spring (includes the horizontal ends)
    let frontShape; // {Shape}
    let backShape; // {Shape}

    // Changes to these properties require new points (Vector2) and Shapes, because they change
    // the number of points and/or how the points are allocated to frontShape and backShape.
    Property.multilink( [
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
    Property.lazyMultilink(
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
    Property.multilink(
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

  // @public
  reset() {
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
 * @param {number} loops
 * @param {number} pointsPerLoop
 * @returns {number}
 */
function computeNumberOfCoilPoints( loops, pointsPerLoop ) {
  return loops * pointsPerLoop + 1;
}

/**
 * Computes the x coordinate for a point on the coil.
 * @param {number} index
 * @param {number} radius
 * @param {number} pointsPerLoop
 * @param {number} phase
 * @param {number} xScale
 * @param {number} leftEndLength
 * @returns {number}
 */
function computeCoilX( index, radius, pointsPerLoop, phase, xScale, leftEndLength ) {
  return ( leftEndLength + radius ) + radius * Math.cos( 2 * Math.PI * index / pointsPerLoop + phase ) + xScale * ( index / pointsPerLoop ) * radius;
}

/**
 * Computes the y coordinate for a point on the coil.
 * @param {number} index
 * @param {number} radius
 * @param {number} pointsPerLoop
 * @param {number} phase
 * @param {number} deltaPhase
 * @param {number} aspectRatio
 * @returns {number}
 */
function computeCoilY( index, radius, pointsPerLoop, phase, deltaPhase, aspectRatio ) {
  return aspectRatio * radius * Math.cos( 2 * Math.PI * index / pointsPerLoop + deltaPhase + phase );
}

sceneryPhet.register( 'ParametricSpringNode', ParametricSpringNode );
export default ParametricSpringNode;