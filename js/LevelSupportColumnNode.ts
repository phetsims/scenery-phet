// Copyright 2024-2025, University of Colorado Boulder

/**
 * Node that represents a support column with a flat top. An example use case can be seen in Balancing Act,
 * and the default values represent the design decisions made for that sim.
 *
 * @author John Blanco (PhET Interactive Simulations)
 * @author Marla Schulz (PhET Interactive Simulations)
 */

import Shape from '../../kite/js/Shape.js';
import optionize, { combineOptions } from '../../phet-core/js/optionize.js';
import StrictOmit from '../../phet-core/js/types/StrictOmit.js';
import Node, { NodeOptions } from '../../scenery/js/nodes/Node.js';
import Path from '../../scenery/js/nodes/Path.js';
import Rectangle from '../../scenery/js/nodes/Rectangle.js';
import LinearGradient from '../../scenery/js/util/LinearGradient.js';
import TPaint from '../../scenery/js/util/TPaint.js';
import sceneryPhet from './sceneryPhet.js';

type SelfOptions = {
  columnFill?: TPaint | null;
  columnSupportFill?: TPaint | null;
  stroke?: TPaint;
  columnWidth: number;
  columnHeight: number;
  supportWidth?: number;
  supportHeight?: number;
};
type LevelSupportColumnNodeOptions = SelfOptions & StrictOmit<NodeOptions, 'children'>;

const COLUMN_SUPPORT_CORNER_RADIUS = 3;

class LevelSupportColumnNode extends Node {

  public constructor( providedOptions: LevelSupportColumnNodeOptions ) {

    const defaultSupportWidth = providedOptions.columnWidth * 1.3; // Empirically determined.
    const defaultSupportHeight = providedOptions.columnHeight * 0.15; // Empirically determined.

    const options = optionize<LevelSupportColumnNodeOptions, SelfOptions, NodeOptions>()( {
      columnFill: null,
      columnSupportFill: null,
      stroke: 'black',
      supportWidth: defaultSupportWidth,
      supportHeight: defaultSupportHeight
    }, providedOptions );

    const columnShape = Shape.rect( 0, 0, options.columnWidth, options.columnHeight );

    const columnFill = options.columnFill || GET_COLUMN_BODY_GRADIENT( columnShape );
    const columnSupportFill = options.columnFill || GET_COLUMN_SUPPORT_GRADIENT( columnShape, options.supportWidth );

    const columnNode = new Path( columnShape,
      {
        fill: columnFill,
        stroke: options.stroke,
        lineWidth: 1
      } );

    // Create and add the column support.
    const columnSupportNode = new Rectangle(
      columnShape.bounds.centerX - options.supportWidth / 2,
      columnShape.bounds.maxY - options.supportHeight,
      options.supportWidth,
      options.supportHeight,
      COLUMN_SUPPORT_CORNER_RADIUS,
      COLUMN_SUPPORT_CORNER_RADIUS,
      {
        fill: columnSupportFill,
        stroke: options.stroke,
        lineWidth: 1
      } );

    const superOptions = combineOptions<NodeOptions>( {
      children: [ columnNode, columnSupportNode ]
    }, options );

    super( superOptions );
  }
}

// Helper functions to create the Linear Gradient for the support columns.
export const GET_COLUMN_BODY_GRADIENT = ( columnNode: Shape ): LinearGradient =>
  new LinearGradient(
    columnNode.bounds.minX, 0,
    columnNode.bounds.maxX, 0
  )
    .addColorStop( 0, '#BFBEBF' )
    .addColorStop( 0.15, '#BFBEBF' )
    .addColorStop( 0.16, '#CECECE' )
    .addColorStop( 0.3, '#CECECE' )
    .addColorStop( 0.31, '#ADAFAD' )
    .addColorStop( 0.8, '#ADAFAD' )
    .addColorStop( 0.81, '#979696' )
    .addColorStop( 1, '#979696' );

export const GET_COLUMN_SUPPORT_GRADIENT = ( columnNode: Shape, supportWidth: number ): LinearGradient =>
  new LinearGradient(
    columnNode.bounds.centerX - supportWidth / 2, 0,
    columnNode.bounds.centerX + supportWidth / 2, 0
  )
    .addColorStop( 0, '#BFBEBF' )
    .addColorStop( 0.15, '#BFBEBF' )
    .addColorStop( 0.16, '#CECECE' )
    .addColorStop( 0.22, '#CECECE' )
    .addColorStop( 0.23, '#ADAFAD' )
    .addColorStop( 0.84, '#ADAFAD' )
    .addColorStop( 0.85, '#979696' )
    .addColorStop( 1, '#979696' );


sceneryPhet.register( 'LevelSupportColumnNode', LevelSupportColumnNode );

export default LevelSupportColumnNode;