// Copyright 2026, University of Colorado Boulder

/**
 * Demonstrate creating keyboard help content from HotkeyData.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import HotkeyData, { HotkeyDataOptions } from '../../../../scenery/js/input/HotkeyData.js';
import type { OneKeyStroke } from '../../../../scenery/js/input/KeyDescriptor.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import KeyboardHelpIconFactory from '../../keyboard/help/KeyboardHelpIconFactory.js';
import KeyboardHelpSection from '../../keyboard/help/KeyboardHelpSection.js';
import KeyboardHelpSectionRow from '../../keyboard/help/KeyboardHelpSectionRow.js';
import sceneryPhet from '../../sceneryPhet.js';

const DEFAULT_HOTKEY_DATA_OPTIONS = {
  repoName: 'demo-repo',
  binderName: 'Demo Hotkey'
};

// Row-specific data for the demo.
const DEMO_ENTRIES: { label: string; keys: OneKeyStroke[] }[] = [
  {
    label: 'Move between items in a group',
    keys: [ 'arrowLeft', 'arrowRight', 'arrowUp', 'arrowDown' ]
  },
  {
    label: 'Move slower',
    keys: [
      'shift+arrowLeft', 'shift+arrowRight', 'shift+arrowUp', 'shift+arrowDown',
      'shift+w', 'shift+a', 'shift+s', 'shift+d'
    ]
  },
  {
    label: 'Move horizontally',
    keys: [ 'arrowLeft', 'arrowRight', 'a', 'd' ]
  }
];

export default function demoFromHotkeyData( layoutBounds: Bounds2 ): Node {
  const rows = DEMO_ENTRIES.map( entry => {
    const labelProperty = new Property( entry.label );
    const hotkeyData = new HotkeyData( combineOptions<HotkeyDataOptions>( {}, DEFAULT_HOTKEY_DATA_OPTIONS, {
      keys: entry.keys,
      keyboardHelpDialogLabelStringProperty: labelProperty
    } ) );

    return KeyboardHelpSectionRow.fromHotkeyData( hotkeyData );
  } );

  // Demonstrate a custom icon for arrow keys
  rows.push( KeyboardHelpSectionRow.fromHotkeyData(
    new HotkeyData( {
      keys: [ 'arrowLeft', 'arrowRight', 'arrowUp', 'arrowDown' ],
      keyboardHelpDialogLabelStringProperty: new Property( 'Arrow Keys (circle)' ),
      repoName: sceneryPhet.name
    } ),
    {
      icon: new Circle( 10, { fill: 'blue' } )
    }
  ) );

  // Demonstrate a custom icon using data options
  rows.push( KeyboardHelpSectionRow.fromHotkeyData(
    new HotkeyData( {
      keys: [ 'arrowLeft', 'arrowRight', 'arrowUp', 'arrowDown' ],
      keyboardHelpDialogLabelStringProperty: new Property( 'Arrow Keys' ),
      repoName: sceneryPhet.name
    } ),
    {
      iconData: [

        // Alternatives are the different key presses that can be used for this action.
        {
          alternatives: [
            KeyboardHelpIconFactory.leftRightArrowKeysRowIcon(),
            KeyboardHelpIconFactory.upDownArrowKeysRowIcon()
          ],

          // Stacked into one row per alternative.
          layout: 'stacked'
        }
      ]
    }
  ) );

  return new KeyboardHelpSection( 'Content', rows, {
    rightCenter: layoutBounds.rightCenter.minusXY( 20, 0 )
  } );
}
