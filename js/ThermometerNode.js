// Copyright 2014-2021, University of Colorado Boulder

/**
 * Thermometer node, see https://github.com/phetsims/scenery-phet/issues/43
 *
 * @author Aaron Davis
 * @author Sam Reid
 * @author Chris Malley (PixelZoom, Inc.)
 */

import LinearFunction from '../../dot/js/LinearFunction.js';
import Shape from '../../kite/js/Shape.js';
import InstanceRegistry from '../../phet-core/js/documentation/InstanceRegistry.js';
import merge from '../../phet-core/js/merge.js';
import Node from '../../scenery/js/nodes/Node.js';
import Path from '../../scenery/js/nodes/Path.js';
import Rectangle from '../../scenery/js/nodes/Rectangle.js';
import LinearGradient from '../../scenery/js/util/LinearGradient.js';
import sceneryPhet from './sceneryPhet.js';
import ShadedSphereNode from './ShadedSphereNode.js';

// constants
const FLUID_OVERLAP = 1; // overlap of fluid in tube and bulb, to hide seam
// center of the bulb is at (0,0), let the client code move to the correct position
const BULB_CENTER_X = 0;
const BULB_CENTER_Y = 0;

class ThermometerNode extends Node {

  /**
   * @param {number} minTemperature
   * @param {number} maxTemperature
   * @param {Property.<number>} temperatureProperty
   * @param {Object} [options]
   */
  constructor( minTemperature, maxTemperature, temperatureProperty, options ) {

    options = merge( {
      bulbDiameter: 50,
      tubeWidth: 30,
      tubeHeight: 100,
      lineWidth: 4,
      outlineStroke: 'black',
      tickSpacing: 15,
      tickSpacingTemperature: null, // {number} overrides tickSpacing to space ticks by units of temperature
      majorTickLength: 15,
      minorTickLength: 7.5,
      glassThickness: 4, // space between the thermometer outline and the fluid inside it
      zeroLevel: 'bulbCenter', // defines where level is at temperature zero - 'bulbCenter' or 'bulbTop'

      // leave as null to have a transparent background. If a color is given, then an extra Rectangle is created for the background
      backgroundFill: null,

      // all the default colors are shades of red
      fluidMainColor: '#850e0e', // the main color of the bulb fluid, and the left side of the tube gradient
      fluidHighlightColor: '#ff7575', // the highlight color of the bulb fluid and the middle of the tube gradient
      fluidRightSideColor: '#c41515' // the right side of the tube gradient, not used currently
    }, options );

    super();

    assert && assert( options.zeroLevel === 'bulbCenter' || options.zeroLevel === 'bulbTop',
      `Invalid zeroLevel: ${options.zeroLevel}` );

    // Create a shaded sphere to act as the bulb fluid
    const bulbFluidDiameter = options.bulbDiameter - options.glassThickness - options.lineWidth / 2;
    const bulbFluidNode = new ShadedSphereNode( bulbFluidDiameter, {
      centerX: BULB_CENTER_X,
      centerY: BULB_CENTER_Y,
      mainColor: options.fluidMainColor,
      highlightColor: options.fluidHighlightColor,
      highlightXOffset: -0.2,
      highlightYOffset: 0.2,
      rotation: Math.PI / 2
    } );

    // Angles for the outline of the bulb
    const bulbStartAngle = -Math.acos( options.tubeWidth / options.bulbDiameter );
    const bulbEndAngle = Math.PI - bulbStartAngle;

    // Create the outline for the thermometer, starting with the bulb
    const tubeTopRadius = options.tubeWidth / 2;
    const straightTubeHeight = options.tubeHeight - tubeTopRadius;
    const straightTubeTop = BULB_CENTER_Y - ( options.bulbDiameter / 2 ) - straightTubeHeight;
    const straightTubeLeft = BULB_CENTER_X - ( options.tubeWidth / 2 );

    const outlineShape = new Shape()
      .arc( BULB_CENTER_X, BULB_CENTER_Y, options.bulbDiameter / 2, bulbStartAngle, bulbEndAngle ) // bulb at bottom
      .arc( BULB_CENTER_X, straightTubeTop, tubeTopRadius, Math.PI, 0 ) // rounded top of tube
      .close();

    const outlineNode = new Path( outlineShape, {
      stroke: options.outlineStroke,
      lineWidth: options.lineWidth
    } );
    assert && assert( outlineNode.height === options.tubeHeight + options.bulbDiameter + options.lineWidth ); // see scenery-phet#136

    const tubeFluidWidth = options.tubeWidth - options.glassThickness - options.lineWidth / 2;
    const tubeFluidRadius = tubeFluidWidth / 2;
    const clipBulbRadius = ( options.bulbDiameter - options.glassThickness - options.lineWidth / 2 ) / 2;
    const clipStartAngle = -Math.acos( tubeFluidRadius / clipBulbRadius );
    const clipEndAngle = Math.PI - clipStartAngle;
    const tubeFluidBottom = ( bulbFluidDiameter / 2 ) * Math.sin( clipEndAngle );
    const tubeFluidLeft = -tubeFluidRadius;

    // Clip area for the fluid in the tube, round at the top
    const fluidClipArea = new Shape()
      .moveTo( tubeFluidLeft, tubeFluidBottom + FLUID_OVERLAP )
      .arc( BULB_CENTER_X, straightTubeTop, tubeFluidRadius, Math.PI, 0 ) // round top
      .lineTo( -tubeFluidLeft, tubeFluidBottom + FLUID_OVERLAP )
      .close();

    // Clip the top of the bulb so it's flat where it connects to the tube
    const bulbFluidClipArea = Shape.rectangle(
      tubeFluidBottom,
      BULB_CENTER_Y - options.bulbDiameter / 2,
      options.bulbDiameter,
      options.bulbDiameter
    );
    bulbFluidNode.setClipArea( bulbFluidClipArea );

    // Gradient for fluid in tube
    const tubeFluidGradient = new LinearGradient( tubeFluidLeft, 0, tubeFluidLeft + tubeFluidWidth, 0 )
      .addColorStop( 0, options.fluidMainColor )
      .addColorStop( 0.4, options.fluidHighlightColor )
      .addColorStop( 0.5, options.fluidHighlightColor )
      .addColorStop( 1, options.fluidMainColor );

    // Fluid in the tube (correct size set later)
    const tubeFluidNode = new Rectangle( 0, 0, tubeFluidWidth, 0, {
      fill: tubeFluidGradient,
      clipArea: fluidClipArea
    } );

    // override tick spacing options when using tickSpacingTemperature
    let offset = options.tickSpacing; // distance between position of minTemp and first tick
    let minorOffset = 0; // bool (as number) indicating where first minor tick is placed
    if ( options.tickSpacingTemperature !== null ) {
      const scaleTempY = ( options.tubeHeight + options.lineWidth ) / ( maxTemperature - minTemperature );
      const offsetTemp = options.tickSpacingTemperature - ( minTemperature % options.tickSpacingTemperature );
      offset = offsetTemp * scaleTempY;
      minorOffset = ( ( minTemperature + offsetTemp ) % ( options.tickSpacingTemperature * 2 ) ) % 2;
      options.tickSpacing = options.tickSpacingTemperature * scaleTempY;
    }

    // tick marks, from bottom up, alternating major and minor ticks
    for ( let i = 0; i * options.tickSpacing + offset <= options.tubeHeight - ( tubeTopRadius / 3 ); i++ ) {
      outlineShape.moveTo(
        straightTubeLeft,
        tubeFluidBottom - ( i * options.tickSpacing ) - offset
      );
      outlineShape.horizontalLineTo(
        straightTubeLeft + ( ( i % 2 === minorOffset ) ? options.minorTickLength : options.majorTickLength )
      );
    }

    // Background inside the tube
    if ( options.backgroundFill ) {
      this.addChild( new Path( outlineShape, { fill: options.backgroundFill } ) );
    }

    // Add other nodes after optional background
    this.addChild( tubeFluidNode );
    this.addChild( bulbFluidNode );
    this.addChild( outlineNode );

    // Temperature determines the height of the fluid in the tube
    const maxFluidHeight = new Path( fluidClipArea ).height;

    let minFluidHeight;
    if ( options.zeroLevel === 'bulbCenter' ) {
      minFluidHeight = 0;
    }
    else if ( options.zeroLevel === 'bulbTop' ) {
      minFluidHeight = -tubeFluidBottom;
    }
    else {
      throw new Error( `Invalid zeroLevel: ${options.zeroLevel}` );
    }

    // @private
    this.temperatureLinearFunction = new LinearFunction(
      minTemperature,
      maxTemperature,
      minFluidHeight,
      maxFluidHeight + minFluidHeight
    );

    const temperaturePropertyObserver = temperature => {
      const fluidHeight = this.temperatureToYPos( temperature );
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
    this.disposeThermometerNode = () => {
      if ( temperatureProperty.hasListener( temperaturePropertyObserver ) ) {
        temperatureProperty.unlink( temperaturePropertyObserver );
      }
    };

    // support for binder documentation, stripped out in builds and only runs when ?binder is specified
    assert && phet.chipper.queryParameters.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'ThermometerNode', this );
  }

  /**
   * @public
   * @override
   */
  dispose() {
    this.disposeThermometerNode();
    super.dispose();
  }

  /**
   * Get y position at temperature to allow accurate tick placement
   * @param {Number|null} temperature - temperature at which to find y position
   * @public
   */
  temperatureToYPos( temperature ) {

    // treat null as zero - this is a "legacy requirement", needed by the States of Matter sims
    const compensatedTemperature = temperature === null ? 0 : temperature;

    return this.temperatureLinearFunction( compensatedTemperature );
  }

  /**
   * Get temperature at y position to allow temperature thumb mapping
   * @param {number} y - y position on thermometer node
   * @public
   */
  yPosToTemperature( y ) {
    return this.temperatureLinearFunction.inverse( y );
  }
}

sceneryPhet.register( 'ThermometerNode', ThermometerNode );
export default ThermometerNode;