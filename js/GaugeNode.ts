// Copyright 2013-2022, University of Colorado Boulder

/**
 * GaugeNode is a circular gauge that depicts some dynamic value.
 * This was originally ported from the speedometer node in forces-and-motion-basics.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import TReadOnlyProperty from '../../axon/js/TReadOnlyProperty.js';
import Matrix3 from '../../dot/js/Matrix3.js';
import Range from '../../dot/js/Range.js';
import Utils from '../../dot/js/Utils.js';
import { Shape } from '../../kite/js/imports.js';
import InstanceRegistry from '../../phet-core/js/documentation/InstanceRegistry.js';
import optionize from '../../phet-core/js/optionize.js';
import { Circle, TColor, Node, NodeOptions, Path, Text } from '../../scenery/js/imports.js';
import Tandem from '../../tandem/js/Tandem.js';
import PhetFont from './PhetFont.js';
import sceneryPhet from './sceneryPhet.js';

type SelfOptions = {

  radius?: number;
  backgroundFill?: TColor;
  backgroundStroke?: TColor;
  backgroundLineWidth?: number;
  maxLabelWidthScale?: number; // defines max width of the label, relative to the radius

  // ticks
  numberOfTicks?: number;
  majorTickStroke?: TColor;
  minorTickStroke?: TColor;
  majorTickLength?: number;
  minorTickLength?: number;
  majorTickLineWidth?: number;
  minorTickLineWidth?: number;

  // the top half of the gauge, plus PI/8 extended below the top half on each side
  span?: number; // the visible span of the gauge value range, in radians

  needleLineWidth?: number;

  // true - always updates, even when invisible
  // false - does not update when invisible, use to optimize performance
  updateWhenInvisible?: boolean;
};

export type GaugeNodeOptions = SelfOptions & NodeOptions;

export default class GaugeNode extends Node {

  public readonly radius: number;
  private readonly disposeGaugeNode: () => void;

  /**
   * @param valueProperty
   * @param labelProperty - label to display, scaled to fit if necessary
   * @param range - range of the needle. If valueProperty exceeds this range, the needle will stop at min or max.
   * @param providedOptions
   */
  public constructor( valueProperty: TReadOnlyProperty<number>, labelProperty: TReadOnlyProperty<string>, range: Range, providedOptions?: GaugeNodeOptions ) {

    const options = optionize<GaugeNodeOptions, SelfOptions, NodeOptions>()( {

      // SelfOptions
      radius: 100,
      backgroundFill: 'white',
      backgroundStroke: 'rgb( 85, 85, 85 )',
      backgroundLineWidth: 2,
      maxLabelWidthScale: 1.3,
      numberOfTicks: 21, // 10 ticks each on the right side and left side, plus 1 in the center
      majorTickStroke: 'gray',
      minorTickStroke: 'gray',
      majorTickLength: 10,
      minorTickLength: 5,
      majorTickLineWidth: 2,
      minorTickLineWidth: 1,
      span: Math.PI + Math.PI / 4,
      needleLineWidth: 3,
      updateWhenInvisible: true,

      // NodeOptions
      tandem: Tandem.REQUIRED,
      tandemNameSuffix: 'Node'
    }, providedOptions );

    assert && assert( options.span <= 2 * Math.PI, `options.span must be <= 2 * Math.PI: ${options.span}` );

    super();

    this.radius = options.radius;

    const anglePerTick = options.span / options.numberOfTicks;
    const tandem = options.tandem;

    this.addChild( new Circle( this.radius, {
      fill: options.backgroundFill,
      stroke: options.backgroundStroke,
      lineWidth: options.backgroundLineWidth
    } ) );

    const foregroundNode = new Node( {
      pickable: false
    } );
    this.addChild( foregroundNode );

    const needle = new Path( Shape.lineSegment( 0, 0, this.radius - options.majorTickLength / 2, 0 ), {
      stroke: 'red',
      lineWidth: options.needleLineWidth
    } );

    const labelText = new Text( labelProperty, {
      font: new PhetFont( 20 ),
      maxWidth: this.radius * options.maxLabelWidthScale,
      tandem: tandem.createTandem( 'labelText' )
    } );
    labelText.boundsProperty.link( () => {
      labelText.centerX = 0;
      labelText.centerY = -this.radius / 3;
    } );
    foregroundNode.addChild( labelText );

    const pin = new Circle( 2, { fill: 'black' } );
    foregroundNode.addChild( pin );

    const totalAngle = ( options.numberOfTicks - 1 ) * anglePerTick;
    const startAngle = -1 / 2 * Math.PI - totalAngle / 2;
    const endAngle = startAngle + totalAngle;

    const scratchMatrix = new Matrix3();

    const updateNeedle = () => {
      if ( this.visibleProperty.value || options.updateWhenInvisible ) {
        if ( typeof ( valueProperty.get() ) === 'number' ) {

          // clamp value to valid range and map it to an angle
          const clampedValue = Utils.clamp( valueProperty.get(), range.min, range.max );
          const needleAngle = Utils.linear( range.min, range.max, startAngle, endAngle, clampedValue );

          // 2d rotation, but reusing our matrix above
          needle.setMatrix( scratchMatrix.setToRotationZ( needleAngle ) );
          needle.visible = true;
        }
        else {

          // Hide the needle if there is no number value.
          needle.visible = false;
        }
      }
    };
    valueProperty.link( updateNeedle );

    // If options.updateWhenInvisible is true, updateNeedle will be called by the valueProperty listener above.
    // Otherwise, we need to listen to visibleProperty, and call updateNeedle when the gauge becomes visible.
    if ( !options.updateWhenInvisible ) {
      this.visibleProperty.link( visible => {
        visible && updateNeedle();
      } );
    }

    // Render all of the ticks into Shapes layers (since they have different strokes)
    // see https://github.com/phetsims/energy-skate-park-basics/issues/208
    const bigTicksShape = new Shape();
    const smallTicksShape = new Shape();

    // Add the tick marks
    for ( let i = 0; i < options.numberOfTicks; i++ ) {
      const tickAngle = i * anglePerTick + startAngle;

      const tickLength = i % 2 === 0 ? options.majorTickLength : options.minorTickLength;
      const x1 = ( this.radius - tickLength ) * Math.cos( tickAngle );
      const y1 = ( this.radius - tickLength ) * Math.sin( tickAngle );
      const x2 = this.radius * Math.cos( tickAngle );
      const y2 = this.radius * Math.sin( tickAngle );
      if ( i % 2 === 0 ) {
        bigTicksShape.moveTo( x1, y1 );
        bigTicksShape.lineTo( x2, y2 );
      }
      else {
        smallTicksShape.moveTo( x1, y1 );
        smallTicksShape.lineTo( x2, y2 );
      }
    }

    foregroundNode.addChild( new Path( bigTicksShape, {
      stroke: options.majorTickStroke,
      lineWidth: options.majorTickLineWidth
    } ) );
    foregroundNode.addChild( new Path( smallTicksShape, {
      stroke: options.minorTickStroke,
      lineWidth: options.minorTickLineWidth
    } ) );

    // Add needle last, so it's on top of ticks. See https://github.com/phetsims/scenery-phet/issues/502
    foregroundNode.addChild( needle );

    this.mutate( options );

    this.disposeGaugeNode = () => {
      if ( valueProperty.hasListener( updateNeedle ) ) {
        valueProperty.unlink( updateNeedle );
      }

      // de-register phet-io tandems
      foregroundNode.dispose();
      labelText.dispose();
    };

    // support for binder documentation, stripped out in builds and only runs when ?binder is specified
    assert && phet.chipper.queryParameters.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'GaugeNode', this );
  }

  public override dispose(): void {
    this.disposeGaugeNode();
    super.dispose();
  }
}

sceneryPhet.register( 'GaugeNode', GaugeNode );