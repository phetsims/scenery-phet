// Copyright 2018-2019, University of Colorado Boulder

/**
 * Displays a beaker graphic
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import Shape from '../../../../../kite/js/Shape.js';
import merge from '../../../../../phet-core/js/merge.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import Path from '../../../../../scenery/js/nodes/Path.js';
import LinearGradient from '../../../../../scenery/js/util/LinearGradient.js';
import FractionsCommonColorProfile from '../../../common/view/FractionsCommonColorProfile.js';
import fractionsCommon from '../../../fractionsCommon.js';

// constants
const EMPTY_BEAKER_COLOR = FractionsCommonColorProfile.emptyBeakerProperty;
const WATER_COLOR = FractionsCommonColorProfile.waterProperty;
const BEAKER_SHINE_COLOR = FractionsCommonColorProfile.beakerShineProperty;

class BeakerNode extends Node {
  /**
   * @param {number} numerator
   * @param {number} denominator
   * @param {Object} [options]
   */
  constructor( numerator, denominator, options ) {
    assert && assert( typeof numerator === 'number' && numerator >= 0 && numerator % 1 === 0 );
    assert && assert( typeof denominator === 'number' && denominator >= 1 && denominator % 1 === 0 );

    options = merge( {
      // {number}
      fullHeight: BeakerNode.DEFAULT_BEAKER_HEIGHT,
      xRadius: 40,
      yRadius: 12,

      // {ColorDef} - If non-null, it will override the given color for the water
      colorOverride: null
    }, options );

    const height = options.fullHeight * numerator / denominator;
    const xRadius = options.xRadius;
    const yRadius = options.yRadius;
    const numTicks = denominator;

    const glassGradient = new LinearGradient( -xRadius, 0, xRadius, 0 )
      .addColorStop( 0, EMPTY_BEAKER_COLOR )
      .addColorStop( 0.666, BEAKER_SHINE_COLOR )
      .addColorStop( 0.782, BEAKER_SHINE_COLOR )
      .addColorStop( 1, EMPTY_BEAKER_COLOR );

    const centerTop = -options.fullHeight / 2;
    const centerBottom = options.fullHeight / 2;
    const centerLiquidY = centerBottom - height;

    const bucketFrontShape = new Shape()
      .ellipticalArc( 0, centerBottom, xRadius, yRadius, 0, 0, Math.PI, false )
      .ellipticalArc( 0, centerTop, xRadius, yRadius, 0, Math.PI, 0, true )
      .close();
    const bucketBackShape = new Shape()
      .ellipticalArc( 0, centerTop, xRadius, yRadius, 0, Math.PI, 0, false )
      .ellipticalArc( 0, centerBottom, xRadius, yRadius, 0, 0, Math.PI, true )
      .close();
    const bucketBottomShape = new Shape()
      .ellipticalArc( 0, centerBottom, xRadius, yRadius, 0, 0, 2 * Math.PI, false );
    const waterTopShape = new Shape()
      .ellipticalArc( 0, centerLiquidY, xRadius, yRadius, 0, 0, Math.PI * 2, false )
      .close();
    const waterSideShape = new Shape()
      .ellipticalArc( 0, centerLiquidY, xRadius, yRadius, 0, Math.PI, 0, true )
      .ellipticalArc( 0, centerBottom, xRadius, yRadius, 0, 0, Math.PI, false )
      .close();

    const ticksShape = new Shape();
    let y = centerBottom;
    for ( let i = 0; i < numTicks - 1; i++ ) {
      y -= options.fullHeight / numTicks;
      const centralAngle = Math.PI * 0.83;
      const offsetAngle = Math.PI * ( i % 2 === 0 ? 0.07 : 0.1 );
      ticksShape.ellipticalArc( 0, y, xRadius, yRadius, 0, centralAngle + offsetAngle, centralAngle - offsetAngle, true ).newSubpath();
    }

    const waterColor = options.colorOverride ? options.colorOverride : WATER_COLOR;

    const bucketFront = new Path( bucketFrontShape, {
      stroke: 'grey',
      fill: glassGradient
    } );
    const bucketBack = new Path( bucketBackShape, {
      stroke: 'grey',
      fill: glassGradient
    } );
    bucketBack.setScaleMagnitude( -1, 1 );
    const bucketBottom = new Path( bucketBottomShape, {
      stroke: 'grey',
      fill: EMPTY_BEAKER_COLOR,
      pickable: false
    } );
    const waterSide = new Path( waterSideShape, {
      stroke: 'black',
      fill: waterColor,
      pickable: false
    } );
    const waterTop = new Path( waterTopShape, {
      fill: waterColor,
      pickable: false
    } );
    const ticks = new Path( ticksShape, {
      stroke: 'black',
      lineWidth: 1.5,
      pickable: false
    } );

    super( {
      children: [
        bucketBack,
        bucketBottom,
        ...( numerator > 0 ? [
          waterSide,
          waterTop
        ] : [] ),
        bucketFront,
        ticks
      ]
    } );

    this.mutate( options );
  }
}

// @public {number} - The normal height of a beaker
BeakerNode.DEFAULT_BEAKER_HEIGHT = 150;

fractionsCommon.register( 'BeakerNode', BeakerNode );
export default BeakerNode;