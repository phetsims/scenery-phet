// Copyright 2014-2019, University of Colorado Boulder

/**
 * Thermometer node, see https://github.com/phetsims/scenery-phet/issues/43
 *
 * @author Aaron Davis
 * @author Sam Reid
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var LinearFunction = require( 'DOT/LinearFunction' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var ShadedSphereNode = require( 'SCENERY_PHET/ShadedSphereNode' );
  var Shape = require( 'KITE/Shape' );

  // constants
  var FLUID_OVERLAP = 1; // overlap of fluid in tube and bulb, to hide seam
  // center of the bulb is at (0,0), let the client code move to the correct position
  var BULB_CENTER_X = 0;
  var BULB_CENTER_Y = 0;

  /**
   * @param {number} minTemperature
   * @param {number} maxTemperature
   * @param {Property.<number>} temperatureProperty
   * @param {Object} [options]
   * @constructor
   */
  function ThermometerNode( minTemperature, maxTemperature, temperatureProperty, options ) {
    var self = this;

    options = _.extend( {
      bulbDiameter: 50,
      tubeWidth: 30,
      tubeHeight: 100,
      lineWidth: 4,
      outlineStroke: 'black',
      tickSpacing: 15,
      majorTickLength: 15,
      minorTickLength: 7.5,
      glassThickness: 2, // space between the thermometer outline and the fluid inside it
      zeroLevel: 'bulbCenter', // defines where level is at temperature zero - 'bulbCenter' or 'bulbTop'

      // leave as null to have a transparent background. If a color is given, then an extra Rectangle is created for the background
      backgroundFill: null,

      // all the default colors are shades of red
      fluidMainColor: '#850e0e', // the main color of the bulb fluid, and the left side of the tube gradient
      fluidHighlightColor: '#ff7575', // the highlight color of the bulb fluid and the middle of the tube gradient
      fluidRightSideColor: '#c41515' // the right side of the tube gradient, not used currently
    }, options );

    Node.call( this );

    assert && assert( options.zeroLevel === 'bulbCenter' || options.zeroLevel === 'bulbTop',
      'Invalid zeroLevel: ' + options.zeroLevel );

    // Create a shaded sphere to act as the bulb fluid
    var bulbFluidDiameter = options.bulbDiameter - options.lineWidth - options.glassThickness; //TODO should this be options.lineWidth/2 ?
    var bulbFluidNode = new ShadedSphereNode( bulbFluidDiameter, {
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
    var tubeTopRadius = options.tubeWidth / 2;
    var straightTubeHeight = options.tubeHeight - tubeTopRadius;
    var straightTubeTop = BULB_CENTER_Y - ( options.bulbDiameter / 2 ) - straightTubeHeight;
    var straightTubeLeft = BULB_CENTER_X - ( options.tubeWidth / 2 );

    var outlineShape = new Shape()
      .arc( BULB_CENTER_X, BULB_CENTER_Y, options.bulbDiameter / 2, bulbStartAngle, bulbEndAngle ) // bulb at bottom
      .arc( BULB_CENTER_X, straightTubeTop, tubeTopRadius, Math.PI, 0 ) // rounded top of tube
      .close();

    // tick marks, from top down, alternating major and minor ticks
    var numberOfTicks = Math.floor( straightTubeHeight / options.tickSpacing ) + 1;
    for ( var i = 0; i < numberOfTicks; i++ ) {
      outlineShape.moveTo( straightTubeLeft, straightTubeTop + ( i * options.tickSpacing ) );
      outlineShape.horizontalLineTo( straightTubeLeft + ( ( i % 2 === 0 ) ? options.majorTickLength : options.minorTickLength ) );
    }

    var outlineNode = new Path( outlineShape, {
      stroke: options.outlineStroke,
      lineWidth: options.lineWidth
    } );
    assert && assert( outlineNode.height === options.tubeHeight + options.bulbDiameter + options.lineWidth ); // see scenery-phet#136

    var tubeFluidWidth = options.tubeWidth - options.lineWidth - options.glassThickness; //TODO should this be options.lineWidth/2 ?
    var tubeFluidRadius = tubeFluidWidth / 2;
    var clipBulbRadius = ( options.bulbDiameter - options.lineWidth - options.glassThickness ) / 2; //TODO should this be options.lineWidth/2 ?
    var clipStartAngle = -Math.acos( tubeFluidRadius / clipBulbRadius );
    var clipEndAngle = Math.PI - clipStartAngle;
    var tubeFluidBottom = ( bulbFluidDiameter / 2 ) * Math.sin( clipEndAngle );
    var tubeFluidLeft = -tubeFluidRadius;

    // Clip area for the fluid in the tube, round at the top
    var fluidClipArea = new Shape()
      .moveTo( tubeFluidLeft, tubeFluidBottom + FLUID_OVERLAP )
      .arc( BULB_CENTER_X, straightTubeTop, tubeFluidRadius, Math.PI, 0 ) // round top
      .lineTo( -tubeFluidLeft, tubeFluidBottom + FLUID_OVERLAP )
      .close();

    // Clip the top of the bulb so it's flat where it connects to the tube
    var bulbFluidClipArea = Shape.rectangle(
      tubeFluidBottom,
      BULB_CENTER_Y - options.bulbDiameter / 2,
      options.bulbDiameter,
      options.bulbDiameter
    );
    bulbFluidNode.setClipArea( bulbFluidClipArea );

    // Gradient for fluid in tube
    var tubeFluidGradient = new LinearGradient( tubeFluidLeft, 0, tubeFluidLeft + tubeFluidWidth, 0 )
      .addColorStop( 0, options.fluidMainColor )
      .addColorStop( 0.4, options.fluidHighlightColor )
      .addColorStop( 0.5, options.fluidHighlightColor )
      .addColorStop( 1, options.fluidMainColor );

    // Fluid in the tube (correct size set later)
    var tubeFluidNode = new Rectangle( 0, 0, tubeFluidWidth, 0, {
      fill: tubeFluidGradient,
      clipArea: fluidClipArea
    } );

    // Background inside the tube
    if ( options.backgroundFill ) {
      this.addChild( new Path( outlineShape, { fill: options.backgroundFill } ) );
    }

    // Add other nodes after optional background
    this.addChild( tubeFluidNode );
    this.addChild( bulbFluidNode );
    this.addChild( outlineNode );

    // Temperature determines the height of the fluid in the tube
    var maxFluidHeight = new Path( fluidClipArea ).height;
    //TODO this can exceed max/min. should this be clamped? or should it be replaced by dot.Util.linear?

    var minFluidHeight;
    if ( options.zeroLevel === 'bulbCenter' ) {
      minFluidHeight = 0;
    }
    else if ( options.zeroLevel === 'bulbTop' ) {
      minFluidHeight = -tubeFluidBottom;
    }
    else {
      throw new Error( 'Invalid zeroLevel: ' + options.zeroLevel );
    }

    // @private
    this.temperatureLinearFunction = new LinearFunction(
      minTemperature,
      maxTemperature,
      minFluidHeight,
      maxFluidHeight + minFluidHeight
    );

    var temperaturePropertyObserver = function( temp ) {
      var fluidHeight = self.temperatureToYPos( temp );
      tubeFluidNode.visible = ( fluidHeight > 0 );
      tubeFluidNode.setRect(
        tubeFluidLeft,
        tubeFluidBottom - fluidHeight + minFluidHeight,
        tubeFluidWidth,
        fluidHeight + FLUID_OVERLAP
      );
    };

    temperatureProperty.link( temperaturePropertyObserver );

    this.mutate( options );

    // @private
    this.disposeThermometerNode = function() {
      if ( temperatureProperty.hasListener( temperaturePropertyObserver ) ) {
        temperatureProperty.unlink( temperaturePropertyObserver );
      }
    };
  }

  sceneryPhet.register( 'ThermometerNode', ThermometerNode );

  return inherit( Node, ThermometerNode, {

    /**
     * Ensures that this node is subject to garbage collection
     * @public
     */
    dispose: function() {
      this.disposeThermometerNode();
      Node.prototype.dispose.call( this );
    },

    /**
     * Get y position at temperature to allow accurate tick placement
     * @param {number} temp - temperature at which to find y position
     * @public
     */
    temperatureToYPos: function( temp ) {
      return this.temperatureLinearFunction( temp );
    },

    /**
     * Get temperature at y position to allow temperature thumb mapping
     * @param {number} y - y position on thermometer node
     * @public
     */
    yPosToTemperature: function( y ) {
      return this.temperatureLinearFunction.inverse( y );
    }
  } );
} );