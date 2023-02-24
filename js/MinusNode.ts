// Copyright 2014-2023, University of Colorado Boulder

/**
 * Minus sign, created using phet.scenery.Rectangle because scenery.Text("-") looks awful on Windows and cannot be accurately
 * centered. The origin is at the upper left.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Dimension2 from '../../dot/js/Dimension2.js';
import optionize from '../../phet-core/js/optionize.js';
import { Rectangle, RectangleOptions } from '../../scenery/js/imports.js';
import sceneryPhet from './sceneryPhet.js';

// constants
const DEFAULT_SIZE = new Dimension2( 20, 5 );

type SelfOptions = {
  size?: Dimension2;
};

export type MinusNodeOptions = SelfOptions & RectangleOptions;

class MinusNode extends Rectangle {

  public constructor( providedOptions: MinusNodeOptions ) {

    const options = optionize<MinusNodeOptions, SelfOptions, RectangleOptions>()( {

      // SelfOptions
      size: DEFAULT_SIZE,

      // RectangleOptions
      fill: 'black'
    }, providedOptions );

    assert && assert( options.size.width >= options.size.height );

    super( 0, 0, options.size.width, options.size.height, options );
  }
}

sceneryPhet.register( 'MinusNode', MinusNode );
export default MinusNode;