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
import SceneryPhetStrings from './SceneryPhetStrings.js';
import { Text, TextOptions } from '../../scenery/js/imports.js';
import VerticalAquaRadioButtonGroup, { VerticalAquaRadioButtonGroupOptions } from '../../sun/js/VerticalAquaRadioButtonGroup.js';
import EnumerationProperty from '../../axon/js/EnumerationProperty.js';
import optionize, { combineOptions } from '../../phet-core/js/optionize.js';
import Tandem from '../../tandem/js/Tandem.js';
import StrictOmit from '../../phet-core/js/types/StrictOmit.js';
import { AquaRadioButtonGroupItem } from '../../sun/js/AquaRadioButtonGroup.js';
import sceneryPhet from './sceneryPhet.js';

// maps TimeSpeed to its label and Tandem name
const SPEED_LABEL_MAP = new Map();
SPEED_LABEL_MAP.set( TimeSpeed.FAST, {
  stringProperty: SceneryPhetStrings.speed.fastStringProperty,
  tandemName: 'fastRadioButton'
} );
SPEED_LABEL_MAP.set( TimeSpeed.NORMAL, {
  stringProperty: SceneryPhetStrings.speed.normalStringProperty,
  tandemName: 'normalRadioButton'
} );
SPEED_LABEL_MAP.set( TimeSpeed.SLOW, {
  stringProperty: SceneryPhetStrings.speed.slowStringProperty,
  tandemName: 'slowRadioButton'
} );

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
      tandemNameSuffix: 'RadioButtonGroup',

      // pdom
      labelTagName: 'h4',
      labelContent: SceneryPhetStrings.a11y.timeControlNode.simSpeedsStringProperty,
      descriptionContent: SceneryPhetStrings.a11y.timeControlNode.simSpeedDescriptionStringProperty
    }, providedOptions );

    // by default, radio buttons match height of label before maxWidth scaling adjustments
    if ( !options.radioButtonOptions || options.radioButtonOptions.radius === undefined ) {
      if ( !options.radioButtonOptions ) {
        options.radioButtonOptions = {};
      }
      options.radioButtonOptions.radius = new Text( 'test', options.labelOptions ).height / 2;
    }

    const items = timeSpeeds.map( speed => {

      const stringProperty = SPEED_LABEL_MAP.get( speed ).stringProperty;

      const item: AquaRadioButtonGroupItem<TimeSpeed> = {
        value: speed,
        createNode: tandem => new Text( stringProperty, combineOptions<TextOptions>( {
          tandem: tandem.createTandem( 'labelText' )
        }, options.labelOptions ) ),
        labelContent: stringProperty,
        tandemName: SPEED_LABEL_MAP.get( speed ).tandemName
      };
      return item;
    } );

    super( timeSpeedProperty, items, options );
  }
}

sceneryPhet.register( 'TimeSpeedRadioButtonGroup', TimeSpeedRadioButtonGroup );