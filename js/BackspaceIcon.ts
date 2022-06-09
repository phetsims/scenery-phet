// Copyright 2014-2022, University of Colorado Boulder

/**
 * BackspaceIcon draws a backspace icon.
 * This was originally created for use on keypads, but may have other applications.
 *
 * @author John Blanco
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Dimension2 from '../../dot/js/Dimension2.js';
import { Shape } from '../../kite/js/imports.js';
import optionize from '../../phet-core/js/optionize.js';
import { Path, PathOptions } from '../../scenery/js/imports.js';
import sceneryPhet from './sceneryPhet.js';

type SelfOptions = {
  size?: Dimension2;
};

export type BackspaceIconOptions = SelfOptions & PathOptions;

export default class BackspaceIcon extends Path {

  public constructor( providedOptions?: BackspaceIconOptions ) {

    const options = optionize<BackspaceIconOptions, SelfOptions, PathOptions>()( {

      // SelfOptions
      size: new Dimension2( 15, 10 ),

      // PathOptions
      stroke: 'black',
      lineWidth: 1,
      lineJoin: 'round',
      lineCap: 'square'
    }, providedOptions );

    const iconShape = new Shape();

    // the outline, tip points left, described clockwise from the tip
    const tipWidth = options.size.width / 3;
    iconShape.moveTo( 0, tipWidth )
      .lineTo( tipWidth, 0 )
      .lineTo( options.size.width, 0 )
      .lineTo( options.size.width, options.size.height )
      .lineTo( tipWidth, options.size.height )
      .close();

    // the x in the middle, multipliers determined empirically
    const left = 0.47 * options.size.width;
    const right = 0.73 * options.size.width;
    const top = 0.3 * options.size.height;
    const bottom = 0.7 * options.size.height;
    iconShape.moveTo( left, top )
      .lineTo( right, bottom )
      .moveTo( right, top )
      .lineTo( left, bottom );

    super( iconShape, options );
  }
}

sceneryPhet.register( 'BackspaceIcon', BackspaceIcon );