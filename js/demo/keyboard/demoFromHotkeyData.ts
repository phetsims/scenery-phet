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
import { HotkeySetVariant } from '../../keyboard/help/HotkeySetDefinitions.js';
import KeyboardHelpSection from '../../keyboard/help/KeyboardHelpSection.js';
import KeyboardHelpSectionRow from '../../keyboard/help/KeyboardHelpSectionRow.js';
import sceneryPhet from '../../sceneryPhet.js';

const DEFAULT_HOTKEY_DATA_OPTIONS = {
  repoName: 'demo-repo',
  binderName: 'Demo Hotkey'
};

// Row-specific data for the demo.
const DEMO_ENTRIES: { label: string; keys: OneKeyStroke[]; hotkeySetVariant?: HotkeySetVariant }[] = [
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
  },
  {
    label: 'Use Arrow Keys (paired)',
    keys: [ 'arrowLeft', 'arrowRight', 'arrowUp', 'arrowDown' ],

    // Demonstrate the arrow keys with the alternative 'paired' hotkey set variant.
    hotkeySetVariant: 'paired'
  },
  {
    label: 'Use Arrow Keys Slowly (paired)',
    keys: [ 'shift+arrowLeft', 'shift+arrowRight', 'shift+arrowUp', 'shift+arrowDown' ],

    // Demonstrate the arrow keys with the alternative 'paired' hotkey set variant, with a modifier.
    hotkeySetVariant: 'paired'
  }
];

export default function demoFromHotkeyData( layoutBounds: Bounds2 ): Node {
  const rows = DEMO_ENTRIES.map( entry => {
    const labelProperty = new Property( entry.label );
    const hotkeyData = new HotkeyData( combineOptions<HotkeyDataOptions>( {}, DEFAULT_HOTKEY_DATA_OPTIONS, {
      keys: entry.keys,
      keyboardHelpDialogLabelStringProperty: labelProperty
    } ) );

    return KeyboardHelpSectionRow.fromHotkeyData( hotkeyData, {
      hotkeySetVariant: entry.hotkeySetVariant
    } );
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

  return new KeyboardHelpSection( 'Content', rows, {
    rightCenter: layoutBounds.rightCenter.minusXY( 20, 0 )
  } );
}
