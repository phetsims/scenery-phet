// Copyright 2019-2022, University of Colorado Boulder

/**
 * A Scenery Node that portrays a thermometer and a triangular indicator of the precise position where the temperature
 * is being sensed. The triangular indicator can be filled with a color to make it more clear what exactly is being
 * measured.
 *
 * @author Arnab Purkayastha
 * @author John Blanco
 */

import { Shape } from '../../kite/js/imports.js';
import StrictOmit from '../../phet-core/js/types/StrictOmit.js';
import Range from '../../dot/js/Range.js';
import { Color, TColor, Node, NodeOptions, Path, PathOptions } from '../../scenery/js/imports.js';
import sceneryPhet from './sceneryPhet.js';
import ThermometerNode, { ThermometerNodeOptions } from './ThermometerNode.js';
import TProperty from '../../axon/js/TProperty.js';
import Bounds2 from '../../dot/js/Bounds2.js';
import optionize, { combineOptions } from '../../phet-core/js/optionize.js';

type SelfOptions = {

  // horizontal spacing between color indicator and thermometer
  horizontalSpace?: number;

  // vertical difference between bottom of color indicator and thermometer
  bottomOffset?: number;

  thermometerNodeOptions?: StrictOmit<ThermometerNodeOptions, 'left' | 'bottom'>;

  colorIndicatorOptions?: { sideLength?: number } & PathOptions;
};

export type TemperatureAndColorSensorNodeOptions = SelfOptions & NodeOptions;

export default class TemperatureAndColorSensorNode extends Node {

  private readonly colorIndicatorNode: Path;
  private readonly thermometerNode: Node;

  public constructor( temperatureProperty: TProperty<number>, temperatureRange: Range, colorProperty: TProperty<TColor>,
                      providedOptions?: TemperatureAndColorSensorNodeOptions ) {
    super();

    const options = optionize<TemperatureAndColorSensorNodeOptions, SelfOptions, NodeOptions>()( {

      // SelfOptions
      horizontalSpace: 3,
      bottomOffset: 5,
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
    }, providedOptions );

    // Add the triangle that will display the sensed color.
    // The leftmost point of this triangle will correspond to the position of the sensor in the model.
    const s = options.colorIndicatorOptions.sideLength!;
    const triangleShape = new Shape()
      .moveTo( 0, 0 )
      .lineTo( Math.cos( Math.PI / 6 ) * s, -Math.sin( Math.PI / 6 ) * s )
      .lineTo( Math.cos( Math.PI / 6 ) * s, Math.sin( Math.PI / 6 ) * s )
      .close();
    this.colorIndicatorNode = new Path( triangleShape, options.colorIndicatorOptions );
    colorProperty.link( color => { this.colorIndicatorNode.fill = color; } );
    this.addChild( this.colorIndicatorNode );

    this.thermometerNode = new ThermometerNode( temperatureProperty, temperatureRange.min, temperatureRange.max, combineOptions<ThermometerNodeOptions>( {
      left: this.colorIndicatorNode.right + options.horizontalSpace,
      bottom: this.colorIndicatorNode.bottom + options.bottomOffset
    }, options.thermometerNodeOptions ) );
    this.addChild( this.thermometerNode );

    this.mutate( options );
  }

  public getThermometerBounds(): Bounds2 {
    return this.thermometerNode.bounds;
  }

  public get thermometerBounds(): Bounds2 { return this.getThermometerBounds(); }

  public getColorIndicatorBounds(): Bounds2 {
    return this.colorIndicatorNode.bounds;
  }

  public get colorIndicatorBounds(): Bounds2 { return this.getColorIndicatorBounds(); }
}

sceneryPhet.register( 'TemperatureAndColorSensorNode', TemperatureAndColorSensorNode );