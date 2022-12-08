// Copyright 2022, University of Colorado Boulder

/**
 * GridIcon is the icon for an NxN grid of square cells.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize from '../../phet-core/js/optionize.js';
import { Path, PathOptions } from '../../scenery/js/imports.js';
import { Shape } from '../../kite/js/imports.js';
import sceneryPhet from './sceneryPhet.js';

type SelfOptions = {
  size?: number; // dimensions of the icon, same for width and height
  numberOfRows?: number; // number of rows in the grid, number of columns will be the same
};

export type GridIconOptions = SelfOptions & PathOptions;

export default class GridIcon extends Path {

  public constructor( providedOptions?: GridIconOptions ) {

    const options = optionize<GridIconOptions, SelfOptions, PathOptions>()( {

      // SelfOptions
      size: 30,
      numberOfRows: 4,

      // PathOptions
      stroke: 'rgb( 100, 100, 100 )',
      lineWidth: 1
    }, providedOptions );

    assert && assert( options.size > 0, `invalid size: ${options.size}` );
    assert && assert( Number.isInteger( options.numberOfRows ) && options.numberOfRows > 2,
      `invalid numberOfRows: ${options.numberOfRows}` );

    const shape = new Shape();

    // horizontal lines
    for ( let row = 1; row < options.numberOfRows; row++ ) {
      const y = ( row / options.numberOfRows ) * options.size;
      shape.moveTo( 0, y );
      shape.lineTo( options.size, y );
    }

    // vertical lines
    const numberOfColumns = options.numberOfRows; // because the grid is NxN
    for ( let column = 1; column < numberOfColumns; column++ ) {
      const x = ( column / numberOfColumns ) * options.size;
      shape.moveTo( x, 0 );
      shape.lineTo( x, options.size );
    }

    super( shape, options );
  }
}

sceneryPhet.register( 'GridIcon', GridIcon );