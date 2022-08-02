// Copyright 2018-2022, University of Colorado Boulder

/**
 * Standard PhET button for 'info', uses the international symbol for 'information'.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import InstanceRegistry from '../../../phet-core/js/documentation/InstanceRegistry.js';
import StrictOmit from '../../../phet-core/js/types/StrictOmit.js';
import optionize from '../../../phet-core/js/optionize.js';
import { TColor, Path } from '../../../scenery/js/imports.js';
import infoCircleSolidShape from '../../../sherpa/js/fontawesome-5/infoCircleSolidShape.js';
import RoundPushButton, { RoundPushButtonOptions } from '../../../sun/js/buttons/RoundPushButton.js';
import sceneryPhet from '../sceneryPhet.js';

type SelfOptions = {
  iconFill?: TColor;
};

export type InfoButtonOptions = SelfOptions & StrictOmit<RoundPushButtonOptions, 'content'>;

export default class InfoButton extends RoundPushButton {

  public constructor( providedOptions?: InfoButtonOptions ) {

    const options = optionize<InfoButtonOptions, SelfOptions, RoundPushButtonOptions>()( {

      // SelfOptions
      iconFill: 'black',

      // RoundPushButtonOptions
      baseColor: 'rgb( 238, 238, 238 )',
      xMargin: 10,
      yMargin: 10,
      touchAreaDilation: 10
    }, providedOptions );

    options.content = new Path( infoCircleSolidShape, {
      scale: 0.08,
      fill: options.iconFill
    } );

    super( options );

    // support for binder documentation, stripped out in builds and only runs when ?binder is specified
    assert && phet.chipper.queryParameters.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'InfoButton', this );
  }
}

sceneryPhet.register( 'InfoButton', InfoButton );