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
   * @param {number} rulerWidth  distance between left-most and right-most tick, insets will be added to this
   * @param {number} rulerHeight
   * @param {number} majorTickWidth
   * @param {string[]} majorTickLabels
   * @param {string} units
   * @param {Object} [options]
   * @constructor
   */
  function RulerNode( rulerWidth, rulerHeight, majorTickWidth, majorTickLabels, units, options ) {

    // default options
    options = _.extend( {
      // body of the ruler
      backgroundFill: 'rgb(236, 225, 113)',
      backgroundStroke: 'black',
      backgroundLineWidth: 1,
      insetsWidth: 14, // space between the ends of the ruler and the first and last tick marks

      // major tick options
      majorTickFont: DEFAULT_FONT,
      majorTickHeight: ( 0.4 * rulerHeight ) / 2,
      majorTickStroke: 'black',
      majorTickLineWidth: 1,

      // minor tick options
      minorTickFont: DEFAULT_FONT,
      minorTickHeight: ( 0.2 * rulerHeight ) / 2,
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
    assert && assert( Math.floor( rulerWidth / majorTickWidth ) + 1 === majorTickLabels.length ); // do we have enough major tick labels?
    assert && assert( options.unitsMajorTickIndex < majorTickLabels.length );
    assert && assert( options.majorTickHeight < rulerHeight / 2 );
    assert && assert( options.minorTickHeight < rulerHeight / 2 );

    Node.call( this );

    // background
    var backgroundNode = new Rectangle( 0, 0, rulerWidth + ( 2 * options.insetsWidth ), rulerHeight, {
      fill: options.backgroundFill,
      stroke: options.backgroundStroke,
      lineWidth: options.backgroundLineWidth
    } );
    this.addChild( backgroundNode );

    // Lay out tick marks from left to right
    var minorTickWidth = majorTickWidth / ( options.minorTicksPerMajorTick + 1 );
    var numberOfTicks = ( rulerWidth / minorTickWidth ) + 1;
    var x = options.insetsWidth;
    var majorTickIndex = 0;

    // Minimize number of nodes by using one Path for each type of tick line
    var majorTickLinesShape = new Shape();
    var minorTickLinesShape = new Shape();

    for ( var i = 0; i < numberOfTicks; i++ ) {

      if ( i % ( options.minorTicksPerMajorTick + 1 ) === 0 ) {  // assumes that the first (leftmost) tick is a major tick

        // Major tick label
        var majorTickLabel = majorTickLabels[ majorTickIndex ];
        var majorTickLabelNode = new Text( majorTickLabel, { font: options.majorTickFont } );

        //TODO what is this doing? there's no clamping going on here.
        // Clamp and make sure the labels stay within the ruler, especially if the insetsWidth has been set low (or to zero)
        majorTickLabelNode.x = x - ( majorTickLabelNode.width / 2 );
        majorTickLabelNode.centerY = backgroundNode.centerY;

        // Only add the major tick label if the insetsWidth is nonzero, or if it is not the first (leftmost) label.
        // Don't exclude the last (rightmost) label because there may be minor ticks to the right of it.
        if ( options.insetsWidth !== 0 || ( majorTickIndex !== 0 ) ) {
          this.addChild( majorTickLabelNode );
        }

        // Major tick line
        if ( options.tickMarksOnTop ) {
          majorTickLinesShape.moveTo( x, 0 ).lineTo( x, options.majorTickHeight );
        }
        if ( options.tickMarksOnBottom ) {
          majorTickLinesShape.moveTo( x, rulerHeight - options.majorTickHeight ).lineTo( x, rulerHeight );
        }

        // Units label
        if ( majorTickIndex === options.unitsMajorTickIndex ) {
          var unitsNode = new Text( units, { font: options.unitsFont } );
          this.addChild( unitsNode );
          unitsNode.x = majorTickLabelNode.x + majorTickLabelNode.width + options.unitsSpacing;
          unitsNode.y = majorTickLabelNode.y + majorTickLabelNode.height - unitsNode.height;
        }

        majorTickIndex++;
      }
      else {
        // Minor tick
        if ( options.tickMarksOnTop ) {
          minorTickLinesShape.moveTo( x, 0 ).lineTo( x, options.minorTickHeight );
        }
        if ( options.tickMarksOnBottom ) {
          minorTickLinesShape.moveTo( x, rulerHeight - options.minorTickHeight ).lineTo( x, rulerHeight );
        }
      }
      x += minorTickWidth;
    }

    // Major tick lines
    this.addChild( new Path( majorTickLinesShape, {
      stroke: options.majorTickStroke,
      lineWidth: options.majorTickLineWidth
    } ) );

    // Minor tick lines
    this.addChild( new Path( minorTickLinesShape, {
      stroke: options.minorTickStroke,
      lineWidth: options.minorTickLineWidth
    } ) );

    this.mutate( options );
  }

  return inherit( Node, RulerNode );
} );
