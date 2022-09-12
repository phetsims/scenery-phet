// Copyright 2014-2022, University of Colorado Boulder

/**
 * Zoom button, has an icon with a magnifying glass, with either a plus or minus sign in the center of the glass.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Dimension2 from '../../../dot/js/Dimension2.js';
import StrictOmit from '../../../phet-core/js/types/StrictOmit.js';
import InstanceRegistry from '../../../phet-core/js/documentation/InstanceRegistry.js';
import optionize, { combineOptions } from '../../../phet-core/js/optionize.js';
import RectangularPushButton, { RectangularPushButtonOptions } from '../../../sun/js/buttons/RectangularPushButton.js';
import Tandem from '../../../tandem/js/Tandem.js';
import MagnifyingGlassNode, { MagnifyingGlassNodeOptions } from '../MagnifyingGlassNode.js';
import MinusNode from '../MinusNode.js';
import PhetColorScheme from '../PhetColorScheme.js';
import PlusNode from '../PlusNode.js';
import sceneryPhet from '../sceneryPhet.js';

type SelfOptions = {
  in?: boolean; // true: zoom-in button, false: zoom-out button
  magnifyingGlassOptions?: StrictOmit<MagnifyingGlassNodeOptions, 'icon'>;
};

export type ZoomButtonOptions = SelfOptions & StrictOmit<RectangularPushButtonOptions, 'content'>;

export default class ZoomButton extends RectangularPushButton {

  public constructor( providedOptions?: ZoomButtonOptions ) {

    const options = optionize<ZoomButtonOptions, SelfOptions, RectangularPushButtonOptions>()( {

      // SelfOptions
      in: true,
      magnifyingGlassOptions: { glassRadius: 15 },

      // RectangularPushButtonOptions
      baseColor: PhetColorScheme.BUTTON_YELLOW,
      tandem: Tandem.REQUIRED,
      tandemNameSuffix: 'Button'
    }, providedOptions );

    // Plus or minus sign in middle of magnifying glass
    const glassRadius = options.magnifyingGlassOptions.glassRadius!;
    const signOptions = {
      size: new Dimension2( 1.3 * glassRadius, glassRadius / 3 )
    };
    const icon = options.in ? new PlusNode( signOptions ) : new MinusNode( signOptions );

    options.content = new MagnifyingGlassNode( combineOptions<MagnifyingGlassNodeOptions>( {
      icon: icon
    }, options.magnifyingGlassOptions ) );

    super( options );

    // support for binder documentation, stripped out in builds and only runs when ?binder is specified
    assert && phet.chipper.queryParameters.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'ZoomButton', this );
  }
}

sceneryPhet.register( 'ZoomButton', ZoomButton );