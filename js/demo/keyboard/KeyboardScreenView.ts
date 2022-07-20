// Copyright 2022, University of Colorado Boulder

/**
 * Demos for things in scenery-phet/js/keyboard/.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import DemosScreenView, { DemosScreenViewOptions } from '../../../../sun/js/demo/DemosScreenView.js';
import sceneryPhet from '../../sceneryPhet.js';
import demoBasicActionsKeyboardHelpSection from './demoBasicActionsKeyboardHelpSection.js';
import demoSliderControlsKeyboardHelpSection from './demoSliderControlsKeyboardHelpSection.js';
import demoComboBoxKeyboardHelpSection from './demoComboBoxKeyboardHelpSection.js';
import demoKeyNode from './demoKeyNode.js';
import demoKeyboardHelpSection from './demoKeyboardHelpSection.js';
import demoKeyboardHelpIconFactory from './demoKeyboardHelpIconFactory.js';

type SelfOptions = EmptySelfOptions;
type KeyboardScreenViewOptions = SelfOptions & PickRequired<DemosScreenViewOptions, 'tandem'>;

export default class KeyboardScreenView extends DemosScreenView {

  public constructor( providedOptions: KeyboardScreenViewOptions ) {

    const options = optionize<KeyboardScreenViewOptions, SelfOptions, DemosScreenViewOptions>()( {
      // nothing for now
    }, providedOptions );

    // To add a demo, add an entry here of type SunDemo.
    const demos = [
      { label: 'BasicActionsKeyboardHelpSection', createNode: demoBasicActionsKeyboardHelpSection },
      { label: 'ComboBoxKeyboardHelpSection', createNode: demoComboBoxKeyboardHelpSection },
      { label: 'KeyboardHelpIconFactory', createNode: demoKeyboardHelpIconFactory },
      { label: 'KeyboardHelpSection', createNode: demoKeyboardHelpSection },
      { label: 'KeyNode', createNode: demoKeyNode },
      { label: 'SliderControlsKeyboardHelpSection', createNode: demoSliderControlsKeyboardHelpSection }
    ];

    super( demos, options );
  }
}

sceneryPhet.register( 'KeyboardScreenView', KeyboardScreenView );