//  Copyright 2002-2014, University of Colorado Boulder

/**
 * A light sensor probe, used in simulations like Bending Light and Beer's Law Lab to show how much light is being
 * received. It is typically connected to a body with readouts with a curved wire.  The origin is in the center of the
 * circular part of the sensor (which is not vertically symmetrical).
 *
 * TODO: This is under development and not ready for review or usage in simulations other than Bending Light.
 *
 * @author Sam Reid (PhET Interactive Simulations)
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

    // add sensor node
    var sensorShape = new Shape()
      .ellipticalArc( 50, 50, 50, 50, 0, Math.PI * 0.8, Math.PI * 0.2, false )
      .quadraticCurveTo( 84, 87, 82, 100 )
      .quadraticCurveTo( 81, 115, 80, 130 )
      .quadraticCurveTo( 80, 151, 65, 151 )
      .quadraticCurveTo( 50, 151, 35, 151 )
      .quadraticCurveTo( 20, 151, 20, 130 )
      .quadraticCurveTo( 19, 115, 18, 100 )
      .quadraticCurveTo( 16, 87, 11, 82 )
      .close();
    var sensorOuterShape = new Path( sensorShape, {
      stroke: new LinearGradient( 0, 0, 0, 151 )
        .addColorStop( 0, '#408260' )
        .addColorStop( 1, '#005D2D' ),
      fill: new LinearGradient( 0, 0, 0, 151 )
        .addColorStop( 0, '#7CCAA2' )
        .addColorStop( 0.3, '#009348' )
        .addColorStop( 1, '#008B44' ),
      lineWidth: 2
    } );

    var sensorInnerShape = new Path( sensorShape, {
      fill: '#008541',
      lineWidth: 2,
      scale: new Vector2( 0.9, 0.93 ),
      centerX: sensorOuterShape.centerX,
      y: 5
    } );
    var sensorInnerCircle = new Path( new Shape().circle( 50, 50, 35 ), {
      fill: new RadialGradient( 35, 17.5, 0, 35, 70, 60 )
        .addColorStop( 0, 'white' )
        .addColorStop( 0.4, '#E6F5FF' )
        .addColorStop( 1, '#C2E7FF' ),
      centerX: sensorInnerShape.centerX,
      centerY: 50
    } );

    Node.call( this, {
      children: [ sensorOuterShape, sensorInnerShape, sensorInnerCircle ],
      cursor: 'pointer'
    } );
  }

  return inherit( Node, LightSensorNode );
} );