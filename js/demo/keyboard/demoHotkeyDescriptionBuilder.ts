// Copyright 2025, University of Colorado Boulder

/**
 * Demonstrate creating keyboard help icons and descriptions directly from a HotkeyData.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import HotkeyData, { HotkeyDataOptions } from '../../../../scenery/js/input/HotkeyData.js';
import type { OneKeyStroke } from '../../../../scenery/js/input/KeyDescriptor.js';
import GridBox from '../../../../scenery/js/layout/nodes/GridBox.js';
import HSeparator from '../../../../scenery/js/layout/nodes/HSeparator.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import HotkeyDescriptionBuilder from '../../keyboard/help/HotkeyDescriptionBuilder.js';
import KeyboardHelpIconFactory from '../../keyboard/help/KeyboardHelpIconFactory.js';
import PhetFont from '../../PhetFont.js';

const FONT = new PhetFont( 16 );
const DEFAULT_HOTKEY_DATA_OPTIONS = {
  repoName: 'demo-repo',
  binderName: 'Demo Hotkey'
};

// Row-specific data for the demo.
const DEMO_ENTRIES: { label: string; keys: OneKeyStroke[] }[] = [
  {
    label: 'Move to next item or group',
    keys: [ 'tab' ]
  },
  {
    label: 'Move to previous item or group',
    keys: [ 'shift+tab' ]
  },
  {
    label: 'Press buttons',
    keys: [ 'space', 'enter' ]
  },
  {
    label: 'Toggle checkboxes',
    keys: [ 'space' ]
  },
  {
    label: 'Move between items in a group',
    keys: [ 'arrowLeft', 'arrowRight', 'arrowUp', 'arrowDown' ]
  },
  {
    label: 'Move draggable items',
    keys: [ 'arrowLeft', 'arrowRight', 'arrowUp', 'arrowDown', 'w', 'a', 's', 'd' ]
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
    label: 'Check the fallback cases',
    keys: [ 'a+c', 'd', 'r', 'w', 'l' ]
  },
  {
    label: 'Check vector values',
    keys: [ 'alt+c' ]
  },
  {
    label: 'Remove from graph area',
    keys: [ 'delete', 'backspace' ]
  },
  {
    label: 'Test modifiers with',
    keys: [ 'alt+shift+w' ]
  }
];

export default function demoHotkeyDescriptionBuilder( layoutBounds: Bounds2 ): Node {
  const rows = DEMO_ENTRIES.map( entry => {
    const labelProperty = new Property( entry.label );
    const hotkeyData = new HotkeyData( combineOptions<HotkeyDataOptions>( {}, DEFAULT_HOTKEY_DATA_OPTIONS, {
      keys: entry.keys,
      keyboardHelpDialogLabelStringProperty: labelProperty
    } ) );

    const icon = KeyboardHelpIconFactory.fromHotkeyData( hotkeyData );

    const descriptionProperty = HotkeyDescriptionBuilder.createDescriptionProperty(
      hotkeyData.keyboardHelpDialogLabelStringProperty!,
      hotkeyData.keyDescriptorsProperty
    );

    const text = new RichText( descriptionProperty, { font: FONT, lineWrap: 400 } );

    // For aligned grid layout.
    icon.layoutOptions = { xAlign: 'right' };
    text.layoutOptions = { xAlign: 'left' };

    return [ icon, text ];
  } );

  // Interleave separators between rows
  const interleavedRows: Node[][] = [];
  rows.forEach( ( row, index ) => {
    interleavedRows.push( row );
    if ( index < rows.length - 1 ) {
      interleavedRows.push( [ new HSeparator(), new HSeparator() ] );
    }
  } );

  return new GridBox( {
    rows: interleavedRows,
    ySpacing: 8,
    xSpacing: 16,
    rightCenter: layoutBounds.rightCenter.minusXY( 20, 0 )
  } );
}
