// Copyright 2014-2025, University of Colorado Boulder

/**
 * Restart button.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Shape from '../../../kite/js/Shape.js';
import InstanceRegistry from '../../../phet-core/js/documentation/InstanceRegistry.js';
import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import StrictOmit from '../../../phet-core/js/types/StrictOmit.js';
import HBox from '../../../scenery/js/layout/nodes/HBox.js';
import Path from '../../../scenery/js/nodes/Path.js';
import Rectangle from '../../../scenery/js/nodes/Rectangle.js';
import RoundPushButton, { RoundPushButtonOptions } from '../../../sun/js/buttons/RoundPushButton.js';
import sceneryPhet from '../sceneryPhet.js';

// constants
const scale = 0.75;
const vscale = 1.15;
const barWidth = 4 * scale;
const barHeight = 19 * scale * vscale;
const triangleWidth = 15 * scale;
const triangleHeight = 19 * scale * vscale;

type SelfOptions = EmptySelfOptions;

export type RestartButtonOptions = SelfOptions & StrictOmit<RoundPushButtonOptions, 'content'>;

export default class RestartButton extends RoundPushButton {

  public constructor( providedOptions?: RestartButtonOptions ) {

    const options = optionize<RestartButtonOptions, SelfOptions, RoundPushButtonOptions>()( {}, providedOptions );

    const barPath = new Rectangle( 0, 0, barWidth, barHeight, { fill: 'black' } );
    const trianglePath = new Path( new Shape().moveTo( 0, triangleHeight / 2 ).lineTo( -triangleWidth, 0 ).lineTo( 0, -triangleHeight / 2 ).close(), {
      fill: 'black'
    } );
    const trianglePath2 = new Path( new Shape().moveTo( 0, triangleHeight / 2 ).lineTo( -triangleWidth, 0 ).lineTo( 0, -triangleHeight / 2 ).close(), {
      fill: 'black'
    } );

    options.content = new HBox( { children: [ barPath, trianglePath, trianglePath2 ], spacing: -1 } );

    super( options );

    // support for binder documentation, stripped out in builds and only runs when ?binder is specified
    assert && window.phet?.chipper?.queryParameters?.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'RestartButton', this );
  }
}

sceneryPhet.register( 'RestartButton', RestartButton );