// Copyright 2013-2024, University of Colorado Boulder

/**
 * Node that represents a support column with a flat top. An example use case can be seen in Balancing Act,
 * and the default values represent the design decisions made for that sim.
 *
 * @author John Blanco
 * @author Marla Schulz (PhET Interactive Simulations)
 */

import { LinearGradient, Node, NodeOptions, Path, Rectangle, TPaint } from '../../scenery/js/imports.js';
import sceneryPhet from './sceneryPhet.js';
import ModelViewTransform2 from '../../phetcommon/js/view/ModelViewTransform2.js';
import { Shape } from '../../kite/js/imports.js';
import { combineOptions } from '../../phet-core/js/optionize.js';
import StrictOmit from '../../phet-core/js/types/StrictOmit.js';
import { optionize } from '../../phet-core/js/imports.js';

type SelfOptions = {
  columnFill?: TPaint;
  columnSupportFill?: TPaint;
  stroke?: TPaint;
  supportWidth?: number;
  supportHeight?: number;
};
type LevelSupportColumnNodeOptions = SelfOptions & StrictOmit<NodeOptions, 'children'>;

class LevelSupportColumnNode extends Node {

  public constructor( modelViewTransform: ModelViewTransform2, levelSupportColumn: Shape, providedOptions: LevelSupportColumnNodeOptions ) {

    // Create and add the main body of the column.
    const transformedColumnShape = modelViewTransform.modelToViewShape( levelSupportColumn );

    // Create and add the column support.
    const supportWidth = transformedColumnShape.bounds.width * 1.3; // Empirically determined.
    const supportHeight = transformedColumnShape.bounds.height * 0.15; // Empirically determined.

    const options = optionize<LevelSupportColumnNodeOptions, SelfOptions, NodeOptions>()( {
      columnFill: GET_COLUMN_BODY_GRADIENT( transformedColumnShape ),
      columnSupportFill: GET_COLUMN_SUPPORT_GRADIENT( transformedColumnShape, supportWidth ),
      stroke: 'black',
      supportWidth: supportWidth,
      supportHeight: supportHeight
    }, providedOptions );

    const columnNode = new Path( transformedColumnShape,
      {
        fill: options.columnFill,
        stroke: options.stroke,
        lineWidth: 1
      } );

    const columnSupportNode = new Rectangle(
      transformedColumnShape.bounds.centerX - options.supportWidth / 2,
      transformedColumnShape.bounds.maxY - options.supportHeight,
      options.supportWidth,
      options.supportHeight,
      3,
      3,
      {
        fill: options.columnSupportFill,
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
export const GET_COLUMN_BODY_GRADIENT = ( transformedColumnShape: Shape ): LinearGradient =>
  new LinearGradient(
    transformedColumnShape.bounds.minX, 0,
    transformedColumnShape.bounds.maxX, 0
  )
    .addColorStop( 0, '#BFBEBF' )
    .addColorStop( 0.15, '#BFBEBF' )
    .addColorStop( 0.16, '#CECECE' )
    .addColorStop( 0.3, '#CECECE' )
    .addColorStop( 0.31, '#ADAFAD' )
    .addColorStop( 0.8, '#ADAFAD' )
    .addColorStop( 0.81, '#979696' )
    .addColorStop( 1, '#979696' );

export const GET_COLUMN_SUPPORT_GRADIENT = ( transformedColumnShape: Shape, supportWidth: number ): LinearGradient =>
  new LinearGradient(
    transformedColumnShape.bounds.centerX - supportWidth / 2, 0,
    transformedColumnShape.bounds.centerX + supportWidth / 2, 0
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