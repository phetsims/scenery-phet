// Copyright 2023-2025, University of Colorado Boulder

/**
 * MoveDraggableItemsKeyboardHelpSection is the keyboard-help section that describes how to move items in 2D.
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import sceneryPhet from '../../sceneryPhet.js';
import SceneryPhetFluent from '../../SceneryPhetFluent.js';
import KeyboardHelpIconFactory from './KeyboardHelpIconFactory.js';
import KeyboardHelpSection from './KeyboardHelpSection.js';
import KeyboardHelpSectionRow from './KeyboardHelpSectionRow.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';

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
    const moveRow = KeyboardHelpSectionRow.labelWithIcon(
      SceneryPhetFluent.keyboardHelpDialog.moveStringProperty,
      KeyboardHelpIconFactory.arrowOrWasdKeysRowIcon(), {
        labelInnerContent: SceneryPhetFluent.a11y.keyboardHelpDialog.draggableItems.moveDescriptionStringProperty
      } );

    // Move slower
    const moveSlowerRow = KeyboardHelpSectionRow.labelWithIconList(
      SceneryPhetFluent.keyboardHelpDialog.moveSlowerStringProperty, [
        KeyboardHelpIconFactory.shiftPlusIcon( KeyboardHelpIconFactory.arrowKeysRowIcon() ),
        KeyboardHelpIconFactory.shiftPlusIcon( KeyboardHelpIconFactory.wasdRowIcon() )
      ], {
        labelInnerContent: SceneryPhetFluent.a11y.keyboardHelpDialog.draggableItems.moveSlowerDescriptionStringProperty
      } );

    super( options.headingStringProperty, [ moveRow, moveSlowerRow ] );
  }
}

sceneryPhet.register( 'MoveDraggableItemsKeyboardHelpSection', MoveDraggableItemsKeyboardHelpSection );