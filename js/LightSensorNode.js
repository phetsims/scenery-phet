//  Copyright 2002-2014, University of Colorado Boulder

/**
 * A light sensor probe, used in simulations like Bending Light and Beer's Law Lab to show how much light is being
 * received. It is typically connected to a body with readouts with a curved wire.  The origin is in the center of the
 * circular part of the sensor (which is not vertically symmetrical).
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

  /**
   * Constructor for the LightSensorNode
   * @constructor
   */
  function LightSensorNode() {

    var width = 100;

    // The shape of the outer body, circular at top with a handle at the bottom
    var sensorShape = new Shape()
      .ellipticalArc( width / 2, width / 2, width / 2, width / 2, 0, Math.PI * 0.8, Math.PI * 0.2, false )
      .quadraticCurveTo( width * 0.84, width * 0.87, width * 0.82, width )
      .quadraticCurveTo( width * 0.81, width * 1.15, width * 0.80, width * 1.30 )
      .quadraticCurveTo( width * 0.80, width * 1.51, width * 0.65, width * 1.51 )
      .quadraticCurveTo( width * 0.50, width * 1.51, width * 0.35, width * 1.51 )
      .quadraticCurveTo( width * 0.20, width * 1.51, width * 0.20, width * 1.30 )
      .quadraticCurveTo( width * 0.19, width * 1.15, width * 0.18, width )
      .quadraticCurveTo( width * 0.16, width * 0.87, width * 0.11, width * 0.82 )
      .close();

    var outerShapePath = new Path( sensorShape, {
      stroke: new LinearGradient( 0, 0, 0, width * 1.51 )
        .addColorStop( 0, '#408260' ) // dark green
        .addColorStop( 1, '#005D2D' ), // darker green 
      fill: new LinearGradient( 0, 0, 0, width * 1.51 )
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
      y: width * 0.05
    } );
    var innerCirclePath = new Path( Shape.circle( width * 0.50, width * 0.50, width * 0.35 ), {
      fill: new RadialGradient( width * 0.35, width * 0.175, 0, width * 0.35, width * 0.70, width * 0.60 )
        .addColorStop( 0, 'white' )
        .addColorStop( 0.4, '#E6F5FF' ) // light blue
        .addColorStop( 1, '#C2E7FF' ), // darker blue, like glass
      centerX: innerPath.centerX,
      centerY: width * 0.50
    } );

    Node.call( this, {
      children: [ outerShapePath, innerPath, innerCirclePath ],
      cursor: 'pointer'
    } );
  }

  return inherit( Node, LightSensorNode );
} );