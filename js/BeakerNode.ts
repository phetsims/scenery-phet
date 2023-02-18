// Copyright 2018-2023, University of Colorado Boulder

/**
 * BeakerNode draws a pseudo-3D cylindrical beaker, with optional tick marks, containing a solution.
 * Based on the value of solutionLevelProperty, it fills the beaker with solution from the bottom up.
 * The Beaker and solution use flat style shading and highlights to provide pseudo-3D dimension.
 *
 * @author Marla Schulz <marla.schulz@colorado.edu>
 */

import { Shape } from '../../kite/js/imports.js';
import SceneryPhetColors from './SceneryPhetColors.js';
import sceneryPhet from './sceneryPhet.js';
import { Node, NodeOptions, PaintColorProperty, Path, TColor, TPaint } from '../../scenery/js/imports.js';
import optionize from '../../phet-core/js/optionize.js';
import StrictOmit from '../../phet-core/js/types/StrictOmit.js';
import TRangedProperty from '../../axon/js/TRangedProperty.js';

type SelfOptions = {
  emptyBeakerFill?: TPaint;
  solutionFill?: TColor;
  solutionShadowFill?: TPaint;
  solutionGlareFill?: TPaint;
  beakerGlareFill?: TPaint;
  beakerHeight?: number;
  beakerWidth?: number;
  yRadiusOfEnds?: number; // radius of the ellipses used for the ends, to provide 3D perspective
  ticksVisible?: boolean;
  tickStroke?: TPaint;
  beakerStroke?: TPaint;
  lineWidth?: number;
  numberOfTicks?: number; // The number of tick marks shown on beaker.
};
export type BeakerNodeOptions = SelfOptions & StrictOmit<NodeOptions, 'children'>;

export default class BeakerNode extends Node {

  private readonly ticks: Path;
  private readonly disposeBeakerNode: () => void;

  public constructor( solutionLevelProperty: TRangedProperty, providedOptions?: BeakerNodeOptions ) {
    assert && assert( solutionLevelProperty.range.min >= 0 && solutionLevelProperty.range.max <= 1,
      'SolutionLevelProperty must be a NumberProperty with min >= 0 and max <= 1' );

    // Generates highlight and shading when a custom solutionFill is provided.
    const originalGlareFill = providedOptions?.solutionFill !== undefined
                              ? providedOptions.solutionFill
                              : SceneryPhetColors.solutionShineFillProperty;
    const originalShadowFill = providedOptions?.solutionFill !== undefined
                               ? providedOptions.solutionFill
                                : SceneryPhetColors.solutionShadowFillProperty;

    // Keep our solution glare/shadow up-to-date if solutionFill is a Property<Color> and it changes
    const solutionGlareFillProperty = new PaintColorProperty( originalGlareFill, { luminanceFactor: 0.5 } );
    const solutionShadowFillProperty = new PaintColorProperty( originalShadowFill, { luminanceFactor: -0.2 } );

    const options = optionize<BeakerNodeOptions, SelfOptions, NodeOptions>()( {
      emptyBeakerFill: SceneryPhetColors.emptyBeakerFillProperty,
      solutionFill: SceneryPhetColors.solutionFillProperty,
      solutionGlareFill: solutionGlareFillProperty,
      solutionShadowFill: solutionShadowFillProperty,
      beakerGlareFill: SceneryPhetColors.beakerShineFillProperty,
      beakerStroke: SceneryPhetColors.beakerStroke,
      lineWidth: 1,
      beakerHeight: 100,
      beakerWidth: 60,
      yRadiusOfEnds: 12,
      ticksVisible: false,
      numberOfTicks: 3,
      tickStroke: SceneryPhetColors.tickStroke
    }, providedOptions );

    const xRadius = options.beakerWidth / 2;

    const centerTop = -options.beakerHeight / 2;
    const centerBottom = options.beakerHeight / 2;

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

    const beakerBackTopShape = new Shape()
      .ellipticalArc( 0, centerTop, xRadius, options.yRadiusOfEnds, 0, Math.PI, 0, false );

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
      stroke: options.beakerStroke,
      lineWidth: options.lineWidth
    } );

    const beakerBack = new Path( beakerBackShape, {
      stroke: options.beakerStroke,
      lineWidth: options.lineWidth,
      fill: options.emptyBeakerFill
    } );

    const beakerBackTop = new Path( beakerBackTopShape, {
      stroke: options.beakerStroke,
      lineWidth: options.lineWidth
    } );

    beakerBack.setScaleMagnitude( -1, 1 );

    const beakerBottom = new Path( beakerBottomShape, {
      stroke: options.beakerStroke,
      fill: options.emptyBeakerFill,
      pickable: false
    } );

    const beakerGlare = new Path( beakerGlareShape.getOffsetShape( 2 ), {
      fill: options.beakerGlareFill
    } );

    const tickDivision = 1 / ( options.numberOfTicks + 1 );
    const ticksShape = new Shape();
    let y = centerBottom;
    for ( let i = 0; i < options.numberOfTicks; i++ ) {
      y -= options.beakerHeight * tickDivision;
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

      // Set solution visibility based on solution level
      if ( solutionLevel < 0.001 ) {
        solutionTop.visible = false;
        solutionSide.visible = false;
        solutionFrontEdge.visible = false;
        solutionBackEdge.visible = false;
        solutionGlare.visible = false;
      }
      else {

        // Prevents back edge from appearing when solution level empty.  Only compute this when the solutionBackEdge
        // will be shown, because when computed for very small solutionLevel it triggers a kite corner case problem
        // see https://github.com/phetsims/kite/issues/98
        solutionBackEdge.clipArea = Shape.union( [ solutionTopShape, solutionSideShape ] );

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
      beakerBackTop,
      beakerFront,
      ticks,
      beakerGlare
    ];

    super( options );

    this.ticks = ticks;

    this.disposeBeakerNode = () => {
      solutionGlareFillProperty.dispose();
      solutionShadowFillProperty.dispose();
      solutionLevelProperty.unlink( solutionLevelListener );
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