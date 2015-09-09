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

  // constants
  var DEFAULT_OPTIONS = {
    radius: 50,
    handleWidth: 50,
    handleHeight: 30,
    handleCornerRadius: 30,
    color: '#008541' // darkish green
  };

  /**
   * Constructor for the ProbeNode
   * @constructor
   */
  function ProbeNode( options ) {

    options = _.extend( _.clone( DEFAULT_OPTIONS ), options );

    var color = new Color( options.color );

    // To improve readability
    var radius = options.radius;
    var height = radius;

    // the top of the handle, below the circle at the top of the sensor
    var handleBottom = radius + options.handleHeight;

    // The shape of the outer body, circular at top with a handle at the bottom
    var arcExtent = 0.8;
    var sensorShape = new Shape()

    // start in the bottom center
      .moveTo( 0, handleBottom )

      .lineTo( -options.handleWidth / 2, handleBottom )
      .lineTo( -options.handleWidth / 2, radius )
      //.lineTo( -radius * 0.39 * 2, h * 0.32 )

      // Top arc
      .ellipticalArc( 0, 0, radius, radius, 0, Math.PI * arcExtent, Math.PI * (1 - arcExtent), false )

      .lineTo( options.handleWidth / 2, radius )
      .lineTo( options.handleWidth / 2, handleBottom )

      //.lineTo( radius * 0.32 * 2, h * 0.50 )
      //.lineTo( radius * 0.30 * 2, h * 0.80 )
      //.lineTo( radius * 0.15 * 2, handleBottom )
      //.lineTo( 0, handleBottom )

      .close();

    var outerShapePath = new Path( sensorShape, {
      stroke: new LinearGradient( -radius / 2, -radius / 2, -radius / 2, handleBottom )
        .addColorStop( 0.0, color.colorUtilsBrightness( -0.1 ) ) // dark 
        .addColorStop( 1.0, color.colorUtilsBrightness( -0.2 ) ), // darker 
      fill: new LinearGradient( -radius / 2, -radius / 2, -radius / 2, handleBottom )
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

    var innerCirclePath = new Path( new Shape().ellipticalArc( 0, 0, radius * 0.35 * 2, radius * 0.35 * 2, Math.PI, 0, Math.PI * 2, false ), {
      fill: new RadialGradient( -radius * 0.15, -height * 100 / 151 * 0.325, 0, -radius * 0.15, -radius * 0.20, radius * 0.60 )
        .addColorStop( 0, 'white' )
        .addColorStop( 0.4, '#E6F5FF' ) // light blue
        .addColorStop( 1, '#C2E7FF' ), // slightly darker blue, like glass
      centerX: innerPath.centerX
    } );

    Node.call( this, {
      children: [ outerShapePath, innerPath, innerCirclePath ]
    } );

    this.mutate( options );
  }

  return inherit( Node, ProbeNode, {},

    // statics
    {

      // @public {read-only}, make the defaults publicly available to clients in case they need to make
      // customizations, such as 0.9 x the default width
      DEFAULT_OPTIONS: DEFAULT_OPTIONS
    } );
} );