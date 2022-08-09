// Copyright 2019-2022, University of Colorado Boulder

/**
 * A node that represents a quantity as a segmented bar graph.
 *
 * @author John Blanco
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import Range from '../../dot/js/Range.js';
import Multilink from '../../axon/js/Multilink.js';
import InstanceRegistry from '../../phet-core/js/documentation/InstanceRegistry.js';
import optionize from '../../phet-core/js/optionize.js';
import { TColor, Node, NodeOptions, Rectangle } from '../../scenery/js/imports.js';
import sceneryPhet from './sceneryPhet.js';
import TReadOnlyProperty from '../../axon/js/TReadOnlyProperty.js';

type SelfOptions = {

  width?: number;
  height?: number;
  numSegments?: number;
  backgroundColor?: TColor;
  fullyLitIndicatorColor?: TColor;

  // proportion of the width consumed by the indicator in the vertical direction, must be > 0 and <= to 1
  indicatorWidthProportion?: number;

  // proportion of the each segment consumed by the indicator in the vertical direction, must be > 0 and <= to 1
  indicatorHeightProportion?: number;
};

export type SegmentedBarGraphNodeOptions = SelfOptions & NodeOptions;

export default class SegmentedBarGraphNode extends Node {

  public constructor( numberProperty: TReadOnlyProperty<number>,
                      rangeProperty: TReadOnlyProperty<Range>,
                      providedOptions?: SegmentedBarGraphNodeOptions ) {

    const options = optionize<SegmentedBarGraphNodeOptions, SelfOptions, NodeOptions>()( {

      // SelfOptions
      width: 10,
      height: 100,
      numSegments: 10,
      backgroundColor: 'black',
      fullyLitIndicatorColor: '#1EC700',
      indicatorWidthProportion: 0.8,
      indicatorHeightProportion: 0.8
    }, providedOptions );

    // Validate options
    assert && assert( options.indicatorWidthProportion > 0 && options.indicatorWidthProportion <= 1,
      `indicatorWidthProportion is out of range: ${options.indicatorWidthProportion}` );
    assert && assert( options.indicatorHeightProportion > 0 && options.indicatorHeightProportion <= 1,
      `indicatorHeightProportion is out of range: ${options.indicatorHeightProportion}` );

    super();

    // add the background
    this.addChild( new Rectangle( 0, 0, options.width, options.height, { fill: options.backgroundColor } ) );

    // add the indicator segments
    const indicatorWidth = options.width * options.indicatorWidthProportion;
    const segmentHeight = options.height / options.numSegments;
    const indicatorHeight = segmentHeight * options.indicatorHeightProportion;
    const indicators: Rectangle[] = [];
    _.times( options.numSegments, index => {
      const indicator = new Rectangle( 0, 0, indicatorWidth, indicatorHeight, {
        centerX: options.width / 2,
        centerY: options.height - index * segmentHeight - segmentHeight * 0.5,
        fill: options.fullyLitIndicatorColor
      } );
      this.addChild( indicator );
      indicators.push( indicator );
    } );

    // set the visibility and opacity of each of the segments based on the value and range
    Multilink.multilink( [ numberProperty, rangeProperty ], ( value, range ) => {
      assert && assert( range.min <= value && value <= range.max,
        `numberProperty is out of range: ${value}` );

      const proportion = 1 - value / range.max;
      const numVisibleIndicators = Math.ceil( options.numSegments * proportion );
      for ( let i = 0; i < options.numSegments; i++ ) {
        indicators[ i ].visible = i < numVisibleIndicators;
        indicators[ i ].opacity = 1;
      }
      if ( numVisibleIndicators > 0 ) {
        indicators[ numVisibleIndicators - 1 ].opacity =
          1 - ( Math.ceil( options.numSegments * proportion ) - ( options.numSegments * proportion ) );
      }
    } );

    this.mutate( options );

    // support for binder documentation, stripped out in builds and only runs when ?binder is specified
    assert && phet.chipper.queryParameters.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'SegmentedBarGraphNode', this );
  }
}

sceneryPhet.register( 'SegmentedBarGraphNode', SegmentedBarGraphNode );