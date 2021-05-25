// Copyright 2015-2021, University of Colorado Boulder

/**
 * ProbeNode is a physical-looking probe with a handle and a circular sensor region. It is used in simulations like
 * Bending Light and Beer's Law Lab to show how much light is being received. It is typically connected to a body
 * with readouts via a wire. The origin is in the center of the sensor.
 *
 * This code was generalized from Bending Light, see https://github.com/phetsims/bending-light/issues/165
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Chandrashekar Bemagoni (Actual Concepts)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../axon/js/DerivedProperty.js';
import Ray2 from '../../dot/js/Ray2.js';
import Vector2 from '../../dot/js/Vector2.js';
import EllipticalArc from '../../kite/js/segments/EllipticalArc.js';
import Shape from '../../kite/js/Shape.js';
import InstanceRegistry from '../../phet-core/js/documentation/InstanceRegistry.js';
import merge from '../../phet-core/js/merge.js';
import Circle from '../../scenery/js/nodes/Circle.js';
import Line from '../../scenery/js/nodes/Line.js';
import Node from '../../scenery/js/nodes/Node.js';
import Path from '../../scenery/js/nodes/Path.js';
import LinearGradient from '../../scenery/js/util/LinearGradient.js';
import PaintColorProperty from '../../scenery/js/util/PaintColorProperty.js';
import RadialGradient from '../../scenery/js/util/RadialGradient.js';
import sceneryPhet from './sceneryPhet.js';

// constants
const DEFAULT_OPTIONS = {
  radius: 50,
  innerRadius: 35,
  handleWidth: 50,
  handleHeight: 30,
  handleCornerRadius: 10,

  /**
   * in radians, the angle of the incoming light.  0 is from the right, PI/2 from the bottom, PI from the left, etc.
   * The default is from the upper-left.  Generally, it is difficult to know the global rotation of the ProbeNode
   * and automatically update the lightAngle when the global rotation changes, so this is up to the developer
   * to set properly.  The light in PhET simulations often comes from the top-left, so please set this value
   * accordingly depending on the context of how the probe is embedded in the simulation.
   */
  lightAngle: 1.35 * Math.PI,
  color: '#008541', // {Color|string} darkish green

  // {null|function(radius:number):Node} Determines what is displayed in the sensor area, the circular cut-out part of
  // the ProbeNode. Set this to null to display nothing in the sensor.
  sensorTypeFunction: glass()
};
assert && Object.freeze( DEFAULT_OPTIONS );

class ProbeNode extends Node {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {}, DEFAULT_OPTIONS, options );

    super();

    // To improve readability
    const radius = options.radius;

    // y coordinate of the bottom of the handle, relative to the origin (center of the sensor)
    const handleBottom = radius + options.handleHeight;

    // Constants that determine the outer Shape of the probe
    const arcExtent = 0.8;
    const handleWidth = options.handleWidth;
    const innerRadius = Math.min( options.innerRadius, options.radius );
    const cornerRadius = options.handleCornerRadius;
    const neckCornerRadius = 10;

    // We must know where the elliptical arc begins, so create an explicit EllipticalArc for that
    // Note: This elliptical arc must match the ellipticalArc call below
    const ellipticalArcStart = new EllipticalArc( new Vector2( 0, 0 ), radius, radius, 0, Math.PI * arcExtent, Math.PI * ( 1 - arcExtent ), false ).start;

    // Creates the Shape for the outside edge of the probe, circular at top with handle at the bottom.
    function createOuterProbeShape() {
      return new Shape()

        // start in the bottom center
        .moveTo( 0, handleBottom )

        // Kite Shape automatically lineTo's to the first point of an arc, so no need to lineTo ourselves
        .arc( -handleWidth / 2 + cornerRadius, handleBottom - cornerRadius, cornerRadius, Math.PI / 2, Math.PI, false )
        .lineTo( -handleWidth / 2, radius + neckCornerRadius )
        .quadraticCurveTo( -handleWidth / 2, radius, ellipticalArcStart.x, ellipticalArcStart.y )

        // Top arc
        // Note: his elliptical arc must match the EllipticalArc above
        .ellipticalArc( 0, 0, radius, radius, 0, Math.PI * arcExtent, Math.PI * ( 1 - arcExtent ), false )

        .quadraticCurveTo( handleWidth / 2, radius, +handleWidth / 2, radius + neckCornerRadius )
        .arc( handleWidth / 2 - cornerRadius, handleBottom - cornerRadius, cornerRadius, 0, Math.PI / 2, false )

        .close();
    }

    // Start with the outer Shape of the probe, and cut out the sensor area.
    const probeShape = createOuterProbeShape()
      .moveTo( innerRadius, 0 )
      .arc( 0, 0, innerRadius, Math.PI * 2, 0, true )
      .close();

    // The light angle is variable so that you can create a probe node that is pointing up or to the side
    const lightAngle = options.lightAngle;

    const center = probeShape.bounds.center;
    const v1 = Vector2.createPolar( 1, lightAngle );
    const intersections = probeShape.intersection( new Ray2( center, v1 ) );

    // take last intersection or zero point, see https://github.com/phetsims/scenery-phet/issues/294
    const lastIntersection = intersections[ intersections.length - 1 ];
    const lastIntersectionPoint = lastIntersection ? lastIntersection.point : Vector2.ZERO;
    const gradientSource = lastIntersectionPoint.plus( v1.timesScalar( 1 ) );

    const v2 = Vector2.createPolar( 1, lightAngle + Math.PI );
    const intersections2 = probeShape.intersection( new Ray2( center, v2 ) );

    // take last intersection or zero point, see https://github.com/phetsims/scenery-phet/issues/294
    const lastIntersection2 = intersections2[ intersections2.length - 1 ];
    const lastIntersectionPoint2 = lastIntersection2 ? lastIntersection2.point : Vector2.ZERO;
    const gradientDestination = lastIntersectionPoint2.plus( v2.timesScalar( 1 ) );

    // @private {Property.<Color>}
    this.brighter5 = new PaintColorProperty( options.color, { luminanceFactor: 0.5 } );
    this.brighter4 = new PaintColorProperty( options.color, { luminanceFactor: 0.4 } );
    this.brighter3 = new PaintColorProperty( options.color, { luminanceFactor: 0.3 } );
    this.brighter2 = new PaintColorProperty( options.color, { luminanceFactor: 0.2 } );
    this.darker2 = new PaintColorProperty( options.color, { luminanceFactor: -0.2 } );
    this.darker3 = new PaintColorProperty( options.color, { luminanceFactor: -0.3 } );

    // The main path of the probe
    const mainPath = new Path( probeShape, {
      stroke: new LinearGradient( gradientSource.x, gradientSource.y, gradientDestination.x, gradientDestination.y )
        .addColorStop( 0.0, this.brighter2 ) // highlight
        .addColorStop( 1.0, this.darker2 ), // shadow
      fill: new LinearGradient( gradientSource.x, gradientSource.y, gradientDestination.x, gradientDestination.y )
        .addColorStop( 0.0, this.brighter5 ) // highlight
        .addColorStop( 0.03, this.brighter4 )
        .addColorStop( 0.07, this.brighter4 )
        .addColorStop( 0.11, this.brighter2 )
        .addColorStop( 0.3, options.color )
        .addColorStop( 0.8, this.darker2 ) // shadows
        .addColorStop( 1.0, this.darker3 ),
      lineWidth: 2
    } );

    // The front flat "surface" of the probe, makes it look 3d by giving the probe a beveled appearance and putting
    // a shiny glare on the top edge.
    const frontPath = new Path( probeShape, {
      fill: options.color,

      // y scale is an empirical function of handle height, to keep bevel at bottom of handle from changing size
      scale: new Vector2( 0.9, 0.93 + ( 0.01 * options.handleHeight / DEFAULT_OPTIONS.handleHeight ) ),
      centerX: mainPath.centerX,
      stroke: new DerivedProperty( [ this.brighter3 ], ( color => {
        return color.withAlpha( 0.5 );
      } ) ),
      lineWidth: 1.2,
      y: 2 // Shift it down a bit to make the face look a bit more 3d
    } );

    const children = [];
    if ( options.sensorTypeFunction ) {
      children.push( options.sensorTypeFunction( radius ) );
    }
    children.push(
      mainPath,
      frontPath
    );

    // Allow the client to add child nodes
    options.children = children.concat( options.children || [] );

    // Allow the client to override mouse and touch area, but fall back to the outline
    const outline = createOuterProbeShape();
    options.mouseArea = options.mouseArea || outline;
    options.touchArea = options.touchArea || outline;

    this.mutate( options );

    // support for binder documentation, stripped out in builds and only runs when ?binder is specified
    assert && phet.chipper.queryParameters.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'ProbeNode', this );
  }

  /**
   * @public
   * @override
   */
  dispose() {
    this.brighter5.dispose();
    this.brighter4.dispose();
    this.brighter3.dispose();
    this.brighter2.dispose();
    this.darker2.dispose();
    this.darker3.dispose();

    super.dispose();
  }
}

/**
 * Creates a value for options.sensorTypeFunction. Shows a shiny reflective interior in the sensor area.
 * @param {Object} [options]
 * @returns {function(radius: number): Node}
 * @public
 * @static
 */
function glass( options ) {

  options = merge( {
    centerColor: 'white',
    middleColor: '#E6F5FF', // light blue
    edgeColor: '#C2E7FF'    // slightly darker blue, like glass
  }, options );

  return function( radius ) {
    return new Circle( radius, {
      fill: new RadialGradient( -radius * 0.15, -radius * 0.15, 0, -radius * 0.15, -radius * 0.20, radius * 0.60 )
        .addColorStop( 0, options.centerColor )
        .addColorStop( 0.4, options.middleColor ) // light blue
        .addColorStop( 1, options.edgeColor ) // slightly darker blue, like glass
    } );
  };
}

/**
 * Creates a value for options.sensorTypeFunction. Shows a crosshairs in the sensor area.
 * @param {Object} [options]
 * @returns {function(radius: number): Node}
 * @public
 * @static
 */
function crosshairs( options ) {

  options = merge( {
    stroke: 'black',
    lineWidth: 3,

    // The amount of blank space visible at the intersection of the 2 crosshairs lines
    intersectionRadius: 8
  }, options );

  return function( radius ) {
    const lineOptions = { stroke: options.stroke, lineWidth: options.lineWidth };
    return new Node( {
      children: [
        new Line( -radius, 0, -options.intersectionRadius, 0, lineOptions ),
        new Line( +radius, 0, +options.intersectionRadius, 0, lineOptions ),
        new Line( 0, -radius, 0, -options.intersectionRadius, lineOptions ),
        new Line( 0, +radius, 0, +options.intersectionRadius, lineOptions ) ]
    } );
  };
}

// @public {read-only}, make the defaults publicly available to clients in case they need to make
// customizations, such as 0.9 x the default width
ProbeNode.DEFAULT_OPTIONS = DEFAULT_OPTIONS;

// @public pre-defined functions for creating a value for options.sensorTypeFunction
ProbeNode.glass = glass;
ProbeNode.crosshairs = crosshairs;

sceneryPhet.register( 'ProbeNode', ProbeNode );
export default ProbeNode;