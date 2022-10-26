// Copyright 2022, University of Colorado Boulder

/**
 * UndoIcon is the icon used to signify 'undo'.
 *
 * @author John Blanco
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { Shape } from '../../kite/js/imports.js';
import optionize from '../../phet-core/js/optionize.js';
import { Path, PathOptions } from '../../scenery/js/imports.js';
import sceneryPhet from './sceneryPhet.js';

type SelfOptions = {
  size?: number; // width and height, because the icon is square
};

export type UndoIconOptions = SelfOptions & PathOptions;

export default class UndoIcon extends Path {

  public constructor( providedOptions?: UndoIconOptions ) {

    const options = optionize<UndoIconOptions, SelfOptions, PathOptions>()( {

      // SelfOptions
      size: 17,
      
      // PathOptions
      fill: 'black'
    }, providedOptions );

    const size = options.size;
    const shape = new Shape()
      .moveTo( 0, 0 )
      .lineTo( 0, size )
      .lineTo( size, size )
      .lineTo( size * 0.7, size * 0.7 )
      .quadraticCurveTo( size * 1.25, -size * 0.1, size * 2, size * 0.75 )
      .quadraticCurveTo( size * 1.25, -size * 0.5, size * 0.3, size * 0.3 )
      .close();

    super( shape, options );
  }
}

sceneryPhet.register( 'UndoIcon', UndoIcon );