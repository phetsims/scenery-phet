// Copyright 2022, University of Colorado Boulder

/**
 * TrashButton is a rectangular push button with PhET's standard 'trash' icon.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize from '../../../phet-core/js/optionize.js';
import StrictOmit from '../../../phet-core/js/types/StrictOmit.js';
import { Path, PathOptions } from '../../../scenery/js/imports.js';
import trashAltRegularShape from '../../../sherpa/js/fontawesome-5/trashAltRegularShape.js';
import RectangularPushButton, { RectangularPushButtonOptions } from '../../../sun/js/buttons/RectangularPushButton.js';
import sceneryPhet from '../sceneryPhet.js';

type SelfOptions = {
  iconOptions?: PathOptions; // nested options for customizing the trash icon
};

export type TrashButtonOptions = SelfOptions & StrictOmit<RectangularPushButtonOptions, 'content'>;

export default class TrashButton extends RectangularPushButton {

  public constructor( providedOptions?: TrashButtonOptions ) {

    const options = optionize<TrashButtonOptions, SelfOptions, RectangularPushButtonOptions>()( {
      iconOptions: {
        scale: 0.05,
        fill: 'black'
      }
    }, providedOptions );

    options.content = new Path( trashAltRegularShape, options.iconOptions );

    super( options );
  }
}

sceneryPhet.register( 'TrashButton', TrashButton );