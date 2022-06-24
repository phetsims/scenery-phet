// Copyright 2016-2022, University of Colorado Boulder

/**
 * Button for toggling 'recording' state on/off.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import InstanceRegistry from '../../../phet-core/js/documentation/InstanceRegistry.js';
import { Circle, Rectangle } from '../../../scenery/js/imports.js';
import BooleanRoundToggleButton, { BooleanRoundToggleButtonOptions } from '../../../sun/js/buttons/BooleanRoundToggleButton.js';
import PhetColorScheme from '../PhetColorScheme.js';
import sceneryPhet from '../sceneryPhet.js';
import optionize from '../../../phet-core/js/optionize.js';
import Property from '../../../axon/js/Property.js';

type SelfOptions = {
  radius?: number;
};

export type RecordStopButtonOptions = SelfOptions & BooleanRoundToggleButtonOptions;

export default class RecordStopButton extends BooleanRoundToggleButton {

  public constructor( recordingProperty: Property<boolean>, providedOptions?: RecordStopButtonOptions ) {

    const options = optionize<RecordStopButtonOptions, SelfOptions, BooleanRoundToggleButtonOptions>()( {

      // RecordStopButtonOptions
      radius: 30,

      // BooleanRoundToggleButtonOptions
      xMargin: 16.5,
      yMargin: 16.5
    }, providedOptions );

    const squareLength = 0.75 * options.radius;

    // stop icon, a black square
    const stopIcon = new Rectangle( 0, 0, 0.75 * options.radius, 0.75 * options.radius, { fill: 'black' } );

    // record icon, a red circle
    const recordIcon = new Circle( 0.6 * squareLength, {
      fill: PhetColorScheme.RED_COLORBLIND,
      center: stopIcon.center
    } );

    super( recordingProperty, stopIcon, recordIcon, options );

    // support for binder documentation, stripped out in builds and only runs when ?binder is specified
    assert && phet.chipper.queryParameters.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'RecordStopButton', this );
  }
}

sceneryPhet.register( 'RecordStopButton', RecordStopButton );