// Copyright 2018-2022, University of Colorado Boulder

/**
 * Displays a beaker graphic
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import { Shape } from '../../kite/js/imports.js';
import SceneryPhetColors from './SceneryPhetColors.js';
import sceneryPhet from './sceneryPhet.js';
import { Node, NodeOptions, Path, ProfileColorProperty } from '../../scenery/js/imports.js';
import optionize from '../../phet-core/js/optionize.js';
import NumberProperty from '../../axon/js/NumberProperty.js';

type SelfOptions = {
  emptyBeakerFill?: ProfileColorProperty;
  solutionFill?: ProfileColorProperty;
  solutionShadowFill?: ProfileColorProperty;
  solutionGlareFill?: ProfileColorProperty;
  beakerGlareFill?: ProfileColorProperty;
  beakerHeight?: number;
  xRadius?: number;
  yRadius?: number;
  showTicks?: boolean;

  // Denominator of tick marks distance
  numTicks?: number;
};
export type BeakerNodeOptions = SelfOptions & NodeOptions;

export default class BeakerNode extends Node {
  constructor( solutionLevelProperty: NumberProperty,
               providedOptions?: BeakerNodeOptions ) {

    const options = optionize<BeakerNodeOptions, SelfOptions, NodeOptions>()( {
      emptyBeakerFill: SceneryPhetColors.emptyBeakerFillProperty,
      solutionFill: SceneryPhetColors.solutionFillProperty,
      solutionShadowFill: SceneryPhetColors.solutionShadowFillProperty,
      solutionGlareFill: SceneryPhetColors.solutionShineFillProperty,
      beakerGlareFill: SceneryPhetColors.beakerShineFillProperty,
      beakerHeight: 100,
      xRadius: 30,
      yRadius: 12,
      showTicks: false,
      numTicks: 4
    }, providedOptions );

    const centerTop = -options.beakerHeight / 2;
    const centerBottom = options.beakerHeight / 2;
    const numTicks = 5;

    // Beaker structure and glare shapes
    const beakerGlareShape = new Shape()
      .moveTo( -20, centerTop + 18 )
      .verticalLineTo( 50 )
      .lineTo( -15, 52 )
      .verticalLineTo( centerTop + 21 )
      .close();

    const beakerFrontShape = new Shape()
      .ellipticalArc( 0, centerBottom, options.xRadius, options.yRadius, 0, 0, Math.PI, false )
      .ellipticalArc( 0, centerTop, options.xRadius, options.yRadius, 0, Math.PI, 0, true )
      .close();

    const beakerBackShape = new Shape()
      .ellipticalArc( 0, centerTop, options.xRadius, options.yRadius, 0, Math.PI, 0, false )
      .ellipticalArc( 0, centerBottom, options.xRadius, options.yRadius, 0, 0, Math.PI, true )
      .close();

    const beakerBottomShape = new Shape()
      .ellipticalArc( 0, centerBottom, options.xRadius, options.yRadius, 0, 0, 2 * Math.PI, false );

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
      stroke: 'black',
      lineWidth: 2
    } );

    const beakerBack = new Path( beakerBackShape, {
      stroke: 'black',
      lineWidth: 2,
      fill: options.emptyBeakerFill
    } );

    beakerBack.setScaleMagnitude( -1, 1 );
    const beakerBottom = new Path( beakerBottomShape, {
      stroke: 'black',
      fill: options.emptyBeakerFill,
      pickable: false
    } );

    const beakerGlare = new Path( beakerGlareShape.getOffsetShape( 2 ), {
      fill: options.beakerGlareFill
    } );

    const ticksShape = new Shape();
    let y = centerBottom;
    for ( let i = 0; i < numTicks - 1; i++ ) {
      y -= options.beakerHeight / options.numTicks;
      const centralAngle = Math.PI * 0.83;
      const offsetAngle = Math.PI * ( i % 2 === 0 ? 0.07 : 0.1 );
      ticksShape.ellipticalArc( 0, y, options.xRadius, options.yRadius, 0, centralAngle + offsetAngle, centralAngle - offsetAngle, true ).newSubpath();
    }

    const ticks = new Path( ticksShape, {
      stroke: 'black',
      lineWidth: 1.5,
      pickable: false
    } );

    // solution level adjustment listener
    solutionLevelProperty.link( solutionLevel => {
      const centerLiquidY = centerBottom - options.beakerHeight * solutionLevel;
      const solutionTopShape = new Shape()
        .ellipticalArc( 0, centerLiquidY, options.xRadius, options.yRadius, 0, 0, Math.PI * 2, false )
        .close();
      const solutionSideShape = new Shape()
        .ellipticalArc( 0, centerLiquidY, options.xRadius, options.yRadius, 0, Math.PI, 0, true )
        .ellipticalArc( 0, centerBottom, options.xRadius, options.yRadius, 0, 0, Math.PI, false )
        .close();
      const solutionFrontEdgeShape = new Shape()
        .ellipticalArc( 0, centerLiquidY + 1, options.xRadius, options.yRadius + 2, 0, Math.PI, 0, true )
        .ellipticalArc( 0, centerLiquidY, options.xRadius, options.yRadius, 0, 0, Math.PI, false );
      const solutionBackEdgeShape = new Shape()
        .ellipticalArc( 0, centerBottom - 1, options.xRadius, options.yRadius + 4, Math.PI, Math.PI, 0, true )
        .ellipticalArc( 0, centerBottom, options.xRadius, options.yRadius, Math.PI, 0, Math.PI, false );
      const solutionCrescentShape = new Shape()
        .ellipticalArc( 8, centerLiquidY, options.yRadius * 0.75, options.xRadius * 0.4, Math.PI * 1.5, Math.PI, 0, true )
        .ellipticalArc( 8, centerLiquidY, options.yRadius * 0.75, options.xRadius * 0.6, Math.PI * 1.5, 0, Math.PI, false );

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
    } );

    // Prevents front edge from dipping below beaker boundary when dragged all the way down.
    solutionFrontEdge.clipArea = Shape.union( [ beakerFrontShape, beakerBottomShape ] );

    const children = [
      beakerBack,
      beakerBottom,
      solutionSide,
      solutionBackEdge,
      solutionTop,
      solutionGlare,
      solutionFrontEdge,
      beakerFront,
      ...( options.showTicks ? [ ticks ] : [] ),
      beakerGlare
    ];

    const mergedOptions = optionize<BeakerNodeOptions, SelfOptions, NodeOptions>()( options, { children: children } );
    super( mergedOptions );
  }
}

sceneryPhet.register( 'BeakerNode', BeakerNode );