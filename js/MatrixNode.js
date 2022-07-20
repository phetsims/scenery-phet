// Copyright 2021-2022, University of Colorado Boulder

/**
 * MatrixNode displays an MxN matrix.
 *
 * Example usage:
 * const matrixNode = new MatrixNode( [ [ 2, 3, -2 ], [ 1, 0, -4 ], [ 2, -1, -6 ] ], { ... } );
 *
 * NOTE: This was implemented for demonstration purposes, in response to this question in the Google Group
 * 'Developing Interactive Simulations in HTML5':
 * https://groups.google.com/g/developing-interactive-simulations-in-html5/c/kZPE82qE2qg?pli=1
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Matrix3 from '../../dot/js/Matrix3.js';
import Utils from '../../dot/js/Utils.js';
import { Shape } from '../../kite/js/imports.js';
import merge from '../../phet-core/js/merge.js';
import PhetFont from '../../scenery-phet/js/PhetFont.js';
import { AlignBox, AlignGroup, HBox, Node, Path, Text, VBox } from '../../scenery/js/imports.js';
import sceneryPhet from './sceneryPhet.js';

class MatrixNode extends Node {

  /**
   * @param {Array.<Array[number|string]>} matrix - an MxN matrix, in row-major order
   * @param {Object} [options]
   */
  constructor( matrix, options ) {

    assert && assert( Array.isArray( matrix ) && matrix.length > 0, 'matrix must be an array with length > 0' );
    assert && assert( _.every( matrix, row => Array.isArray( row ) && row.length > 0 ), 'each element of matrix must be an array with length > 0' );
    assert && assert( _.every( matrix, row => row.length === matrix[ 0 ].length ), 'each row of the matrix must have the same number of values' );
    assert && assert( _.every( matrix, row => _.every( row, value => ( typeof value === 'number' || typeof value === 'string' ) ) ), 'all values must be numbers or strings' );

    options = merge( {
      font: new PhetFont( 20 ), // font for the values
      decimalPlaces: 0, // number of decimal places displayed for each value
      stripTrailingZeros: true, // whether to strip trailing zeros, e.g. 1.20 -> 1.2
      cellXSpacing: 25, // horizontal spacing between cells in the matrix
      cellYSpacing: 5, // vertical spacing between cells in the matrix
      leftBracketXSpacing: 10, // horizontal spacing between left bracket and the values
      rightBracketXSpacing: 10, // horizontal spacing between right bracket and the values
      bracketWidth: 8, // width of the brackets
      bracketHeightPadding: 5, // extra height added to the brackets, 0 is the same height as the grid of values

      // Path options for the brackets
      bracketNodeOptions: {
        stroke: 'black',
        lineWidth: 2
      }
    }, options );

    const alignBoxOptions = {
      group: new AlignGroup(), // use the same AlignGroup instance for all cells, so that they are all the same size
      xAlign: 'right'
    };

    // Create an HBox for each row.
    const rowNodes = [];
    matrix.forEach( row => {
      const cellNodes = [];

      row.forEach( value => {

        let valueString;
        if ( typeof value === 'string' ) {

          // value is a string, use it as is.
          valueString = value;
        }
        else {
          // value is a number, round it to the desired number of decimal places.
          valueString = options.stripTrailingZeros ?
                        '' + Utils.toFixedNumber( value, options.decimalPlaces ) :
                        Utils.toFixed( value, options.decimalPlaces );
        }

        // Cell value
        const cellNode = new Text( valueString, {
          font: options.font
        } );

        // Wrap in an AlignBox, so that all cells have the same effective dimensions.
        cellNodes.push( new AlignBox( cellNode, alignBoxOptions ) );
      } );

      rowNodes.push( new HBox( {
        children: cellNodes,
        spacing: options.cellXSpacing
      } ) );
    } );

    // Arrange the rows in a VBox to create a grid.
    const gridNode = new VBox( {
      children: rowNodes,
      spacing: options.cellYSpacing,
      align: 'right'
    } );

    // Left bracket
    const bracketHeight = gridNode.height + ( 2 * options.bracketHeightPadding );
    const leftBracketShape = new Shape()
      .moveTo( 0, 0 )
      .lineTo( -options.bracketWidth, 0 )
      .lineTo( -options.bracketWidth, bracketHeight )
      .lineTo( 0, bracketHeight );
    const leftBracketNode = new Path( leftBracketShape, merge( {
      right: gridNode.left - options.leftBracketXSpacing,
      centerY: gridNode.centerY
    }, options.bracketNodeOptions ) );

    // Right bracket, which reuses leftBracketShape.
    const rightBracketShape = leftBracketShape.transformed( new Matrix3().setToScale( -1, 1 ) );
    const rightBracketNode = new Path( rightBracketShape, merge( {
      left: gridNode.right + options.rightBracketXSpacing,
      centerY: gridNode.centerY
    }, options.bracketNodeOptions ) );

    // Wrap in a Node so we don't expose the HBox API.
    assert && assert( !options.children );
    options.children = [ leftBracketNode, gridNode, rightBracketNode ];

    super( options );
  }
}

sceneryPhet.register( 'MatrixNode', MatrixNode );
export default MatrixNode;