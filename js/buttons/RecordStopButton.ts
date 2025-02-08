// Copyright 2016-2025, University of Colorado Boulder

/**
 * Button for toggling 'recording' state on/off.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../axon/js/Property.js';
import InstanceRegistry from '../../../phet-core/js/documentation/InstanceRegistry.js';
import optionize from '../../../phet-core/js/optionize.js';
import Circle from '../../../scenery/js/nodes/Circle.js';
import Rectangle from '../../../scenery/js/nodes/Rectangle.js';
import TColor from '../../../scenery/js/util/TColor.js';
import BooleanRoundToggleButton, { BooleanRoundToggleButtonOptions } from '../../../sun/js/buttons/BooleanRoundToggleButton.js';
import PhetColorScheme from '../PhetColorScheme.js';
import sceneryPhet from '../sceneryPhet.js';

type SelfOptions = {
  radius?: number;
  recordIconColor?: TColor;
  stopIconColor?: TColor;
};

export type RecordStopButtonOptions = SelfOptions & BooleanRoundToggleButtonOptions;

export default class RecordStopButton extends BooleanRoundToggleButton {

  public constructor( recordingProperty: Property<boolean>, providedOptions?: RecordStopButtonOptions ) {

    const options = optionize<RecordStopButtonOptions, SelfOptions, BooleanRoundToggleButtonOptions>()( {

      // RecordStopButtonOptions
      radius: 30,
      recordIconColor: PhetColorScheme.RED_COLORBLIND,
      stopIconColor: PhetColorScheme.RED_COLORBLIND,

      // BooleanRoundToggleButtonOptions
      xMargin: 16.5,
      yMargin: 16.5
    }, providedOptions );

    const squareLength = 0.75 * options.radius;

    const stopIcon = new Rectangle( 0, 0, 0.75 * options.radius, 0.75 * options.radius, {
      fill: options.stopIconColor
    } );

    const recordIcon = new Circle( 0.6 * squareLength, {
      fill: options.recordIconColor,
      center: stopIcon.center
    } );

    super( recordingProperty, stopIcon, recordIcon, options );

    // support for binder documentation, stripped out in builds and only runs when ?binder is specified
    assert && window.phet?.chipper?.queryParameters?.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'RecordStopButton', this );
  }
}

sceneryPhet.register( 'RecordStopButton', RecordStopButton );