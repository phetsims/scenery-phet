// Copyright 2020, University of Colorado Boulder

/**
 * A reusable Node that draws a 2D grid. The grid has "minor" lines and optionally "major" lines which are
 * generally more prevalent. Origin is at the top left of the grid, and lines are drawn with
 * desired spacing between the origin and grid width/height.
 *
 * @author Jesse Greenberg
 */

import merge from '../../phet-core/js/merge.js';
import Path from '../../scenery/js/nodes/Path.js';
import sceneryPhet from './sceneryPhet.js';
import Node from '../../scenery/js/nodes/Node.js';
import Shape from '../../kite/js/Shape.js';

class GridNode extends Node {

  /**
   * @param {number} gridWidth
   * @param {number} gridHeight
   * @param {number|null} minorHorizontalLineSpacing - null for hidden minor horizontal lines
   * @param {number|null} minorVerticalLineSpacing - null for hidden minor vertical lines
   * @param {Object} [options]
   */
  constructor( gridWidth, gridHeight, minorHorizontalLineSpacing, minorVerticalLineSpacing, options ) {
    options = merge( {

      // {number|null} spacing between major horizontal lines - no major horizontal lines added if null
      majorHorizontalLineSpacing: null,

      // {number|null} spacing between major vertical lines - no major vertical lines if null
      majorVerticalLineSpacing: null,

      // {Object} - passed to the Path for minor lines
      minorLineOptions: {
        stroke: 'grey',
        lineWidth: 1
      },

      // {Object} - passed to the Path for major lines
      majorLineOptions: {
        stroke: 'black',
        lineWidth: 3
      }
    }, options );

    super();

    // @private
    this.gridWidth = gridWidth;
    this.gridHeight = gridHeight;
    this.minorHorizontalLineSpacing = minorHorizontalLineSpacing;
    this.minorVerticalLineSpacing = minorVerticalLineSpacing;
    this.majorVerticalLineSpacing = options.majorVerticalLineSpacing;
    this.majorHorizontalLineSpacing = options.majorHorizontalLineSpacing;

    // @private {Path} - Path for minor lines
    this.minorPath = new Path( null, options.minorLineOptions );

    // @private {Path} - path for major lines
    this.majorPath = new Path( null, options.majorLineOptions );

    assert && assert( !options.children, 'GridNode sets children' );
    this.children = [ this.minorPath, this.majorPath ];

    this.drawMinorLines();
    this.drawMajorLines();

    // mutate with Node options after grid is drawn so that bounds are defined
    this.mutate( options );
  }

  /**
   * Set the spacing for minor horizontal lines. First line is drawn at y=0 (top of the GridNode).
   * @public
   *
   * @param {number|null} spacing - setting to null hides minor horizontal lines
   */
  setMinorHorizontalLineSpacing( spacing ) {
    assert && assert( spacing === null || spacing > 0, 'if defined, spacing should be greater than zero' );
    this.minorHorizontalLineSpacing = spacing;
    this.drawMinorLines();
  }

  /**
   * Set the spacing for minor vertical lines. First line is drawn at x=0 (left of GridNode).
   * @public
   *
   * @param {number|null} spacing - setting to null hides minor vertical lines
   */
  setMinorVerticalLineSpacing( spacing ) {
    assert && assert( spacing === null || spacing > 0, 'if defined, spacing should be greater than zero' );

    this.minorVerticalLineSpacing = spacing;
    this.drawMinorLines();
  }

  /**
   * Set the spacing for major horizontal lines. First line is drawn at y=0 (top of GridNode).
   * @public
   *
   * @param {number|null} spacing - setting to null hides major horizontal lines
   */
  setMajorHorizontalLineSpacing( spacing ) {
    assert && assert( spacing === null || spacing > 0, 'if defined, spacing should be greater than zero' );

    this.majorHorizontalLineSpacing = spacing;
    this.drawMajorLines();
  }

  /**
   * Set the spacing for major vertical lines. First line is drawn at x=0 (left of GridNode).
   * @public
   *
   * @param {number|null} spacing - setting to null hides major vertical lines
   */
  setMajorVerticalLineSpacing( spacing ) {
    assert && assert( spacing === null || spacing > 0, 'if defined, spacing should be greater than zero' );

    this.majorVerticalLineSpacing = spacing;
    this.drawMajorLines();
  }

  /**
   * Set the width of the grid, relative to the origin (left top).
   * @public
   *
   * @param width
   */
  setGridWidth( width ) {
    this.gridWidth = width;
    this.drawMajorLines();
    this.drawMinorLines();
  }

  /**
   * Set the height of the grid relative to the origin (left top).
   * @public
   *
   * @param height
   */
  setGridHeight( height ) {
    this.gridHeight = height;
    this.drawMajorLines();
    this.drawMinorLines();
  }

  /**
   * Redraw the minor lines.
   * @private
   */
  drawMinorLines() {
    this.drawLines( this.minorHorizontalLineSpacing, this.minorVerticalLineSpacing, this.minorPath );
  }

  /**
   * Redraw the major lines.
   * @private
   */
  drawMajorLines() {
    this.drawLines( this.majorHorizontalLineSpacing, this.majorVerticalLineSpacing, this.majorPath );
  }

  /**
   * Redraw lines and set the resultant shape to the Path.
   * @private
   *
   * @param {number|null} horizontalSpacing - horizontal lines not drawn if null
   * @param {number|null} verticalSpacing - vertical lines not drawn if null
   * @param {Path} path - line shape is drawn with this Path
   */
  drawLines( horizontalSpacing, verticalSpacing, path ) {
    const shape = new Shape();

    if ( verticalSpacing ) {
      for ( let x = 0; x <= this.gridWidth; x += verticalSpacing ) {
        shape.moveTo( x, 0 );
        shape.lineTo( x, this.gridHeight );
      }
    }

    if ( horizontalSpacing ) {
      for ( let y = 0; y <= this.gridHeight; y += horizontalSpacing ) {
        shape.moveTo( 0, y );
        shape.lineTo( this.gridWidth, y );
      }
    }

    path.shape = shape;
  }
}

sceneryPhet.register( 'GridNode', GridNode );

export default GridNode;
