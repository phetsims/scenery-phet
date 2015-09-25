//  Copyright 2002-2014, University of Colorado Boulder

/**
 * A physical-looking probe with a handle and a semicircular sensor region, used in simulations like Bending Light and
 * Beer's Law Lab to show how much light is being received. It is typically connected to a body with readouts with a
 * curved wire. The origin is in the center of the circular part of the sensor (which is not vertically symmetrical).
 *
 * This code was generalized from Bending Light, see https://github.com/phetsims/bending-light/issues/165
 *
 * TODO: This is under development and not ready for review or usage in simulations other than Bending Light.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Chandrashekar Bemagoni (Actual Concepts)
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Shape = require( 'KITE/Shape' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Vector2 = require( 'DOT/Vector2' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var RadialGradient = require( 'SCENERY/util/RadialGradient' );
  var Color = require( 'SCENERY/util/Color' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Circle = require( 'SCENERY/nodes/Circle' );

  // Glass is one of the probe types, shows a shiny reflective interior in the central circle
  var glass = function( options ) {
    var GLASS_DEFAULTS = {
      centerColor: 'white',
      middleColor: '#E6F5FF', // light blue
      edgeColor: '#C2E7FF'    // slightly darker blue, like glass
    };
    options = _.extend( GLASS_DEFAULTS, options );
    return function( radius ) {
      return new Circle( radius, {
        fill: new RadialGradient( -radius * 0.15, -radius * 0.15, 0, -radius * 0.15, -radius * 0.20, radius * 0.60 )
          .addColorStop( 0, options.centerColor )
          .addColorStop( 0.4, options.middleColor ) // light blue
          .addColorStop( 1, options.edgeColor ) // slightly darker blue, like glass
      } );
    };
  };

  // Crosshairs cane be shown in the central circle
  var crosshairs = function( options ) {
    var CROSSHAIRS_DEFAULTS = {
      stroke: 'black',
      lineWidth: 3,

      // The amount of blank space visible at the intersection of the 2 crosshairs lines
      intersectionRadius: 8
    };
    options = _.extend( CROSSHAIRS_DEFAULTS, options );
    return function( radius ) {

      var lineOptions = { stroke: options.stroke, lineWidth: options.lineWidth };
      return new Node( {
        children: [
          new Line( -radius, 0, -options.intersectionRadius, 0, lineOptions ),
          new Line( +radius, 0, +options.intersectionRadius, 0, lineOptions ),
          new Line( 0, -radius, 0, -options.intersectionRadius, lineOptions ),
          new Line( 0, +radius, 0, +options.intersectionRadius, lineOptions ) ]
      } );
    };
  };

  // constants
  var DEFAULT_OPTIONS = {
    radius: 50,
    innerRadius: 35,
    handleWidth: 50,
    handleHeight: 30,
    handleCornerRadius: 10,
    lightAngle: 4.25, // in radians, the angle of the incoming light.  0 is from the right, PI/2 from the bottom, 
                      // PI from the left, etc.  The default is from the upper-left 
    color: '#008541', // darkish green

    // The circular part of the ProbeNode is called the sensor, where it receives light or has crosshairs, etc.
    // or null for an empty region
    sensorType: glass()
  };

  /**
   * Constructor for the ProbeNode
   * @param {Object} [options]
   * @constructor
   */
  function ProbeNode( options ) {

    options = _.extend( _.clone( DEFAULT_OPTIONS ), options );

    var color = new Color( options.color );

    // To improve readability
    var radius = options.radius;

    // the top of the handle, below the circle at the top of the sensor
    var handleBottom = radius + options.handleHeight;

    // The shape of the outer body, circular at top with a handle at the bottom
    var arcExtent = 0.8;
    var handleWidth = options.handleWidth;
    var innerRadius = Math.min( options.innerRadius, options.radius );
    var cornerRadius = options.handleCornerRadius;
    var sensorShape = new Shape()

    // start in the bottom center
      .moveTo( 0, handleBottom )

      .lineTo( -handleWidth / 2 + cornerRadius, handleBottom )
      .arc( -handleWidth / 2 + cornerRadius, handleBottom - cornerRadius, cornerRadius, Math.PI / 2, Math.PI, false )
      .lineTo( -handleWidth / 2, radius )

      // Top arc
      .ellipticalArc( 0, 0, radius, radius, 0, Math.PI * arcExtent, Math.PI * (1 - arcExtent), false )

      .lineTo( handleWidth / 2, radius )
      .lineTo( handleWidth / 2, handleBottom - cornerRadius )
      .arc( handleWidth / 2 - cornerRadius, handleBottom - cornerRadius, cornerRadius, 0, Math.PI / 2, false )

      .lineTo( 0, handleBottom )
      .moveTo( innerRadius, 0 )
      .arc( 0, 0, innerRadius, Math.PI * 2, 0, true )
      .close();

    // The light angle is variable so that you can create a probe node that is pointing up or to the side
    var lightAngle = options.lightAngle;
    var lightOrigin = Vector2.createPolar( radius / 2, lightAngle );
    var lightDestination = Vector2.createPolar( handleBottom, lightAngle + Math.PI );
    var gradientSource = lightOrigin;
    var gradientDestination = lightDestination;

    var outerShapePath = new Path( sensorShape, {
      stroke: new LinearGradient( gradientSource.x, gradientSource.y, gradientDestination.x, gradientDestination.y )
        .addColorStop( 0.0, color.colorUtilsBrightness( -0.1 ) ) // dark 
        .addColorStop( 1.0, color.colorUtilsBrightness( -0.2 ) ), // darker 
      fill: new LinearGradient( gradientSource.x, gradientSource.y, gradientDestination.x, gradientDestination.y )
        .addColorStop( 0.0, color.colorUtilsBrightness( +0.4 ) ) // light
        .addColorStop( 0.3, color.colorUtilsBrightness( +0.2 ) ) // medium light
        .addColorStop( 1.0, color.colorUtilsBrightness( -0.1 ) ), // less light 
      lineWidth: 2
    } );

    // the front flat "surface" of the sensor, makes it look 3d by putting a shiny glare on the top edge
    var innerPath = new Path( sensorShape, {
      fill: options.color,
      lineWidth: 2,
      scale: new Vector2( 0.9, 0.93 ),
      centerX: outerShapePath.centerX,

      // Shift it down a bit to make the face look a bit more 3d
      y: 2
    } );

    var children = [];

    if ( options.sensorType ) {
      children.push( options.sensorType( radius ) );
    }

    children.push( outerShapePath, innerPath );

    Node.call( this, {
      children: children
    } );

    this.mutate( options );
  }

  return inherit( Node, ProbeNode, {},

    // statics
    {

      // @public {read-only}, make the defaults publicly available to clients in case they need to make
      // customizations, such as 0.9 x the default width
      DEFAULT_OPTIONS: DEFAULT_OPTIONS,

      // Sensor types
      // @public 
      crosshairs: crosshairs,
      glass: glass
    } );
} );