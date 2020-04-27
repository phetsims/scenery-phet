// Copyright 2020, University of Colorado Boulder

/**
 * A reusable Node that draws a 2D grid. The grid can have "major" lines which are generally more visually prominent,
 * and "minor" lines which break the major lines into further subdivisions. Origin is at the top left of the grid,
 * and lines are drawn with desired spacing between the origin and grid width/height.
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
   * @param {Object} [options]
   */
  constructor( gridWidth, gridHeight, options ) {
    options = merge( {

      // {number|null} spacing between major horizontal lines - no major horizontal lines added if null
      majorHorizontalLineSpacing: null,

      // {number|null} spacing between major vertical lines - no major vertical lines if null
      majorVerticalLineSpacing: null,

      // {number|null} spacing between minor horizontal lines - no minor horizontal lines added if null
      minorHorizontalLineSpacing: null,

      // {number|null} spacing between minor vertical lines - no minor vertical lines if null
      minorVerticalLineSpacing: null,

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

    // @private {number}
    this.gridWidth = gridWidth;
    this.gridHeight = gridHeight;

    // @private {null|number}
    this.minorHorizontalLineSpacing = null;
    this.minorVerticalLineSpacing = null;
    this.majorVerticalLineSpacing = null;
    this.majorHorizontalLineSpacing = null;

    // @private {Path} - Path for minor lines
    this.minorLines = new Path( null, options.minorLineOptions );

    // @private {Path} - path for major lines
    this.majorLines = new Path( null, options.majorLineOptions );

    assert && assert( !options.children, 'GridNode sets children' );
    this.children = [ this.minorLines, this.majorLines ];

    // set spacings and draw the grid
    this.setLineSpacings( options.majorVerticalLineSpacing, options.majorHorizontalLineSpacing, options.minorVerticalLineSpacing, options.minorHorizontalLineSpacing );

    // mutate with Node options after grid is drawn so that bounds are defined
    this.mutate( options );
  }

  /**
   * Set the spacing for all major and minor lines.
   * @public
   *
   * @param {number|null} majorVerticalLineSpacing
   * @param {number|null} majorHorizontalLineSpacing
   * @param {number|null} minorVerticalLineSpacing
   * @param {number|null} minorHorizontalLineSpacing
   */
  setLineSpacings( majorVerticalLineSpacing, majorHorizontalLineSpacing, minorVerticalLineSpacing, minorHorizontalLineSpacing ) {
    this.validateMajorMinorPair( majorVerticalLineSpacing, minorVerticalLineSpacing );
    this.validateMajorMinorPair( majorHorizontalLineSpacing, minorHorizontalLineSpacing );

    if ( this.majorVerticalLineSpacing !== majorVerticalLineSpacing || this.majorHorizontalLineSpacing !== majorHorizontalLineSpacing ) {
      this.majorVerticalLineSpacing = majorVerticalLineSpacing;
      this.majorHorizontalLineSpacing = majorHorizontalLineSpacing;

      this.drawMajorLines();
    }

    if ( this.minorVerticalLineSpacing !== minorVerticalLineSpacing || this.minorHorizontalLineSpacing !== minorHorizontalLineSpacing ) {
      this.minorVerticalLineSpacing = minorVerticalLineSpacing;
      this.minorHorizontalLineSpacing = minorHorizontalLineSpacing;

      this.drawMinorLines();
    }
  }

  /**
   * Validate each parameter, and make sure that as a pair they are as expected.
   * @private
   * @param {number|null} majorSpacing
   * @param {number|null} minorSpacing
   */
  validateMajorMinorPair( majorSpacing, minorSpacing ) {
    assert && assert( ( typeof majorSpacing === 'number' && majorSpacing > 0 ) ||
                      majorSpacing === null, 'majorSpacing should be positive number or null' );
    assert && assert( ( typeof minorSpacing === 'number' && minorSpacing > 0 ) ||
                      minorSpacing === null, 'minorSpacing should be positive number or null' );

    if ( majorSpacing !== null && minorSpacing !== null ) {
      assert && assert( majorSpacing > minorSpacing, 'major spacing must be greater than minor spacing' );
      assert && assert( majorSpacing % minorSpacing === 0, 'minor spacing should be a multiple of major spacing' );
    }
  }

  /**
   * Set the width of the grid, relative to the origin (left top).
   * @public
   *
   * @param width
   */
  setGridWidth( width ) {
    this.gridWidth = width;
    this.drawAllLines();
  }

  /**
   * Set the height of the grid relative to the origin (left top).
   * @public
   *
   * @param height
   */
  setGridHeight( height ) {
    this.gridHeight = height;
    this.drawAllLines();
  }

  /**
   * Redraw the minor lines.
   * @private
   */
  drawMinorLines() {
    this.drawLines( this.minorHorizontalLineSpacing, this.minorVerticalLineSpacing, this.minorLines );
  }

  /**
   * Redraw the major lines.
   * @private
   */
  drawMajorLines() {
    this.drawLines( this.majorHorizontalLineSpacing, this.majorVerticalLineSpacing, this.majorLines );
  }

  /**
   * Redraw all grid lines.
   * @private
   */
  drawAllLines() {
    this.drawMajorLines();
    this.drawMinorLines();
  }

  /**
   * Redraw lines and set the resultant shape to the Path.
   * @private
   *
   * @param {number|null} horizontalSpacing - horizontal lines not drawn if null
   * @param {number|null} verticalSpacing - vertical lines not drawn if null
   * @param {Path} linesPath - line shape is drawn with this Path
   */
  drawLines( horizontalSpacing, verticalSpacing, linesPath ) {
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

    linesPath.shape = shape;
  }
}

sceneryPhet.register( 'GridNode', GridNode );

export default GridNode;
