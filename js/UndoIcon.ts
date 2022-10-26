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
  height?: number; // height of the icon
};

export type UndoIconOptions = SelfOptions & PathOptions;

export default class UndoIcon extends Path {

  public constructor( providedOptions?: UndoIconOptions ) {

    const options = optionize<UndoIconOptions, SelfOptions, PathOptions>()( {

      // SelfOptions
      height: 17,
      
      // PathOptions
      fill: 'black'
    }, providedOptions );

    const height = options.height;
    const shape = new Shape()
      .moveTo( 0, 0 )
      .lineTo( 0, height )
      .lineTo( height, height )
      .lineTo( height * 0.7, height * 0.7 )
      .quadraticCurveTo( height * 1.25, -height * 0.1, height * 2, height * 0.75 )
      .quadraticCurveTo( height * 1.25, -height * 0.5, height * 0.3, height * 0.3 )
      .close();

    super( shape, options );
  }
}

sceneryPhet.register( 'UndoIcon', UndoIcon );