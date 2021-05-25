// Copyright 2019-2021, University of Colorado Boulder

/**
 * A node that represents a quantity as a segmented bar graph.
 *
 * @author John Blanco
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import Property from '../../axon/js/Property.js';
import InstanceRegistry from '../../phet-core/js/documentation/InstanceRegistry.js';
import merge from '../../phet-core/js/merge.js';
import Node from '../../scenery/js/nodes/Node.js';
import Rectangle from '../../scenery/js/nodes/Rectangle.js';
import sceneryPhet from './sceneryPhet.js';

class SegmentedBarGraphNode extends Node {

  /**
   * @param {NumberProperty} numberProperty
   * @param {Property.<Range>} rangeProperty
   * @param {Object} [options]
   */
  constructor( numberProperty, rangeProperty, options ) {
    options = merge( {
      width: 10,
      height: 100,
      numSegments: 10,
      backgroundColor: 'black',
      fullyLitIndicatorColor: '#1EC700',

      // proportion of the width consumed by the indicator in the vertical direction, must be > 0 and <= to 1
      indicatorWidthProportion: 0.8,

      // proportion of the each segment consumed by the indicator in the vertical direction, must be > 0 and <= to 1
      indicatorHeightProportion: 0.8
    }, options );

    super();

    // add the background
    this.addChild( new Rectangle( 0, 0, options.width, options.height, { fill: options.backgroundColor } ) );

    // add the indicator segments
    const indicatorWidth = options.width * options.indicatorWidthProportion;
    const segmentHeight = options.height / options.numSegments;
    const indicatorHeight = segmentHeight * options.indicatorHeightProportion;
    const indicators = [];
    _.times( options.numSegments, index => {
      const indicator = new Rectangle( 0, 0, indicatorWidth, indicatorHeight, {
        centerX: options.width / 2,
        centerY: options.height - index * segmentHeight - segmentHeight * 0.5,
        fill: options.fullyLitIndicatorColor
      } );
      this.addChild( indicator );
      indicators.push( indicator );
    } );

    // set the visibility and opacity of each of the segments based on the number and range
    Property.multilink( [ numberProperty, rangeProperty ], ( number, range ) => {
      assert && assert( range.min <= number && number <= range.max,
        `numberProperty is out of range, ${number}` );

      const proportion = 1 - number / range.max;
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
export default SegmentedBarGraphNode;