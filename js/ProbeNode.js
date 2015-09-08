//  Copyright 2002-2014, University of Colorado Boulder

/**
 * A light sensor probe, used in simulations like Bending Light and Beer's Law Lab to show how much light is being
 * received. It is typically connected to a body with readouts with a curved wire.  The origin is in the center of the
 * circular part of the sensor (which is not vertically symmetrical).
 *
 * This code was generalized from Bending Light, see https://github.com/phetsims/bending-light/issues/165
 *
 * TODO: This is under development and not ready for review or usage in simulations other than Bending Light.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Chandrashekar Bemagoni (Actual Concepts)
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

  // constants
  var DEFAULTS = {
    width: 100,
    height: 151 
  };

  /**
   * Constructor for the ProbeNode
   * @constructor
   */
  function ProbeNode( options ) {

    options = _.extend( _.clone( DEFAULTS ), options );

    // To improve readability
    var width = options.width;
    var height = options.height;

    // the top of the handle, below the circle at the top of the sensor
    var handleTop = height - width / 2;

    // The shape of the outer body, circular at top with a handle at the bottom
    var sensorShape = new Shape()
      .ellipticalArc( 0, 0, width * 0.5, width * 0.5, 0, Math.PI * 0.8, Math.PI * 0.2, false )
      .quadraticCurveTo( width * 0.34, width * 0.37, width * 0.32, width * 0.5 )
      .quadraticCurveTo( width * 0.31, handleTop, width * 0.30, width * 0.8 )
      .quadraticCurveTo( width * 0.30, handleTop, width * 0.15, handleTop )
      .quadraticCurveTo( width * 0.00, handleTop, -width * 0.15, handleTop )
      .quadraticCurveTo( -width * 0.30, handleTop, -width * 0.30, width * 0.80 )
      .quadraticCurveTo( -width * 0.31, width * 0.65, -width * 0.32, width * 0.5 )
      .quadraticCurveTo( -width * 0.34, width * 0.37, -width * 0.39, width * 0.32 )
      .close();

    var outerShapePath = new Path( sensorShape, {
      stroke: new LinearGradient( -width / 2, -width / 2, -width / 2, handleTop )
        .addColorStop( 0, '#408260' ) // dark green
        .addColorStop( 1, '#005D2D' ), // darker green 
      fill: new LinearGradient( -width / 2, -width / 2, -width / 2, handleTop )
        .addColorStop( 0, '#7CCAA2' ) // light green
        .addColorStop( 0.3, '#009348' ) // medium green
        .addColorStop( 1, '#008B44' ), // another medium green 
      lineWidth: 2
    } );

    // the front flat "surface" of the sensor, makes it look 3d by putting a shiny glare on the top edge
    var innerPath = new Path( sensorShape, {
      fill: '#008541', // darkish green
      lineWidth: 2,
      scale: new Vector2( 0.9, 0.93 ),
      centerX: outerShapePath.centerX,

      // Shift it down a bit to make the face look a bit more 3d
      y: 2
    } );

    var innerCirclePath = new Path( Shape.circle( 0, 0, width * 0.35 ), {
      fill: new RadialGradient( -width * 0.15, -width * 0.325, 0, -width * 0.15, width * 0.20, width * 0.60 )
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
      DEFAULTS: DEFAULTS
    } );
} );