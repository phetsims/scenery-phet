// Copyright 2014-2022, University of Colorado Boulder

/**
 * PaperAirplaneNode draws the paper airplane that is part of the PhET logo.
 *
 * @author John Blanco
 */

import { Shape } from '../../kite/js/imports.js';
import optionize, { EmptySelfOptions } from '../../phet-core/js/optionize.js';
import { Path, PathOptions } from '../../scenery/js/imports.js';
import PhetColorScheme from './PhetColorScheme.js';
import sceneryPhet from './sceneryPhet.js';

type SelfOptions = EmptySelfOptions;

export type PaperAirplaneNodeOptions = SelfOptions & PathOptions;

export default class PaperAirplaneNode extends Path {

  public constructor( providedOptions?: PaperAirplaneNodeOptions ) {

    const options = optionize<PaperAirplaneNodeOptions, SelfOptions, PathOptions>()( {
      fill: PhetColorScheme.PHET_LOGO_YELLOW
    }, providedOptions );

    // Define the shape, from the points in the PhET Logo AI file, see https://github.com/phetsims/scenery-phet/issues/75
    // The bounds offset were determined by getting bodyShape.bounds.minX, bodyShape.bounds.minY, and the shape
    // is adjusted to have top/left at (0,0)
    const dx = 221.92;
    const dy = 114.975;
    const bodyShape = new Shape()
      .moveTo( 221.92 - dx, 131.225 - dy )
      .lineTo( 234.307 - dx, 135.705 - dy )
      .lineTo( 250.253 - dx, 122.428 - dy )
      .lineTo( 237.983 - dx, 136.955 - dy )
      .lineTo( 251.236 - dx, 141.627 - dy )
      .lineTo( 256.021 - dx, 114.975 - dy )
      .close()

      // Lower part
      .moveTo( 238.004 - dx, 139.547 - dy )
      .lineTo( 238.312 - dx, 146.48 - dy )
      .lineTo( 243.254 - dx, 141.54 - dy )
      .close();

    super( bodyShape, options );
  }
}

sceneryPhet.register( 'PaperAirplaneNode', PaperAirplaneNode );