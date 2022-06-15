// Copyright 2014-2022, University of Colorado Boulder

/**
 * Restart button.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import { Shape } from '../../../kite/js/imports.js';
import StrictOmit from '../../../phet-core/js/types/StrictOmit.js';
import InstanceRegistry from '../../../phet-core/js/documentation/InstanceRegistry.js';
import optionize from '../../../phet-core/js/optionize.js';
import EmptyObjectType from '../../../phet-core/js/types/EmptyObjectType.js';
import { HBox, Path, Rectangle } from '../../../scenery/js/imports.js';
import RoundPushButton, { RoundPushButtonOptions } from '../../../sun/js/buttons/RoundPushButton.js';
import sceneryPhet from '../sceneryPhet.js';

// constants
const scale = 0.75;
const vscale = 1.15;
const barWidth = 6 * scale;
const barHeight = 18 * scale * vscale;
const triangleWidth = 14 * scale;
const triangleHeight = 18 * scale * vscale;

type SelfOptions = EmptyObjectType;

export type RestartButtonOptions = SelfOptions & StrictOmit<RoundPushButtonOptions, 'content'>;

export default class RestartButton extends RoundPushButton {

  public constructor( providedOptions?: RestartButtonOptions ) {

    const options = optionize<RestartButtonOptions, SelfOptions, RoundPushButtonOptions>()( {}, providedOptions );

    const barPath = new Rectangle( 0, 0, barWidth, barHeight, { fill: 'black', stroke: '#bbbbbb', lineWidth: 1 } );
    const trianglePath = new Path( new Shape().moveTo( 0, triangleHeight / 2 ).lineTo( -triangleWidth, 0 ).lineTo( 0, -triangleHeight / 2 ).close(), {
      fill: 'black',
      stroke: '#bbbbbb',
      lineWidth: 1
    } );
    const trianglePath2 = new Path( new Shape().moveTo( 0, triangleHeight / 2 ).lineTo( -triangleWidth, 0 ).lineTo( 0, -triangleHeight / 2 ).close(), {
      fill: 'black',
      stroke: '#bbbbbb',
      lineWidth: 1
    } );

    options.content = new HBox( { children: [ barPath, trianglePath, trianglePath2 ], spacing: -1 } );

    super( options );

    // support for binder documentation, stripped out in builds and only runs when ?binder is specified
    assert && phet.chipper.queryParameters.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'RestartButton', this );
  }
}

sceneryPhet.register( 'RestartButton', RestartButton );