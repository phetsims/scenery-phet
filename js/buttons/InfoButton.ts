// Copyright 2018-2025, University of Colorado Boulder

/**
 * Standard PhET button for 'info', uses the international symbol for 'information'.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import InstanceRegistry from '../../../phet-core/js/documentation/InstanceRegistry.js';
import optionize from '../../../phet-core/js/optionize.js';
import StrictOmit from '../../../phet-core/js/types/StrictOmit.js';
import Path from '../../../scenery/js/nodes/Path.js';
import TColor from '../../../scenery/js/util/TColor.js';
import RoundPushButton, { RoundPushButtonOptions } from '../../../sun/js/buttons/RoundPushButton.js';
import infoCircleSolidShape from '../../../sun/js/shapes/infoCircleSolidShape.js';
import sceneryPhet from '../sceneryPhet.js';
import SceneryPhetStrings from '../SceneryPhetStrings.js';

type SelfOptions = {
  iconFill?: TColor;
};

export type InfoButtonOptions = SelfOptions & StrictOmit<RoundPushButtonOptions, 'content'>;

export default class InfoButton extends RoundPushButton {

  public constructor( providedOptions?: InfoButtonOptions ) {

    const options = optionize<InfoButtonOptions, SelfOptions, RoundPushButtonOptions>()( {

      // SelfOptions
      iconFill: 'rgb( 41, 106, 163 )',

      // RoundPushButtonOptions
      baseColor: 'rgb( 238, 238, 238 )',
      xMargin: 10,
      yMargin: 10,
      touchAreaDilation: 10,
      accessibleName: SceneryPhetStrings.a11y.infoStringProperty
    }, providedOptions );

    options.content = new Path( infoCircleSolidShape, {
      scale: 1.45,
      fill: options.iconFill
    } );

    super( options );

    // support for binder documentation, stripped out in builds and only runs when ?binder is specified
    assert && window.phet?.chipper?.queryParameters?.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'InfoButton', this );
  }
}

sceneryPhet.register( 'InfoButton', InfoButton );