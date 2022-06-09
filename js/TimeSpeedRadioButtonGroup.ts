// Copyright 2022, University of Colorado Boulder

/**
 * TimeSpeedRadioButtonGroup is a radio button group for selecting TimeSpeed.
 * It's typically a subcomponent of TimeControlNode, and was originally an inner class of TimeControlNode.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import TimeSpeed from './TimeSpeed.js';
import PhetFont from './PhetFont.js';
import sceneryPhetStrings from './sceneryPhetStrings.js';
import { Text, TextOptions } from '../../scenery/js/imports.js';
import VerticalAquaRadioButtonGroup, { VerticalAquaRadioButtonGroupOptions } from '../../sun/js/VerticalAquaRadioButtonGroup.js';
import EnumerationProperty from '../../axon/js/EnumerationProperty.js';
import optionize from '../../phet-core/js/optionize.js';
import Tandem from '../../tandem/js/Tandem.js';
import StrictOmit from '../../phet-core/js/types/StrictOmit.js';

// maps TimeSpeed to its label and Tandem name
const SPEED_LABEL_MAP = new Map();
SPEED_LABEL_MAP.set( TimeSpeed.FAST, { labelString: sceneryPhetStrings.speed.fast, tandemName: 'fastRadioButton' } );
SPEED_LABEL_MAP.set( TimeSpeed.NORMAL, { labelString: sceneryPhetStrings.speed.normal, tandemName: 'normalRadioButton' } );
SPEED_LABEL_MAP.set( TimeSpeed.SLOW, { labelString: sceneryPhetStrings.speed.slow, tandemName: 'slowRadioButton' } );

type SelfOptions = {
  radius?: number;
  labelOptions?: TextOptions;
};

export type TimeSpeedRadioButtonGroupOptions = SelfOptions & VerticalAquaRadioButtonGroupOptions;

export default class TimeSpeedRadioButtonGroup extends VerticalAquaRadioButtonGroup<TimeSpeed> {

  public constructor( timeSpeedProperty: EnumerationProperty<TimeSpeed>, timeSpeeds: TimeSpeed[],
                      providedOptions?: TimeSpeedRadioButtonGroupOptions ) {

    const options = optionize<TimeSpeedRadioButtonGroupOptions,
      StrictOmit<SelfOptions, 'radius'>, VerticalAquaRadioButtonGroupOptions>()( {

      // SelfOptions
      labelOptions: {
        font: new PhetFont( 14 ),
        maxWidth: 130 // i18n
      },

      // VerticalAquaRadioButtonGroupOptions
      spacing: 9,

      // phetio
      tandem: Tandem.REQUIRED,

      // pdom
      labelTagName: 'h4',
      labelContent: sceneryPhetStrings.a11y.timeControlNode.simSpeeds,
      descriptionContent: sceneryPhetStrings.a11y.timeControlNode.simSpeedDescription
    }, providedOptions );

    // by default, radio buttons match height of label before maxWidth scaling adjustments
    if ( !options.radioButtonOptions || options.radioButtonOptions.radius === undefined ) {
      if ( !options.radioButtonOptions ) {
        options.radioButtonOptions = {};
      }
      options.radioButtonOptions.radius = new Text( 'test', options.labelOptions ).height / 2;
    }

    const items = timeSpeeds.map( speed => {

      const speedLabel = SPEED_LABEL_MAP.get( speed ).labelString;
      const labelNode = new Text( speedLabel, options.labelOptions );

      return {
        value: speed,
        node: labelNode,
        labelContent: speedLabel,
        tandemName: SPEED_LABEL_MAP.get( speed ).tandemName
      };
    } );

    super( timeSpeedProperty, items, options );
  }
}