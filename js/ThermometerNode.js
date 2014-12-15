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
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var Shape = require( 'KITE/Shape' );
  var LinearFunction = require( 'DOT/LinearFunction' );

  /**
   *
   * @param {number} minTemperature
   * @param {number} maxTemperature
   * @param {Property.<number>} temperatureProperty
   * @param {Object} [options]
   * @constructor
   */
  function ThermometerNode( minTemperature, maxTemperature, temperatureProperty, options ) {

    options = _.extend( {
      bulbDiameter: 50,
      tubeWidth: 30,
      tubeHeight: 100,
      lineWidth: 4,
      outlineStroke: 'black',
      tickSpacing: 15,
      majorTickLength: 15,
      minorTickLength: 7.5,
      fluidSphereSpacing: 2, // the empty space between the fluid sphere and the thermometer outline
      fluidRectSpacing: 2, // the empty space between the fluid in the tube and the thermometer outline

      // leave as null to have a transparent background. If a color is given, then an extra Rectangle is created for the background
      backgroundColor: null,

      // all the default colors are shades of red
      fluidMainColor: '#850e0e', // the main color of the shaded sphere and the left side of the tube gradient
      fluidHighlightColor: '#ff7575', // the highlight color of the shaded sphere and the middle of the tube gradient
      fluidRightSideColor: '#c41515' // the right side of the tube gradient
    }, options );

    Node.call( this );

    // assume the center of the bulb is at (0, 0) and let the client code move to the correct place
    var bulbCenterX = 0;
    var bulbCenterY = 0;

    // Angles for the outline of the bulb
    var startAngle = -Math.acos( options.tubeWidth / options.bulbDiameter );
    var endAngle = Math.PI - startAngle;

    // Create the outline for the thermometer
    var shape = new Shape()
      .arc( bulbCenterX, bulbCenterY, options.bulbDiameter / 2, startAngle, endAngle )
      .verticalLineToRelative( -options.tubeHeight );

    var upperLeftCorner = shape.getLastPoint();
    shape.arc( bulbCenterX, upperLeftCorner.y, options.tubeWidth / 2, Math.PI, 0 ).close();

    shape.moveToPoint( upperLeftCorner ).moveToRelative( options.majorTickLength ).horizontalLineToRelative( -options.majorTickLength );
    for ( var i = 0; i < Math.floor( options.tubeHeight / options.tickSpacing ); i++ ) {
      if ( i % 2 === 0 ) {
        shape.moveToRelative( options.minorTickLength, options.tickSpacing ).horizontalLineToRelative( -options.minorTickLength );
      }
      else {
        shape.moveToRelative( options.majorTickLength, options.tickSpacing ).horizontalLineToRelative( -options.majorTickLength );
      }
    }

    var clipTubeRadius = ( options.tubeWidth - options.lineWidth - options.fluidRectSpacing ) / 2;
    var clipBulbRadius = ( options.bulbDiameter - options.lineWidth - options.fluidSphereSpacing ) / 2;
    var clipStartAngle = -Math.acos( clipTubeRadius / clipBulbRadius );
    var clipEndAngle = Math.PI - clipStartAngle;

    // Create clip area for the fluid
    var fluidClipShape = new Shape()
      .arc( bulbCenterX, bulbCenterY, clipBulbRadius, clipStartAngle, clipEndAngle )
      .verticalLineToRelative( -options.tubeHeight );

    var clipUpperLeftCorner = fluidClipShape.getLastPoint();
    fluidClipShape.arc( bulbCenterX, clipUpperLeftCorner.y + options.fluidRectSpacing - options.lineWidth, clipTubeRadius, Math.PI, 0 ).close();

    var outline = new Path( shape,
      {
        stroke: options.outlineStroke,
        lineWidth: options.lineWidth
      } );

    // parameters for the fluid rectangle
    var fluidWidth = options.bulbDiameter;
    var rectangleX = bulbCenterX - options.bulbDiameter / 2;
    var tubeBase = upperLeftCorner.y + options.tubeHeight + options.fluidSphereSpacing;
    var fluidBase = bulbCenterY + options.bulbDiameter / 2;
    var fluidOffset = fluidBase - tubeBase; // the 0 temperature point of the rectangle
    var maxFluidHeight = options.tubeHeight + options.tubeWidth / 2; // max fluid height includes the rounded tip of the tube

    var fluidRectangleGradient = new LinearGradient( rectangleX, 0, rectangleX + fluidWidth, 0 ).
      addColorStop( 0, options.fluidMainColor ).
      addColorStop( 0.5, options.fluidHighlightColor ).
      addColorStop( 0.7, options.fluidHighlightColor ).
      addColorStop( 1, options.fluidRightSideColor );

    var fluidRectangle = new Rectangle( 0, 0, fluidWidth, 0, { fill: fluidRectangleGradient } );
    fluidRectangle.setClipArea( fluidClipShape );

    var temperatureLinearFunction = new LinearFunction( minTemperature, maxTemperature, fluidOffset, maxFluidHeight + fluidOffset );
    temperatureProperty.link( function( temp ) {
      var fluidHeight = temperatureLinearFunction( temp );
      fluidRectangle.setRect( rectangleX, fluidBase - fluidHeight, fluidWidth, fluidHeight );
    } );

    if ( options.backgroundColor ) {
      var backgroundY = upperLeftCorner.y - options.tubeWidth / 2;
      var backgroundHeight = options.tubeHeight + options.tubeWidth / 2;
      var backgroundRectangle = new Rectangle( upperLeftCorner.x, backgroundY, options.tubeWidth, backgroundHeight,
        { fill: options.backgroundColor } );
      backgroundRectangle.setClipArea( shape );
      this.addChild( backgroundRectangle );
    }
    this.addChild( fluidRectangle );
    this.addChild( outline );

    this.mutate( options );
  }

  return inherit( Node, ThermometerNode );
} );