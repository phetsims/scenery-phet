// Copyright 2023-2024, University of Colorado Boulder

/**
 * MoveDraggableItemsKeyboardHelpSection is the keyboard-help section that describes how to move items in 2D.
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import sceneryPhet from '../../sceneryPhet.js';
import KeyboardHelpSection from './KeyboardHelpSection.js';
import KeyboardHelpSectionRow from './KeyboardHelpSectionRow.js';
import SceneryPhetStrings from '../../SceneryPhetStrings.js';
import KeyboardHelpIconFactory from './KeyboardHelpIconFactory.js';

export default class MoveDraggableItemsKeyboardHelpSection extends KeyboardHelpSection {

  public constructor() {

    // Move
    const moveRow = KeyboardHelpSectionRow.labelWithIcon(
      SceneryPhetStrings.keyboardHelpDialog.moveStringProperty,
      KeyboardHelpIconFactory.arrowOrWasdKeysRowIcon(), {
        labelInnerContent: SceneryPhetStrings.a11y.keyboardHelpDialog.draggableItems.moveDescriptionStringProperty
      } );

    // Move slower
    const moveSlowerRow = KeyboardHelpSectionRow.labelWithIconList(
      SceneryPhetStrings.keyboardHelpDialog.moveSlowerStringProperty, [
        KeyboardHelpIconFactory.shiftPlusIcon( KeyboardHelpIconFactory.arrowKeysRowIcon() ),
        KeyboardHelpIconFactory.shiftPlusIcon( KeyboardHelpIconFactory.wasdRowIcon() )
      ], {
        labelInnerContent: SceneryPhetStrings.a11y.keyboardHelpDialog.draggableItems.moveSlowerDescriptionStringProperty
      } );

    super( SceneryPhetStrings.keyboardHelpDialog.moveDraggableItemsStringProperty, [ moveRow, moveSlowerRow ] );
  }
}

sceneryPhet.register( 'MoveDraggableItemsKeyboardHelpSection', MoveDraggableItemsKeyboardHelpSection );