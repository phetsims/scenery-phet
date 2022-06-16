// Copyright 2018-2022, University of Colorado Boulder

/**
 * Displays a beaker graphic
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import { Shape } from '../../kite/js/imports.js';
import SceneryPhetColors from './SceneryPhetColors.js';
import sceneryPhet from './sceneryPhet.js';
import { IColor, Node, NodeOptions, Path, ProfileColorProperty } from '../../scenery/js/imports.js';
import optionize from '../../phet-core/js/optionize.js';
import NumberProperty from '../../axon/js/NumberProperty.js';
import StrictOmit from '../../phet-core/js/types/StrictOmit.js';

type SelfOptions = {
  emptyBeakerFill?: IColor;
  solutionFill?: ProfileColorProperty;
  solutionShadowFill?: IColor;
  solutionGlareFill?: IColor;
  beakerGlareFill?: IColor;
  beakerHeight?: number;
  beakerWidth?: number;
  yRadiusOfEnds?: number; // radius of the ellipses used for the ends, to provide 3D perspective
  ticksVisible?: boolean;
  tickStroke?: IColor;
  stroke?: IColor;
  lineWidth?: number;
  numberOfTicks?: number; // Denominator of tick marks distance
};
export type BeakerNodeOptions = SelfOptions & StrictOmit<NodeOptions, 'children'>;

export default class BeakerNode extends Node {

  public static DEFAULT_X_RADIUS = 30;
  public static DEFAULT_Y_RADIUS = 12;
  private readonly ticks: Path;
  private readonly disposeBeakerNode: () => void;

  public constructor( solutionLevelProperty: NumberProperty, providedOptions?: BeakerNodeOptions ) {

    const solutionGlareFill = providedOptions?.solutionFill?.value.colorUtilsBrighter( 0.5 );
    const solutionShadowFill = providedOptions?.solutionFill?.value.colorUtilsDarker( 0.2 );

    const options = optionize<BeakerNodeOptions, SelfOptions, NodeOptions>()( {
      emptyBeakerFill: SceneryPhetColors.emptyBeakerFillProperty,
      solutionFill: SceneryPhetColors.solutionFillProperty,
      solutionShadowFill: solutionShadowFill ? solutionShadowFill : SceneryPhetColors.solutionShadowFillProperty,
      solutionGlareFill: solutionGlareFill ? solutionGlareFill : SceneryPhetColors.solutionShineFillProperty,
      beakerGlareFill: SceneryPhetColors.beakerShineFillProperty,
      stroke: SceneryPhetColors.stroke,
      lineWidth: 1,
      beakerHeight: 100,
      beakerWidth: 60,
      yRadiusOfEnds: BeakerNode.DEFAULT_Y_RADIUS,
      ticksVisible: false,
      numberOfTicks: 4,
      tickStroke: SceneryPhetColors.stroke
    }, providedOptions );

    const xRadius = options.beakerWidth / 2;

    const centerTop = -options.beakerHeight / 2;
    const centerBottom = options.beakerHeight / 2;
    const numberOfTicks = options.numberOfTicks;

    // Beaker structure and glare shapes
    const beakerGlareShape = new Shape()
      .moveTo( -xRadius * 0.6, centerTop * 0.6 )
      .verticalLineTo( centerBottom * 0.85 )
      .lineTo( -xRadius * 0.5, centerBottom * 0.9 )
      .verticalLineTo( centerTop * 0.55 )
      .close();

    const beakerFrontShape = new Shape()
      .ellipticalArc( 0, centerBottom, xRadius, options.yRadiusOfEnds, 0, 0, Math.PI, false )
      .ellipticalArc( 0, centerTop, xRadius, options.yRadiusOfEnds, 0, Math.PI, 0, true )
      .close();

    const beakerBackShape = new Shape()
      .ellipticalArc( 0, centerTop, xRadius, options.yRadiusOfEnds, 0, Math.PI, 0, false )
      .ellipticalArc( 0, centerBottom, xRadius, options.yRadiusOfEnds, 0, 0, Math.PI, true )
      .close();

    const beakerBottomShape = new Shape()
      .ellipticalArc( 0, centerBottom, xRadius, options.yRadiusOfEnds, 0, 0, 2 * Math.PI, false );

    // Water fill and shading paths
    const solutionSide = new Path( null, {
      fill: options.solutionFill,
      pickable: false
    } );
    const solutionTop = new Path( null, {
      fill: options.solutionFill,
      pickable: false
    } );
    const solutionFrontEdge = new Path( null, {
      fill: options.solutionShadowFill,
      pickable: false
    } );
    const solutionBackEdge = new Path( null, {
      fill: options.solutionShadowFill,
      opacity: 0.6,
      pickable: false
    } );
    const solutionGlare = new Path( null, {
      fill: options.solutionGlareFill
    } );

    // Beaker structure and glare paths
    const beakerFront = new Path( beakerFrontShape, {
      stroke: options.stroke,
      lineWidth: options.lineWidth
    } );

    const beakerBack = new Path( beakerBackShape, {
      stroke: options.stroke,
      lineWidth: options.lineWidth,
      fill: options.emptyBeakerFill
    } );

    beakerBack.setScaleMagnitude( -1, 1 );
    const beakerBottom = new Path( beakerBottomShape, {
      stroke: options.stroke,
      fill: options.emptyBeakerFill,
      pickable: false
    } );

    const beakerGlare = new Path( beakerGlareShape.getOffsetShape( 2 ), {
      fill: options.beakerGlareFill
    } );

    const ticksShape = new Shape();
    let y = centerBottom;
    for ( let i = 0; i < numberOfTicks - 1; i++ ) {
      y -= options.beakerHeight / options.numberOfTicks;
      const centralAngle = Math.PI * 0.83;
      const offsetAngle = Math.PI * ( i % 2 === 0 ? 0.07 : 0.1 );
      ticksShape.ellipticalArc( 0, y, xRadius, options.yRadiusOfEnds, 0, centralAngle + offsetAngle, centralAngle - offsetAngle, true ).newSubpath();
    }

    const ticks = new Path( ticksShape, {
      stroke: options.tickStroke,
      lineWidth: 1.5,
      pickable: false,
      visible: options.ticksVisible
    } );

    // solution level adjustment listener
    const solutionLevelListener = ( solutionLevel: number ) => {
      const centerLiquidY = centerBottom - options.beakerHeight * solutionLevel;
      const solutionTopShape = new Shape()
        .ellipticalArc( 0, centerLiquidY, xRadius, options.yRadiusOfEnds, 0, 0, Math.PI * 2, false )
        .close();
      const solutionSideShape = new Shape()
        .ellipticalArc( 0, centerLiquidY, xRadius, options.yRadiusOfEnds, 0, Math.PI, 0, true )
        .ellipticalArc( 0, centerBottom, xRadius, options.yRadiusOfEnds, 0, 0, Math.PI, false )
        .close();
      const solutionFrontEdgeShape = new Shape()
        .ellipticalArc( 0, centerLiquidY + 1, xRadius, options.yRadiusOfEnds + 2, 0, Math.PI, 0, true )
        .ellipticalArc( 0, centerLiquidY, xRadius, options.yRadiusOfEnds, 0, 0, Math.PI, false );
      const solutionBackEdgeShape = new Shape()
        .ellipticalArc( 0, centerBottom - 1, xRadius, options.yRadiusOfEnds + 4, Math.PI, Math.PI, 0, true )
        .ellipticalArc( 0, centerBottom, xRadius, options.yRadiusOfEnds, Math.PI, 0, Math.PI, false );
      const solutionCrescentShape = new Shape()
        .ellipticalArc( xRadius * 0.2, centerLiquidY, options.yRadiusOfEnds * 0.75, xRadius * 0.4, Math.PI * 1.5, Math.PI, 0, true )
        .ellipticalArc( xRadius * 0.2, centerLiquidY, options.yRadiusOfEnds * 0.75, xRadius * 0.6, Math.PI * 1.5, 0, Math.PI, false );

      solutionTop.shape = solutionTopShape;
      solutionSide.shape = solutionSideShape;
      solutionFrontEdge.shape = solutionFrontEdgeShape;
      solutionBackEdge.shape = solutionBackEdgeShape;
      solutionGlare.shape = solutionCrescentShape;

      //Prevents back edge from appearing when solution level empty.
      solutionBackEdge.clipArea = Shape.union( [ solutionTopShape, solutionSideShape ] );

      // Set solution visibility based on solution level
      if ( solutionLevel < 0.001 ) {
        solutionTop.visible = false;
        solutionSide.visible = false;
        solutionFrontEdge.visible = false;
        solutionBackEdge.visible = false;
        solutionGlare.visible = false;
      }
      else {
        solutionTop.visible = true;
        solutionSide.visible = true;
        solutionFrontEdge.visible = true;
        solutionBackEdge.visible = true;
        solutionGlare.visible = true;
      }
    };
    solutionLevelProperty.link( solutionLevelListener );

    // Prevents front edge from dipping below beaker boundary when dragged all the way down.
    solutionFrontEdge.clipArea = Shape.union( [ beakerFrontShape, beakerBottomShape ] );

    options.children = [
      beakerBack,
      beakerBottom,
      solutionSide,
      solutionBackEdge,
      solutionTop,
      solutionGlare,
      solutionFrontEdge,
      beakerFront,
      ticks,
      beakerGlare
    ];

    super( options );

    this.ticks = ticks;

    this.disposeBeakerNode = () => {
      if ( solutionLevelProperty.hasListener( solutionLevelListener ) ) {
        solutionLevelProperty.unlink( solutionLevelListener );
      }
    };
  }

  public override dispose(): void {
    this.disposeBeakerNode();
    super.dispose();
  }

  public setTicksVisible( visible: boolean ): void {
    this.ticks.visible = visible;
  }
}

sceneryPhet.register( 'BeakerNode', BeakerNode );