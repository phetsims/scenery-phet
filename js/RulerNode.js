// Copyright 2013, University of Colorado

/**
 * Visual representation of a ruler.
 * Lots of options, see default options in constructor.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function ( require ) {
  'use strict';

  // imports
  var assert = require( 'ASSERT/assert' )( 'scenery-phet' );
  var inherit = require( "PHET_CORE/inherit" );
  var Node = require( "SCENERY/nodes/Node" );
  var Path = require( "SCENERY/nodes/Path" );
  var Rectangle = require( "SCENERY/nodes/Rectangle" );
  var Shape = require( "KITE/Shape" );
  var Text = require( "SCENERY/nodes/Text" );

  /**
   * @param {number} width
   * @param {number} height
   * @param {Array<String>} majorTickLabels
   * @param {String} units
   * @param {object} options
   * @constructor
   */
  function RulerNode( width, height, majorTickLabels, units, options ) {

    // default options
    options = _.extend(
      {
        // body of the ruler
        backgroundFill: "rgb(236, 225, 113)",
        backgroundStroke: "black",
        backgroundLineWidth: 1,
        insetsWidth: 14, // space between the ends of the ruler and the first and last tick marks
        // major tick options
        majorTickFont: "18px Arial",
        majorTickHeight: ( 0.4 * height ) / 2,
        majorTickStroke: "black",
        majorTickLineWidth: 1,
        // minor tick options
        minorTickFont: "18px Arial",
        minorTickHeight: ( 0.2 * height ) / 2,
        minorTickStroke: "black",
        minorTickLineWidth: 1,
        minorTicksPerMajorTick: 0,
        // units options
        unitsFont: "18px Arial",
        unitsMajorTickIndex: 0, // units will be place to the right of this major tick
        unitsSpacing: 3 // horizontal space between the tick label and the units
      }, options );

    // things you're likely to mess up, add more as needed
    assert && assert( options.unitsMajorTickIndex < majorTickLabels.length );
    assert && assert( options.majorTickHeight < height / 2 );
    assert && assert( options.minorTickHeight < height / 2 );

    var thisNode = this;
    Node.call( thisNode, options );

    // background
    var backgroundNode = new Rectangle( 0, 0, width, height,
                                        { fill: options.backgroundFill,
                                          stroke: options.backgroundStroke,
                                          lineWidth: options.backgroundLineWidth } )
    thisNode.addChild( backgroundNode );

    var distanceBetweenFirstAndLastTick = width - ( 2 * options.insetsWidth );
    var distBetweenMajorReadings = distanceBetweenFirstAndLastTick / ( majorTickLabels.length - 1 );
    var distBetweenMinor = distBetweenMajorReadings / ( options.minorTicksPerMajorTick + 1 );

    // Lay out tick marks from left to right
    for ( var i = 0; i < majorTickLabels.length; i++ ) {

      // Major tick label
      var majorTickLabel = majorTickLabels[i];
      var majorTickLabelNode = new Text( majorTickLabel, { font: options.majorTickFont } );
      var xVal = ( distBetweenMajorReadings * i ) + options.insetsWidth;
      var yVal = ( height / 2 ) - ( majorTickLabelNode.height / 2 );
      //Clamp and make sure the labels stay within the ruler, especially if the insetsWidth has been set low (or to zero)
      majorTickLabelNode.x = xVal - ( majorTickLabelNode.width / 2 );
      majorTickLabelNode.centerY = backgroundNode.centerY;

      // Only add the major tick label if the insetsWidth is nonzero, or if it is not an end label
      if ( options.insetsWidth != 0 || ( i != 0 && i != majorTickLabels.length - 1 ) ) {
        thisNode.addChild( majorTickLabelNode );
      }

      // Major tick mark
      var majorTickNode = thisNode.createTickMarkNode( xVal, height, options.majorTickHeight, options.majorTickStroke, options.majorTickLineWidth );
      thisNode.addChild( majorTickNode );

      // Minor tick marks
      if ( i < majorTickLabels.length - 1 ) {
        for ( var k = 1; k <= options.minorTicksPerMajorTick; k++ ) {
          var minorTickNode = thisNode.createTickMarkNode( xVal + k * distBetweenMinor, height, options.minorTickHeight, options.minorTickStroke, options.minorTickLineWidth );
          thisNode.addChild( minorTickNode );
        }
      }

      // units label
      if ( i === options.unitsMajorTickIndex ) {
        var unitsNode = new Text( units, { font: options.unitsFont } );
        thisNode.addChild( unitsNode );
        unitsNode.x = majorTickLabelNode.x + majorTickLabelNode.width + options.unitsSpacing;
        unitsNode.y = majorTickLabelNode.y + majorTickLabelNode.height - unitsNode.height;
      }
    }
  }

  inherit( RulerNode, Node );

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
   * @return {Node}
   */
  RulerNode.prototype.createTickMarkNode = function ( x, rulerHeight, tickHeight, stroke, lineWidth ) {
    var shape = new Shape().moveTo( x, 0 ).lineTo( x, tickHeight ).moveTo( x, rulerHeight - tickHeight ).lineTo( x, rulerHeight );
    return new Path( { stroke: stroke, lineWidth: lineWidth, shape: shape } );
  };

  return RulerNode;
} );
