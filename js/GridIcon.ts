// Copyright 2022, University of Colorado Boulder

/**
 * GridIcon is the icon for a 4x4 grid.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize from '../../phet-core/js/optionize.js';
import { Path, PathOptions } from '../../scenery/js/imports.js';
import { Shape } from '../../kite/js/imports.js';

type SelfOptions = {
  iconSize?: number;
};

export type GridIconOptions = SelfOptions & PathOptions;

export default class GridIcon extends Path {

  public constructor( providedOptions?: GridIconOptions ) {

    const options = optionize<GridIconOptions, SelfOptions, PathOptions>()( {

      // SelfOptions
      iconSize: 30,

      // PathOptions
      stroke: 'rgb( 100, 100, 100 )',
      lineWidth: 1
    }, providedOptions );

    const iconSize = options.iconSize;

    // The grid shape looks approximately like this:
    //
    //      |   |   |
    //   ---|---|---|---
    //      |   |   |
    //   ---|---|---|---
    //      |   |   |
    //   ---|---|---|---
    //      |   |   |
    //
    const shape = new Shape()
      .moveTo( iconSize / 4, 0 )
      .lineTo( iconSize / 4, iconSize )
      .moveTo( iconSize / 2, 0 )
      .lineTo( iconSize / 2, iconSize )
      .moveTo( iconSize * 3 / 4, 0 )
      .lineTo( iconSize * 3 / 4, iconSize )
      .moveTo( 0, iconSize / 4 )
      .lineTo( iconSize, iconSize / 4 )
      .moveTo( 0, iconSize / 2 )
      .lineTo( iconSize, iconSize / 2 )
      .moveTo( 0, iconSize * 3 / 4 )
      .lineTo( iconSize, iconSize * 3 / 4 );

    super( shape, options );
  }
}