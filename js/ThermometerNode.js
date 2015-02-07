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
  var ShadedSphereNode = require( 'SCENERY_PHET/ShadedSphereNode' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var Shape = require( 'KITE/Shape' );
  var LinearFunction = require( 'DOT/LinearFunction' );

  // constants
  // center of the bulb is at (0,0), let the client code move to the correct position
  var BULB_CENTER_X = 0;
  var BULB_CENTER_Y = 0;

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
      //TODO why do we need separate options for the sphere and tube? this looks strange, eg in Friction
      fluidSphereSpacing: 2, // the empty space between the fluid sphere and the thermometer outline
      fluidRectSpacing: 2, // the empty space between the fluid in the tube and the thermometer outline

      // leave as null to have a transparent background. If a color is given, then an extra Rectangle is created for the background
      backgroundColor: null,

      // all the default colors are shades of red
      fluidMainColor: '#850e0e', // the main color of the shaded sphere and the left side of the tube gradient
      fluidHighlightColor: '#ff7575', // the highlight color of the shaded sphere and the middle of the tube gradient
      fluidRightSideColor: '#c41515' // the right side of the tube gradient, not used currently
    }, options );

    Node.call( this );

    // Create a shaded sphere to act as the bulb fill
    var fluidSphereDiameter = options.bulbDiameter - options.lineWidth - options.fluidSphereSpacing; //TODO should this be options.lineWidth/2 ?
    var fluidSphere = new ShadedSphereNode( fluidSphereDiameter, {
      centerX: BULB_CENTER_X,
      centerY: BULB_CENTER_Y,
      mainColor: options.fluidMainColor,
      highlightColor: options.fluidHighlightColor,
      highlightXOffset: -0.2,
      highlightYOffset: 0.2,
      rotation: Math.PI / 2
    } );

    // Angles for the outline of the bulb
    var bulbStartAngle = -Math.acos( options.tubeWidth / options.bulbDiameter );
    var bulbEndAngle = Math.PI - bulbStartAngle;

    // Create the outline for the thermometer, starting with the bulb
    var outlineShape = new Shape()
      .arc( BULB_CENTER_X, BULB_CENTER_Y, options.bulbDiameter / 2, bulbStartAngle, bulbEndAngle )
      .verticalLineToRelative( -options.tubeHeight );
    var bulbUpperLeftCorner = outlineShape.getLastPoint();
    outlineShape.arc( bulbUpperLeftCorner.x + options.tubeWidth / 2, bulbUpperLeftCorner.y, options.tubeWidth / 2, Math.PI, 0 )
      .verticalLineToRelative( options.tubeHeight ).close();
    outlineShape.moveToPoint( bulbUpperLeftCorner ).moveToRelative( options.majorTickLength ).horizontalLineToRelative( -options.majorTickLength );
    // tick marks
    for ( var i = 0; i < Math.floor( options.tubeHeight / options.tickSpacing ); i++ ) {
      if ( i % 2 === 0 ) {
        outlineShape.moveToRelative( options.minorTickLength, options.tickSpacing ).horizontalLineToRelative( -options.minorTickLength );
      }
      else {
        outlineShape.moveToRelative( options.majorTickLength, options.tickSpacing ).horizontalLineToRelative( -options.majorTickLength );
      }
    }
    var outline = new Path( outlineShape, {
      stroke: options.outlineStroke,
      lineWidth: options.lineWidth
    } );

    var fluidWidth = options.tubeWidth - options.lineWidth - options.fluidRectSpacing; //TODO should this be options.lineWidth/2 ?
    var clipBulbRadius = ( options.bulbDiameter - options.lineWidth - options.fluidSphereSpacing ) / 2; //TODO should this be options.lineWidth/2 ?
    var clipStartAngle = -Math.acos( ( fluidWidth / 2 ) / clipBulbRadius );
    var clipEndAngle = Math.PI - clipStartAngle;
    var fluidBottomCutoff = ( fluidSphereDiameter / 2 ) * Math.sin( clipEndAngle );
    var rectangleX = -fluidWidth / 2;  //TODO give this a more descriptive name, it tells me nothing

    // Clip area for the fluid in the tube, round at the top
    var fluidClipShape = new Shape().moveTo( rectangleX, fluidBottomCutoff )
      .verticalLineTo( bulbUpperLeftCorner.y );
    var clipUpperLeftCorner = fluidClipShape.getLastPoint();
    fluidClipShape.arc( BULB_CENTER_X, clipUpperLeftCorner.y, fluidWidth / 2, Math.PI, 0 )
      .lineTo( -rectangleX, fluidBottomCutoff ).close();

    // Clip the top of the sphere so it's flat where it connects to the tube
    var sphereClipShape = Shape.rectangle( fluidBottomCutoff, -options.bulbDiameter / 2, options.bulbDiameter, options.bulbDiameter );
    fluidSphere.setClipArea( sphereClipShape );

    // Gradient for fluid in tube
    var fluidRectangleGradient = new LinearGradient( rectangleX, 0, rectangleX + fluidWidth, 0 ).
      addColorStop( 0, options.fluidMainColor ).
      addColorStop( 0.4, options.fluidHighlightColor ).
      addColorStop( 0.5, options.fluidHighlightColor ).
      addColorStop( 1, options.fluidMainColor );

    // Fluid in the tube
    var fluidRectangle = new Rectangle( 0, 0, fluidWidth, 0, {
      fill: fluidRectangleGradient,
      clipArea: fluidClipShape
    } );

    // Background inside the tube, a rectangle clipped to the tube's shape
    if ( options.backgroundColor ) {
      var backgroundY = bulbUpperLeftCorner.y - options.tubeWidth / 2; //TODO this looks wrong, why is options.tubeWidth used?
      var backgroundHeight = options.tubeHeight + options.tubeWidth / 2; //TODO this looks wrong, why is options.tubeWidth used?
      var backgroundRectangle = new Rectangle( bulbUpperLeftCorner.x, backgroundY, options.tubeWidth, backgroundHeight, {
        fill: options.backgroundColor,
        clipArea: outlineShape
      } );
      this.addChild( backgroundRectangle );
    }

    // Add other nodes after optional background
    this.addChild( fluidRectangle );
    this.addChild( fluidSphere );
    this.addChild( outline );

    // Temperature determines the height of the fluid in the tube
    var height = new Path( fluidClipShape ).height;
    var maxFluidHeight = height - fluidBottomCutoff;
    var temperatureLinearFunction = new LinearFunction( minTemperature, maxTemperature, -fluidBottomCutoff, maxFluidHeight );
    temperatureProperty.link( function( temp ) {
      var fluidHeight = temperatureLinearFunction( temp );
      fluidRectangle.setRect( rectangleX, -fluidHeight, fluidWidth, fluidHeight );
    } );

    this.mutate( options );
  }

  return inherit( Node, ThermometerNode );
} );