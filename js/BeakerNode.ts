// Copyright 2018-2022, University of Colorado Boulder

/**
 * Displays a beaker graphic
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import { Shape } from '../../kite/js/imports.js';
import SceneryPhetColors from './SceneryPhetColors.js';
import sceneryPhet from './sceneryPhet.js';
import { Node, NodeOptions, Path } from '../../scenery/js/imports.js';
import optionize from '../../phet-core/js/optionize.js';
import NumberProperty from '../../axon/js/NumberProperty.js';

type SelfOptions = {};
type BeakerNodeOptions = SelfOptions & NodeOptions

// constants
const EMPTY_BEAKER_COLOR = SceneryPhetColors.emptyBeakerProperty;
const WATER_COLOR = SceneryPhetColors.waterProperty;
const WATER_FRONT_EDGE = SceneryPhetColors.waterFrontEdgeFillColorProperty;
const WATER_BACK_EDGE = SceneryPhetColors.waterBackEdgeFillColorProperty;
const WATER_CRESCENT = SceneryPhetColors.waterCrescentFillColorProperty;
const BEAKER_SHINE_COLOR = SceneryPhetColors.beakerShineProperty;
const CUP_HEIGHT = 50;

export default class BeakerNode extends Node {
  constructor( waterLevelProperty: NumberProperty,
               providedOptions?: BeakerNodeOptions ) {

    const xRadius = 30;
    const yRadius = 12;
    const centerTop = -CUP_HEIGHT / 2;
    const centerBottom = CUP_HEIGHT / 2;
    const numTicks = 5;

    // Cup structure and glare shapes
    const cupGlareShape = new Shape()
      .moveTo( -20, centerTop + 18 )
      .verticalLineTo( 50 )
      .lineTo( -15, 52 )
      .verticalLineTo( centerTop + 21 )
      .close();

    const cupFrontShape = new Shape()
      .ellipticalArc( 0, centerBottom, xRadius, yRadius, 0, 0, Math.PI, false )
      .ellipticalArc( 0, centerTop, xRadius, yRadius, 0, Math.PI, 0, true )
      .close();

    const cupBackShape = new Shape()
      .ellipticalArc( 0, centerTop, xRadius, yRadius, 0, Math.PI, 0, false )
      .ellipticalArc( 0, centerBottom, xRadius, yRadius, 0, 0, Math.PI, true )
      .close();

    const cupBottomShape = new Shape()
      .ellipticalArc( 0, centerBottom, xRadius, yRadius, 0, 0, 2 * Math.PI, false );

    // Water fill and shading paths
    const waterSide = new Path( null, {
      fill: WATER_COLOR,
      pickable: false
    } );
    const waterTop = new Path( null, {
      fill: WATER_COLOR,
      pickable: false
    } );
    const waterFrontEdge = new Path( null, {
      fill: WATER_FRONT_EDGE,
      pickable: false
    } );
    const waterBackEdge = new Path( null, {
      fill: WATER_BACK_EDGE,
      pickable: false
    } );
    const waterCrescent = new Path( null, {
      fill: WATER_CRESCENT
    } );

    // Water cup structure and glare paths
    const cupFront = new Path( cupFrontShape, {
      stroke: 'black',
      lineWidth: 2
    } );

    const cupBack = new Path( cupBackShape, {
      stroke: 'black',
      lineWidth: 2,
      fill: EMPTY_BEAKER_COLOR
    } );

    cupBack.setScaleMagnitude( -1, 1 );
    const cupBottom = new Path( cupBottomShape, {
      stroke: 'black',
      fill: 'white',
      pickable: false
    } );

    const cupGlare = new Path( cupGlareShape.getOffsetShape( 2 ), {
      fill: BEAKER_SHINE_COLOR,
      opacity: 0.35
    } );

    const ticksShape = new Shape();
    let y = centerBottom;
    for ( let i = 0; i < numTicks - 1; i++ ) {
      y -= CUP_HEIGHT / numTicks;
      const centralAngle = Math.PI * 0.83;
      const offsetAngle = Math.PI * ( i % 2 === 0 ? 0.07 : 0.1 );
      ticksShape.ellipticalArc( 0, y, xRadius, yRadius, 0, centralAngle + offsetAngle, centralAngle - offsetAngle, true ).newSubpath();
    }

    // water level adjustment listener
    waterLevelProperty.link( waterLevel => {
      const centerLiquidY = centerBottom - CUP_HEIGHT * waterLevel;
      const waterTopShape = new Shape()
        .ellipticalArc( 0, centerLiquidY, xRadius, yRadius, 0, 0, Math.PI * 2, false )
        .close();
      const waterSideShape = new Shape()
        .ellipticalArc( 0, centerLiquidY, xRadius, yRadius, 0, Math.PI, 0, true )
        .ellipticalArc( 0, centerBottom, xRadius, yRadius, 0, 0, Math.PI, false )
        .close();
      const waterFrontEdgeShape = new Shape()
        .ellipticalArc( 0, centerLiquidY + 1, xRadius, yRadius + 2, 0, Math.PI, 0, true )
        .ellipticalArc( 0, centerLiquidY, xRadius, yRadius, 0, 0, Math.PI, false );
      const waterBackEdgeShape = new Shape()
        .ellipticalArc( 0, centerBottom - 1, xRadius, yRadius + 4, Math.PI, Math.PI, 0, true )
        .ellipticalArc( 0, centerBottom, xRadius, yRadius, Math.PI, 0, Math.PI, false );
      const waterCrescentShape = new Shape()
        .ellipticalArc( 8, centerLiquidY, yRadius * 0.75, xRadius * 0.4, Math.PI * 1.5, Math.PI, 0, true )
        .ellipticalArc( 8, centerLiquidY, yRadius * 0.75, xRadius * 0.6, Math.PI * 1.5, 0, Math.PI, false );

      waterTop.shape = waterTopShape;
      waterSide.shape = waterSideShape;
      waterFrontEdge.shape = waterFrontEdgeShape;
      waterBackEdge.shape = waterBackEdgeShape;
      waterCrescent.shape = waterCrescentShape;

      //Prevents back edge from appearing when water level empty.
      waterBackEdge.clipArea = Shape.union( [ waterTopShape, waterSideShape ] );

    } );

    // Prevents front edge from dipping below cup boundary when dragged all the way down.
    waterFrontEdge.clipArea = Shape.union( [ cupFrontShape, cupBottomShape ] );

    const options = optionize<BeakerNodeOptions, SelfOptions, NodeOptions>()( {
      children: [
        cupBack,
        cupBottom,
        waterSide,
        waterBackEdge,
        waterTop,
        waterCrescent,
        waterFrontEdge,
        cupFront,
        cupGlare
      ]
    }, providedOptions );

    super( options );
  }
}

sceneryPhet.register( 'BeakerNode', BeakerNode );