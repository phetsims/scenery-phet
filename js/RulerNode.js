// Copyright 2013-2017, University of Colorado Boulder

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
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var Shape = require( 'KITE/Shape' );
  var Tandem = require( 'TANDEM/Tandem' );
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
      tickMarksOnBottom: true,

      // phet-io
      tandem: Tandem.required
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
      lineWidth: options.backgroundLineWidth,
      tandem: options.tandem.createTandem( 'backgroundNode' )
    } );
    this.addChild( backgroundNode );

    // Lay out tick marks from left to right
    var minorTickWidth = majorTickWidth / ( options.minorTicksPerMajorTick + 1 );
    var numberOfTicks = Math.floor( rulerWidth / minorTickWidth ) + 1;
    var x = options.insetsWidth;
    var majorTickIndex = 0;

    // Minimize number of nodes by using one path for each type of tick line
    var majorTickLinesShape = new Shape();
    var minorTickLinesShape = new Shape();

    // Units label, which is positioned and (if necessary) scaled later
    var unitsLabel = new Text( units, {
      font: options.unitsFont,
      pickable: false,
      tandem: options.tandem.createTandem( 'unitsLabel' )
    } );
    var unitsLabelMaxWidth = Number.POSITIVE_INFINITY;
    this.addChild( unitsLabel );

    var majorTickLabelsGroupTandem = options.tandem.createGroupTandem( 'majorTickLabels' );

    for ( var i = 0; i < numberOfTicks; i++ ) {

      if ( i % ( options.minorTicksPerMajorTick + 1 ) === 0 ) {  // assumes that the first (leftmost) tick is a major tick

        // Major tick

        // Create the tick label regardless of whether we add it, since it's required to layout the units label
        var majorTickLabel = majorTickLabels[ majorTickIndex ];
        var majorTickLabelNode = new Text( majorTickLabel, {
          font: options.majorTickFont,
          centerX: x,
          centerY: backgroundNode.centerY,
          pickable: false,
          tandem: majorTickLabelsGroupTandem.createNextTandem()
        } );

        // Only add a major tick at leftmost or rightmost end if the insetsWidth is nonzero
        if ( options.insetsWidth !== 0 || ( i !== 0 && i !== numberOfTicks - 1 ) ) {

          // label, only added as a child if it's non-empty (and non-null)
          if ( majorTickLabel ) {
            this.addChild( majorTickLabelNode );
          }

          // line
          if ( options.tickMarksOnTop ) {
            majorTickLinesShape.moveTo( x, 0 ).lineTo( x, options.majorTickHeight );
          }
          if ( options.tickMarksOnBottom ) {
            majorTickLinesShape.moveTo( x, rulerHeight - options.majorTickHeight ).lineTo( x, rulerHeight );
          }
        }

        // Position the units label
        if ( majorTickIndex === options.unitsMajorTickIndex ) {
          unitsLabel.left = majorTickLabelNode.right + options.unitsSpacing;
          unitsLabel.y = majorTickLabelNode.y;
        }
        else if ( majorTickIndex > options.unitsMajorTickIndex && unitsLabelMaxWidth === Number.POSITIVE_INFINITY && majorTickLabelNode.width > 0 ) {
          // make sure the units label fits between the tick mark labels
          if ( unitsLabel.right > ( majorTickLabelNode.left - options.unitsSpacing ) ) {
            unitsLabelMaxWidth = majorTickLabelNode.left - options.unitsSpacing - unitsLabel.left;
            assert && assert( unitsLabelMaxWidth > 0, 'space for units label is negative or zero' );
            unitsLabel.maxWidth = unitsLabelMaxWidth;
          }
        }

        majorTickIndex++;
      }
      else {
        // Minor tick
        // Only add a minor tick at leftmost or rightmost end if the insetsWidth is nonzero
        if ( options.insetsWidth !== 0 || ( i !== 0 && i !== numberOfTicks - 1 ) ) {
          if ( options.tickMarksOnTop ) {
            minorTickLinesShape.moveTo( x, 0 ).lineTo( x, options.minorTickHeight );
          }
          if ( options.tickMarksOnBottom ) {
            minorTickLinesShape.moveTo( x, rulerHeight - options.minorTickHeight ).lineTo( x, rulerHeight );
          }
        }
      }
      x += minorTickWidth;
    }

    // Handle the case where the units label extends off the edge of the ruler.  This is kind of a corner case, but was
    // seen when testing long strings on Pendulum Lab.
    if ( unitsLabel.bounds.maxX > backgroundNode.bounds.maxX - options.unitsSpacing ) {
      unitsLabelMaxWidth = ( backgroundNode.bounds.maxX - options.unitsSpacing ) - unitsLabel.x;
      unitsLabel.scale( unitsLabelMaxWidth / unitsLabel.width );
    }

    // Major tick lines
    this.addChild( new Path( majorTickLinesShape, {
      stroke: options.majorTickStroke,
      lineWidth: options.majorTickLineWidth,
      pickable: false,
      tandem: options.tandem.createTandem( 'majorTickLinesNode' )
    } ) );

    // Minor tick lines
    this.addChild( new Path( minorTickLinesShape, {
      stroke: options.minorTickStroke,
      lineWidth: options.minorTickLineWidth,
      pickable: false,
      tandem: options.tandem.createTandem( 'minorTickLinesNode' )
    } ) );

    this.mutate( options );
  }

  sceneryPhet.register( 'RulerNode', RulerNode );

  return inherit( Node, RulerNode );
} );
