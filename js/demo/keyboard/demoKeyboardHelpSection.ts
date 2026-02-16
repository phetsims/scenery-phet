// Copyright 2022-2026, University of Colorado Boulder

/**
 * Demonstrates how to create custom help with KeyboardHelpSection.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import HotkeyData from '../../../../scenery/js/input/HotkeyData.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import KeyboardHelpSection from '../../keyboard/help/KeyboardHelpSection.js';
import KeyboardHelpSectionRow from '../../keyboard/help/KeyboardHelpSectionRow.js';
import TextKeyNode from '../../keyboard/TextKeyNode.js';
import sceneryPhet from '../../sceneryPhet.js';

export default function demoKeyboardHelpSection( layoutBounds: Bounds2 ): Node {

  const labelWithArrowKeysRowIcon = KeyboardHelpSectionRow.fromHotkeyData( new HotkeyData( {
    keys: [ 'arrowUp', 'arrowLeft', 'arrowDown', 'arrowRight' ],
    keyboardHelpDialogLabelStringProperty: new Property( 'Do one thing' ),
    repoName: sceneryPhet.name
  } ) );

  const labelWithUpDownArrowKeysRowIcon = KeyboardHelpSectionRow.fromHotkeyData( new HotkeyData( {
    keys: [ 'arrowUp', 'arrowDown' ],
    keyboardHelpDialogLabelStringProperty: new Property( 'Do another thing' ),
    repoName: sceneryPhet.name
  } ) );

  const labelWithLeftRightArrowKeysRowIcon = KeyboardHelpSectionRow.fromHotkeyData( new HotkeyData( {
    keys: [ 'arrowLeft', 'arrowRight' ],
    keyboardHelpDialogLabelStringProperty: new Property( 'Do some other thing' ),
    repoName: sceneryPhet.name
  } ) );

  // Unusual example that does not use keys or HotkeyData, but you can create an icon with any content you want.
  const labelWithIcon = KeyboardHelpSectionRow.labelWithIcon( 'Label With Icon:', new TextKeyNode( 'Hi' ), {
    accessibleRowDescriptionProperty: new Property( 'Label With Icon Hi' )
  } );

  // Unusual example that does not use keys or HotkeyData, but you can create a list of icons if you want.
  const labelWithIconList = KeyboardHelpSectionRow.labelWithIconList( 'Label With Icon List:', [
    new TextKeyNode( 'Hi' ),
    new TextKeyNode( 'Hello' ),
    new TextKeyNode( 'Ahoy\' Manatee' )
  ], {
    accessibleRowDescriptionProperty: new Property( 'Label with icon list of hi, hello, Ahoy Manatee.' )
  } );

  const content = [
    labelWithArrowKeysRowIcon,
    labelWithUpDownArrowKeysRowIcon,
    labelWithLeftRightArrowKeysRowIcon,
    labelWithIcon,
    labelWithIconList
  ];

  return new KeyboardHelpSection( 'Custom Help Content', content, {
    center: layoutBounds.center
  } );
}