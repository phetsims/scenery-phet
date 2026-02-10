// Copyright 2022-2026, University of Colorado Boulder

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
import demoComboBoxKeyboardHelpSection from './demoComboBoxKeyboardHelpSection.js';
import demoFaucetControlsKeyboardHelpSection from './demoFaucetControlsKeyboardHelpSection.js';
import demoFromHotkeyData from './demoFromHotkeyData.js';
import demoGrabReleaseKeyboardHelpSection from './demoGrabReleaseKeyboardHelpSection.js';
import demoHeatCoolControlsKeyboardHelpSection from './demoHeatCoolControlsKeyboardHelpSection.js';
import demoHotkeyDescriptionBuilder from './demoHotkeyDescriptionBuilder.js';
import demoKeyboardHelpIconFactory from './demoKeyboardHelpIconFactory.js';
import demoKeyboardHelpSection from './demoKeyboardHelpSection.js';
import demoKeyNode from './demoKeyNode.js';
import demoMoveDraggableItemsKeyboardHelpSection from './demoMoveDraggableItemsKeyboardHelpSection.js';
import demoSliderControlsKeyboardHelpSection from './demoSliderControlsKeyboardHelpSection.js';
import demoSpinnerControlsKeyboardHelpSection from './demoSpinnerControlsKeyboardHelpSection.js';

type SelfOptions = EmptySelfOptions;
type KeyboardScreenViewOptions = SelfOptions & PickRequired<DemosScreenViewOptions, 'tandem'>;

export default class KeyboardScreenView extends DemosScreenView {

  public constructor( providedOptions: KeyboardScreenViewOptions ) {

    const options = optionize<KeyboardScreenViewOptions, SelfOptions, DemosScreenViewOptions>()( {
      // nothing for now
    }, providedOptions );

    // To add a demo, add an entry here of type DemoItemData.
    const demos = [
      { label: 'BasicActionsKeyboardHelpSection', createNode: demoBasicActionsKeyboardHelpSection },
      { label: 'ComboBoxKeyboardHelpSection', createNode: demoComboBoxKeyboardHelpSection },
      { label: 'FaucetControlsKeyboardHelpSection', createNode: demoFaucetControlsKeyboardHelpSection },
      { label: 'HeatCoolControlsKeyboardHelpSection', createNode: demoHeatCoolControlsKeyboardHelpSection },
      { label: 'HotkeyData', createNode: demoFromHotkeyData },
      { label: 'KeyboardHelpIconFactory', createNode: demoKeyboardHelpIconFactory },
      { label: 'KeyboardHelpSection', createNode: demoKeyboardHelpSection },
      { label: 'HotkeyDescriptionBuilder', createNode: demoHotkeyDescriptionBuilder },
      { label: 'KeyNode', createNode: demoKeyNode },
      { label: 'MoveDraggableItemsKeyboardHelpSection', createNode: demoMoveDraggableItemsKeyboardHelpSection },
      { label: 'SpinnerControlsKeyboardHelpSection', createNode: demoSpinnerControlsKeyboardHelpSection },
      { label: 'SliderControlsKeyboardHelpSection', createNode: demoSliderControlsKeyboardHelpSection },
      { label: 'GrabReleaseKeyboardHelpSection', createNode: demoGrabReleaseKeyboardHelpSection }
    ];

    super( demos, options );
  }
}

sceneryPhet.register( 'KeyboardScreenView', KeyboardScreenView );