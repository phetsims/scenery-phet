// Copyright 2019, University of Colorado Boulder

/**
 * A Scenery Node that portrays a thermometer and a triangular indicator of the precise location where the temperature
 * is being sensed. The triangular indicator can be filled with a color to make it more clear what exactly is being
 * measured.
 *
 * @author Arnab Purkayastha
 * @author John Blanco
 */
define( require => {
  'use strict';

  // modules
  const Color = require( 'SCENERY/util/Color' );
  const merge = require( 'PHET_CORE/merge' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  const Shape = require( 'KITE/Shape' );
  const ThermometerNode = require( 'SCENERY_PHET/ThermometerNode' );

  class TemperatureAndColorSensorNode extends Node {

    /**
     * @param {Range} temperatureRange
     * @param {Property.<number>} temperatureProperty
     * @param {Property.<Color>} colorProperty
     * @param {Object} [options]
     */
    constructor( temperatureRange, temperatureProperty, colorProperty, options ) {
      super();

      options = merge( {
        horizontalSpace: 3, // horizontal spacing between color indicator and thermometer
        bottomOffset: 5, // vertical difference between bottom of color indicator and thermometer
        thermometerNodeOptions: {
          bulbDiameter: 30,
          tubeWidth: 18,
          lineWidth: 2,
          tickSpacingTemperature: 25,
          majorTickLength: 10,
          minorTickLength: 5,
          backgroundFill: new Color( 256, 256, 256, 0.67 )
        },
        colorIndicatorOptions: {
          fill: new Color( 0, 0, 0, 0 ),
          lineWidth: 2,
          stroke: 'black',
          lineJoin: 'round',
          sideLength: 18
        }
      }, options );

      // Add the triangle that will display the sensed color.  The leftmost point of this triangle will correspond to the
      // position of the sensor in the model.
      const triangleShape = new Shape();
      const s = options.colorIndicatorOptions.sideLength;
      triangleShape.moveTo( 0, 0 )
        .lineTo( Math.cos( Math.PI / 6 ) * s, -Math.sin( Math.PI / 6 ) * s )
        .lineTo( Math.cos( Math.PI / 6 ) * s, Math.sin( Math.PI / 6 ) * s )
        .close();

      // @private {Path}
      this.colorIndicatorNode = new Path( triangleShape, options.colorIndicatorOptions );
      colorProperty.link( color => { this.colorIndicatorNode.fill = color; } );
      this.addChild( this.colorIndicatorNode );

      // @private {ThermometerNode}
      this.thermometerNode = new ThermometerNode(
        temperatureRange.min,
        temperatureRange.max,
        temperatureProperty,
        _.extend( options.thermometerNodeOptions, {
          left: this.colorIndicatorNode.right + options.horizontalSpace,
          bottom: this.colorIndicatorNode.bottom + options.bottomOffset
        } )
      );
      this.addChild( this.thermometerNode );

      this.mutate( options );
    }

    /**
     * Returns bounds for thermomemeter node
     * @public
     *
     * @returns {Bounds2}
     */
    getThermometerBounds() {
      return this.thermometerNode.bounds;
    }

    get thermometerBounds() { return this.getThermometerBounds(); }

    /**
     * Returns bounds for color indicator arrow node
     * @public
     *
     * @returns {Bounds2}
     */
    getColorIndicatorBounds() {
      return this.colorIndicatorNode.bounds;
    }

    get colorIndicatorBounds() { return this.getColorIndicatorBounds(); }
  }

  return sceneryPhet.register( 'TemperatureAndColorSensorNode', TemperatureAndColorSensorNode );
} );