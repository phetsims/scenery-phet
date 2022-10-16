// Copyright 2022, University of Colorado Boulder

/**
 * GridIcon is the icon for an NxN grid of square cells.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize from '../../phet-core/js/optionize.js';
import { Path, PathOptions } from '../../scenery/js/imports.js';
import { Shape } from '../../kite/js/imports.js';

type SelfOptions = {
  size?: number; // dimensions of the icon, same for width and height
  numberOfCells?: number; // number of cells in the grid, same for rows and columns
};

export type GridIconOptions = SelfOptions & PathOptions;

export default class GridIcon extends Path {

  public constructor( providedOptions?: GridIconOptions ) {

    const options = optionize<GridIconOptions, SelfOptions, PathOptions>()( {

      // SelfOptions
      size: 30,
      numberOfCells: 4,

      // PathOptions
      stroke: 'rgb( 100, 100, 100 )',
      lineWidth: 1
    }, providedOptions );

    assert && assert( options.size > 0, `invalid size: ${options.size}` );
    assert && assert( Number.isInteger( options.numberOfCells ) && options.numberOfCells > 2,
      `invalid numberOfCells: ${options.numberOfCells}` );

    const shape = new Shape();

    // vertical lines
    for ( let column = 1; column < options.numberOfCells; column++ ) {
      const x = ( column / options.numberOfCells ) * options.size;
      shape.moveTo( x, 0 );
      shape.lineTo( x, options.size );
    }

    // horizontal lines
    for ( let row = 1; row < options.numberOfCells; row++ ) {
      const y = ( row / options.numberOfCells ) * options.size;
      shape.moveTo( 0, y );
      shape.lineTo( options.size, y );
    }

    super( shape, options );
  }
}