// Copyright 2015-2022, University of Colorado Boulder

/**
 * Close button, red with a white 'X'.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author John Blanco (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import { Shape } from '../../../kite/js/imports.js';
import StrictOmit from '../../../phet-core/js/types/StrictOmit.js';
import optionize from '../../../phet-core/js/optionize.js';
import { Path, PathOptions } from '../../../scenery/js/imports.js';
import RectangularPushButton, { RectangularPushButtonOptions } from '../../../sun/js/buttons/RectangularPushButton.js';
import PhetColorScheme from '../PhetColorScheme.js';
import sceneryPhet from '../sceneryPhet.js';
import SceneryPhetStrings from '../SceneryPhetStrings.js';

type SelfOptions = {
  iconLength?: number; // length of the 'X' icon, whose bounds are square
  pathOptions?: PathOptions; // options passed along to the Path for the 'X'
};

export type CloseButtonOptions = SelfOptions & StrictOmit<RectangularPushButtonOptions, 'content'>;

export default class CloseButton extends RectangularPushButton {

  public constructor( providedOptions?: CloseButtonOptions ) {

    const options = optionize<CloseButtonOptions, SelfOptions, RectangularPushButtonOptions>()( {

      // SelfOptions
      iconLength: 16,
      pathOptions: {
        stroke: 'white',
        lineWidth: 2.5,
        lineCap: 'round'
      },

      // RectangularPushButton options
      baseColor: PhetColorScheme.RED_COLORBLIND,
      xMargin: 4, // {number} x margin around the icon
      yMargin: 4, // {number} y margin around the icon

      // pdom
      innerContent: SceneryPhetStrings.a11y.closeStringProperty,

      //voicing
      voicingNameResponse: SceneryPhetStrings.a11y.closeStringProperty
    }, providedOptions );

    // 'X' icon
    const xShape = new Shape()
      .moveTo( -options.iconLength / 2, -options.iconLength / 2 )
      .lineTo( options.iconLength / 2, options.iconLength / 2 )
      .moveTo( options.iconLength / 2, -options.iconLength / 2 )
      .lineTo( -options.iconLength / 2, options.iconLength / 2 );
    options.content = new Path( xShape, options.pathOptions );

    super( options );
  }
}

sceneryPhet.register( 'CloseButton', CloseButton );