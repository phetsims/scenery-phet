// Copyright 2018-2022, University of Colorado Boulder

/**
 * Standard PhET button for 'refresh'.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import InstanceRegistry from '../../../phet-core/js/documentation/InstanceRegistry.js';
import StrictOmit from '../../../phet-core/js/types/StrictOmit.js';
import optionize from '../../../phet-core/js/optionize.js';
import { Path } from '../../../scenery/js/imports.js';
import syncAltSolidShape from '../../../sherpa/js/fontawesome-5/syncAltSolidShape.js';
import RectangularPushButton, { RectangularPushButtonOptions } from '../../../sun/js/buttons/RectangularPushButton.js';
import PhetColorScheme from '../PhetColorScheme.js';
import sceneryPhet from '../sceneryPhet.js';

type SelfOptions = {
  iconHeight?: number;
};

export type RefreshButtonOptions = SelfOptions & StrictOmit<RectangularPushButtonOptions, 'content'>;

export default class RefreshButton extends RectangularPushButton {

  public constructor( providedOptions?: RefreshButtonOptions ) {

    const options = optionize<RefreshButtonOptions, SelfOptions, RectangularPushButtonOptions>()( {

      // RefreshButtonOptions
      iconHeight: 35,

      // RectangularPushButtonOptions
      baseColor: PhetColorScheme.BUTTON_YELLOW,

      tandemNameSuffix: 'RefreshButton'
    }, providedOptions );

    options.content = new Path( syncAltSolidShape, {
      fill: 'black'
    } );
    options.content.setScaleMagnitude( options.iconHeight / options.content.height );

    super( options );

    // support for binder documentation, stripped out in builds and only runs when ?binder is specified
    assert && phet.chipper.queryParameters.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'RefreshButton', this );
  }
}

sceneryPhet.register( 'RefreshButton', RefreshButton );