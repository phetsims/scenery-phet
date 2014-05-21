// Copyright 2002-2014, University of Colorado Boulder

/**
 * Thermometer node, see https://github.com/phetsims/scenery-phet/issues/43
 *
 * @author Aaron Davis
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );

  function ThermometerNode( minTemperature, maxTemperature, temperatureProperty, options ) {

    options = _.extend( {
      children: [],
      bulbDiameter: 50,
      tubeWidth: 30,
      tubeHeight: 100,
      lineWidth: 5,
      stroke: 'black'
    }, options );

    Node.call( this, options );

    var startAngle = -Math.acos( options.tubeWidth / options.bulbDiameter);
    var endAngle = Math.PI - startAngle;

    var shape = new Shape()
      .arc( options.centerX, options.centerY, options.bulbDiameter / 2, startAngle, endAngle )
      .verticalLineToRelative( -options.tubeHeight );

    var lastPoint = shape.getLastPoint();
    shape.arc( lastPoint.x + options.tubeWidth / 2, lastPoint.y, options.tubeWidth / 2, Math.PI, 0 )
      .verticalLineToRelative( options.tubeHeight );

    var bottomCurve = new Path( shape,
      {
        stroke: options.stroke,
        lineWidth: options.lineWidth,
        lineCap: 'round'
      } );

    this.addChild( bottomCurve );
  }

  return inherit( Node, ThermometerNode );
} );