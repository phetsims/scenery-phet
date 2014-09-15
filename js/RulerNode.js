// Copyright 2002-2013, University of Colorado Boulder

/**
 * Visual representation of a ruler.
 * Lots of options, see default options in constructor.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Shape = require( 'KITE/Shape' );
  var Text = require( 'SCENERY/nodes/Text' );

  // constants
  var DEFAULT_FONT = new PhetFont( 18 );

  /**
   * @param {number} width  distance between left-most and right-most tick, insets will be added to this
   * @param {number} height
   * @param {number} majorTickWidth
   * @param {Array<String>} majorTickLabels
   * @param {String} units
   * @param {Object} [options]
   * @constructor
   */
  function RulerNode( width, height, majorTickWidth, majorTickLabels, units, options ) {

    // default options
    options = _.extend(
      {
        // body of the ruler
        backgroundFill: 'rgb(236, 225, 113)',
        backgroundStroke: 'black',
        backgroundLineWidth: 1,
        insetsWidth: 14, // space between the ends of the ruler and the first and last tick marks
        // major tick options
        majorTickFont: DEFAULT_FONT,
        majorTickHeight: ( 0.4 * height ) / 2,
        majorTickStroke: 'black',
        majorTickLineWidth: 1,
        // minor tick options
        minorTickFont: DEFAULT_FONT,
        minorTickHeight: ( 0.2 * height ) / 2,
        minorTickStroke: 'black',
        minorTickLineWidth: 1,
        minorTicksPerMajorTick: 0,
        // units options
        unitsFont: DEFAULT_FONT,
        unitsMajorTickIndex: 0, // units will be place to the right of this major tick
        unitsSpacing: 3, // horizontal space between the tick label and the units
        // appearance options
        tickMarksOnTop: true,
        tickMarksOnBottom: true
      }, options );

    // things you're likely to mess up, add more as needed
    assert && assert( Math.floor( width / majorTickWidth ) + 1 === majorTickLabels.length ); // do we have enough major tick labels?
    assert && assert( options.unitsMajorTickIndex < majorTickLabels.length );
    assert && assert( options.majorTickHeight < height / 2 );
    assert && assert( options.minorTickHeight < height / 2 );

    var thisNode = this;
    Node.call( thisNode, options );

    // background
    var backgroundNode = new Rectangle( 0, 0, width + ( 2 * options.insetsWidth ), height,
      { fill: options.backgroundFill,
        stroke: options.backgroundStroke,
        lineWidth: options.backgroundLineWidth } );
    thisNode.addChild( backgroundNode );

    // Lay out tick marks from left to right
    var minorTickWidth = majorTickWidth / ( options.minorTicksPerMajorTick + 1 );
    var x = options.insetsWidth;
    var majorTickIndex = 0;

    var ticksContainerNode = new Node( { pickable: false } );
    this.addChild( ticksContainerNode );

    while ( x < ( width + options.insetsWidth + options.insetsWidth ) ) {

      if ( ( x - options.insetsWidth ) % majorTickWidth === 0 ) {

        // Major tick label
        var majorTickLabel = majorTickLabels[majorTickIndex];
        var majorTickLabelNode = new Text( majorTickLabel, { font: options.majorTickFont } );
        //Clamp and make sure the labels stay within the ruler, especially if the insetsWidth has been set low (or to zero)
        majorTickLabelNode.x = x - ( majorTickLabelNode.width / 2 );
        majorTickLabelNode.centerY = backgroundNode.centerY;

        // Only add the major tick label if the insetsWidth is nonzero, or if it is not an end label
        if ( options.insetsWidth !== 0 || ( majorTickIndex !== 0 ) ) {
          ticksContainerNode.addChild( majorTickLabelNode );
        }

        // Major tick mark
        var majorTickNode = createTickMarkNode( x, height, options.majorTickHeight, options.majorTickStroke, options.majorTickLineWidth, options.tickMarksOnTop, options.tickMarksOnBottom );
        ticksContainerNode.addChild( majorTickNode );

        // units label
        if ( majorTickIndex === options.unitsMajorTickIndex ) {
          var unitsNode = new Text( units, { font: options.unitsFont } );
          ticksContainerNode.addChild( unitsNode );
          unitsNode.x = majorTickLabelNode.x + majorTickLabelNode.width + options.unitsSpacing;
          unitsNode.y = majorTickLabelNode.y + majorTickLabelNode.height - unitsNode.height;
        }

        majorTickIndex++;
        x += minorTickWidth;
      }
      else {
        // Minor tick marks
        for ( var k = 1; ( k <= options.minorTicksPerMajorTick ) && ( x < ( width + options.insetsWidth + options.insetsWidth ) ); k++ ) {
          var minorTickNode = createTickMarkNode( x, height, options.minorTickHeight, options.minorTickStroke, options.minorTickLineWidth, options.tickMarksOnTop, options.tickMarksOnBottom );
          ticksContainerNode.addChild( minorTickNode );
          x += minorTickWidth;
        }
      }
    }
  }

  inherit( Node, RulerNode );

  /**
   * Creates a tick mark at a specific x location.
   * Each tick is marked at the top and bottom of the ruler.
   * If you desire a different style of tick mark, override this method.
   *
   * @param {number} x
   * @param {number} rulerHeight
   * @param {number} tickHeight
   * @param {String} stroke stroke color as a CSS string
   * @param {number} lineWidth
   * @param {boolean} drawUpper
   * @param {boolean} drawLower
   * @return {Node}
   */
  var createTickMarkNode = function( x, rulerHeight, tickHeight, stroke, lineWidth, drawUpper, drawLower ) {
    var shape = new Shape();
    if ( drawUpper ) {
      shape.moveTo( x, 0 ).lineTo( x, tickHeight );
    }
    if ( drawLower ) {
      shape.moveTo( x, rulerHeight - tickHeight ).lineTo( x, rulerHeight );
    }
    return new Path( shape, { stroke: stroke, lineWidth: lineWidth } );
  };

  return RulerNode;
} );
