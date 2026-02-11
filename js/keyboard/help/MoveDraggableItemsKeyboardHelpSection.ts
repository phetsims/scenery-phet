// Copyright 2023-2026, University of Colorado Boulder

/**
 * MoveDraggableItemsKeyboardHelpSection is the keyboard-help section that describes how to move items in 2D.
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';
import KeyboardDragListener from '../../../../scenery/js/listeners/KeyboardDragListener.js';
import sceneryPhet from '../../sceneryPhet.js';
import SceneryPhetFluent from '../../SceneryPhetFluent.js';
import KeyboardHelpSection from './KeyboardHelpSection.js';
import KeyboardHelpSectionRow from './KeyboardHelpSectionRow.js';

type MoveDraggableItemsKeyboardHelpSectionOptions = {

  // The heading string for this help section.
  headingStringProperty?: TReadOnlyProperty<string>;
};

export default class MoveDraggableItemsKeyboardHelpSection extends KeyboardHelpSection {

  public constructor( providedOptions?: MoveDraggableItemsKeyboardHelpSectionOptions ) {

    const options = optionize<MoveDraggableItemsKeyboardHelpSectionOptions>()( {
      headingStringProperty: SceneryPhetFluent.keyboardHelpDialog.moveDraggableItemsStringProperty
    }, providedOptions );

    // Move
    const moveRow = KeyboardHelpSectionRow.fromHotkeyData( KeyboardDragListener.MOVE_HOTKEY_DATA, {
      labelStringProperty: SceneryPhetFluent.keyboardHelpDialog.moveStringProperty
    } );

    // Move slower
    const moveSlowerRow = KeyboardHelpSectionRow.fromHotkeyData( KeyboardDragListener.MOVE_SLOWER_HOTKEY_DATA, {
      labelStringProperty: SceneryPhetFluent.keyboardHelpDialog.moveSlowerStringProperty
    } );

    super( options.headingStringProperty, [ moveRow, moveSlowerRow ] );
  }
}

sceneryPhet.register( 'MoveDraggableItemsKeyboardHelpSection', MoveDraggableItemsKeyboardHelpSection );