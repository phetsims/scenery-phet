// Copyright 2013-2024, University of Colorado Boulder

/**
 * Node that represents a support column with a flat top in the view.
 *
 * @author John Blanco
 */

import { Node, Path, Rectangle } from '../../../../scenery/js/imports.js';
import balancingAct from '../../balancingAct.js';
import BASharedConstants from '../BASharedConstants.js';
import ColumnState from '../model/ColumnState.js';

class LevelSupportColumnNode extends Node {

  /**
   * @param modelViewTransform
   * @param levelSupportColumn
   * @param columnState
   */
  constructor( modelViewTransform, levelSupportColumn, columnState ) {
    super();

    // Create and add the main body of the column.
    const transformedColumnShape = modelViewTransform.modelToViewShape( levelSupportColumn.shape );
    const mainBodyGradient = BASharedConstants.GET_COLUMN_BODY_GRADIENT( transformedColumnShape );

    const columnNode = new Path( transformedColumnShape,
      {
        fill: mainBodyGradient,
        stroke: 'black',
        lineWidth: 1
      } );
    this.addChild( columnNode );

    // Create and add the column support.
    const supportWidth = transformedColumnShape.bounds.width * 1.3; // Empirically determined.
    const supportHeight = transformedColumnShape.bounds.height * 0.15; // Empirically determined.
    const supportGradient = BASharedConstants.GET_COLUMN_SUPPORT_GRADIENT( transformedColumnShape, supportWidth );

    const columnSupportNode = new Rectangle(
      transformedColumnShape.bounds.centerX - supportWidth / 2,
      transformedColumnShape.bounds.maxY - supportHeight,
      supportWidth,
      supportHeight,
      3,
      3,
      {
        fill: supportGradient,
        stroke: 'black',
        lineWidth: 1
      } );
    this.addChild( columnSupportNode );

    columnState.link( state => {
      this.visible = state === ColumnState.DOUBLE_COLUMNS;
    } );
  }
}

balancingAct.register( 'LevelSupportColumnNode', LevelSupportColumnNode );

export default LevelSupportColumnNode;