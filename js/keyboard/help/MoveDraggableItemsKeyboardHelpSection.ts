// Copyright 2023-2025, University of Colorado Boulder

/**
 * MoveDraggableItemsKeyboardHelpSection is the keyboard-help section that describes how to move items in 2D.
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import sceneryPhet from '../../sceneryPhet.js';
import SceneryPhetStrings from '../../SceneryPhetStrings.js';
import KeyboardHelpIconFactory from './KeyboardHelpIconFactory.js';
import KeyboardHelpSection from './KeyboardHelpSection.js';
import KeyboardHelpSectionRow from './KeyboardHelpSectionRow.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';

type MoveDraggableItemsKeyboardHelpSectionOptions = {

  // The heading string for this help section.
  headingStringProperty?: TReadOnlyProperty<string>;
};

export default class MoveDraggableItemsKeyboardHelpSection extends KeyboardHelpSection {

  public constructor( providedOptions?: MoveDraggableItemsKeyboardHelpSectionOptions ) {

    const options = optionize<MoveDraggableItemsKeyboardHelpSectionOptions>()( {
      headingStringProperty: SceneryPhetStrings.keyboardHelpDialog.moveDraggableItemsStringProperty
    }, providedOptions );

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

    super( options.headingStringProperty, [ moveRow, moveSlowerRow ] );
  }
}

sceneryPhet.register( 'MoveDraggableItemsKeyboardHelpSection', MoveDraggableItemsKeyboardHelpSection );