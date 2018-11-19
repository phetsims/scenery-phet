// Copyright 2015-2018, University of Colorado Boulder

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
define( function( require ) {
  'use strict';

  // modules
  var Circle = require( 'SCENERY/nodes/Circle' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var Node = require( 'SCENERY/nodes/Node' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Property = require( 'AXON/Property' );
  var Range = require( 'DOT/Range' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var Shape = require( 'KITE/Shape' );
  var Tandem = require( 'TANDEM/Tandem' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var SHOW_ORIGIN = false; // {boolean} draws a red circle at the origin, for layout debugging

  /**
   * @param {Object} [options]
   * @constructor
   */
  function ParametricSpringNode( options ) {

    options = _.extend( {

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
      tandem: Tandem.optional
    }, options );

    var self = this;

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
    var pathOptions = {
      boundsMethod: options.pathBoundsMethod,
      lineCap: 'round',
      lineJoin: 'round'
    };
    var frontPath = new Path( null, _.extend( { tandem: options.tandem.createTandem( 'frontPath' ) }, pathOptions ) );
    var backPath = new Path( null, _.extend( { tandem: options.tandem.createTandem( 'backPath' ) }, pathOptions ) );

    // Update the line width
    this.lineWidthProperty.link( function( lineWidth ) {
      frontPath.lineWidth = backPath.lineWidth = lineWidth;
    } );

    // Mutate these to improve performance
    var springPoints = []; // {Vector2[]} points in the spring (includes the horizontal ends)
    var frontShape; // {Shape}
    var backShape; // {Shape}

    // Changes to these properties require new points (Vector2) and Shapes, because they change
    // the number of points and/or how the points are allocated to frontShape and backShape.
    Property.multilink( [
        this.loopsProperty, this.pointsPerLoopProperty,
        this.aspectRatioProperty, this.phaseProperty, this.deltaPhaseProperty
      ],
      function( loops, pointsPerLoop, aspectRatio, phase, deltaPhase ) {

        // new points and Shapes
        springPoints.length = 0;
        frontShape = new Shape();
        backShape = new Shape();

        // Values of other properties, to improve readability
        var radius = self.radiusProperty.get();
        var xScale = self.xScaleProperty.get();

        // compute the points for the coil
        var coilPoints = []; // {Vector2[]}
        var numberOfCoilPoints = computeNumberOfCoilPoints( loops, pointsPerLoop );
        var index;
        for ( index = 0; index < numberOfCoilPoints; index++ ) {
          var coilX = computeCoilX( index, radius, pointsPerLoop, phase, xScale, options.leftEndLength );
          var coilY = computeCoilY( index, radius, pointsPerLoop, phase, deltaPhase, aspectRatio );
          coilPoints.push( new Vector2( coilX, coilY ) );
        }

        var p; // {Vector2} reusable point, hoisted explicitly
        var wasFront = true; // was the previous point on the front path?

        // Add points to Shapes
        for ( index = 0; index < numberOfCoilPoints; index++ ) {

          // is the current point on the front path?
          var isFront = ( ( 2 * Math.PI * index / pointsPerLoop + phase + deltaPhase ) % ( 2 * Math.PI ) > Math.PI );

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
        var lastCoilPoint = coilPoints[ numberOfCoilPoints - 1 ];
        p = new Vector2( lastCoilPoint.x + options.rightEndLength, lastCoilPoint.y );
        springPoints.push( p );
        if ( wasFront ) {
          frontShape.lineToPoint( p );
        }
        else {
          backShape.lineToPoint( p );
        }
        assert && assert( springPoints.length === coilPoints.length + 2,
          'missing some points, have ' + springPoints.length + ', expected ' + coilPoints.length + 2 ); // +2 for horizontal ends

        frontPath.shape = frontShape;
        backPath.shape = backShape;
      } );

    // Changes to these properties can be accomplished by mutating existing points (Vector2) and Shapes,
    // because the number of points remains the same, as does their allocation to frontShape and backShape.
    Property.lazyMultilink( [ this.radiusProperty, this.xScaleProperty ],
      function( radius, xScale ) {

        // Values of other properties, to improve readability
        var loops = self.loopsProperty.get();
        var pointsPerLoop = self.pointsPerLoopProperty.get();
        var aspectRatio = self.aspectRatioProperty.get();
        var phase = self.phaseProperty.get();
        var deltaPhase = self.deltaPhaseProperty.get();

        // number of points in the coil
        var numberOfCoilPoints = computeNumberOfCoilPoints( loops, pointsPerLoop );
        assert && assert( numberOfCoilPoints === springPoints.length - 2,
          'unexpected number of coil points: ' + numberOfCoilPoints + ', expected ' + ( springPoints.length - 2 ) ); // -2 for horizontal ends

        // mutate the coil points
        for ( var index = 0; index < numberOfCoilPoints; index++ ) {
          var coilX = computeCoilX( index, radius, pointsPerLoop, phase, xScale, options.leftEndLength );
          var coilY = computeCoilY( index, radius, pointsPerLoop, phase, deltaPhase, aspectRatio );
          springPoints[ index + 1 ].setXY( coilX, coilY );
        }

        // mutate horizontal line at left end
        var firstCoilPoint = springPoints[ 1 ];
        springPoints[ 0 ].setXY( 0, firstCoilPoint.y );

        // mutate horizontal line at right end
        var lastCoilPoint = springPoints[ springPoints.length - 2 ];
        springPoints[ springPoints.length - 1 ].setXY( lastCoilPoint.x + options.rightEndLength, lastCoilPoint.y );

        // Tell shapes that their points have changed.
        frontShape.invalidatePoints();
        backShape.invalidatePoints();
      } );

    // Update the stroke gradients
    Property.multilink( [ this.radiusProperty, this.aspectRatioProperty ],
      function( radius, aspectRatio ) {

        var yRadius = radius * aspectRatio;

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

    options.children = [ backPath, frontPath ];
    Node.call( this, options );

    if ( SHOW_ORIGIN ) {
      this.addChild( new Circle( 3, { fill: 'red' } ) );
    }
  }

  sceneryPhet.register( 'ParametricSpringNode', ParametricSpringNode );

  // Gets the number of points in the coil part of the spring.
  var computeNumberOfCoilPoints = function( loops, pointsPerLoop ) {
    return loops * pointsPerLoop + 1;
  };

  // Computes the x coordinate for a point on the coil.
  var computeCoilX = function( index, radius, pointsPerLoop, phase, xScale, leftEndLength ) {
    return ( leftEndLength + radius ) + radius * Math.cos( 2 * Math.PI * index / pointsPerLoop + phase ) + xScale * (index / pointsPerLoop) * radius;
  };

  // Computes the y coordinate for a point on the coil.
  var computeCoilY = function( index, radius, pointsPerLoop, phase, deltaPhase, aspectRatio ) {
    return aspectRatio * radius * Math.cos( 2 * Math.PI * index / pointsPerLoop + deltaPhase + phase );
  };

  return inherit( Node, ParametricSpringNode, {

    // @public
    reset: function() {
      this.loopsProperty.reset();
      this.radiusProperty.reset();
      this.aspectRatioProperty.reset();
      this.pointsPerLoopProperty.reset();
      this.lineWidthProperty.reset();
      this.phaseProperty.reset();
      this.deltaPhaseProperty.reset();
      this.xScaleProperty.reset();
    }
  } );
} );
