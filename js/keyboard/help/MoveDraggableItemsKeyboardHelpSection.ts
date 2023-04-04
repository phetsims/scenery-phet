// Copyright 2023, University of Colorado Boulder

/**
 * MoveDraggableItemsKeyboardHelpSection is the keyboard-help section that describes 2-d draggable items.
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import sceneryPhet from '../../sceneryPhet.js';
import KeyboardHelpSection from './KeyboardHelpSection.js';
import KeyboardHelpSectionRow from './KeyboardHelpSectionRow.js';
import SceneryPhetStrings from '../../SceneryPhetStrings.js';
import KeyboardHelpIconFactory from './KeyboardHelpIconFactory.js';

/**
 * MoveDraggableItemsKeyboardHelpSection is the keyboard-help section that describes 2-d draggable items.
 *
 */
class MoveDraggableItemsKeyboardHelpSection extends KeyboardHelpSection {

  public constructor() {

    // arrows or WASD
    const wasdOrArrowsIcon = KeyboardHelpIconFactory.arrowOrWasdKeysRowIcon();
    const normalRow = KeyboardHelpSectionRow.labelWithIcon( SceneryPhetStrings.keyboardHelpDialog.moveStringProperty,
      wasdOrArrowsIcon, {
        labelInnerContent: SceneryPhetStrings.a11y.keyboardHelpDialog.draggableItems.moveDescriptionStringProperty
      } );

    // Shift+arrows or Shift+WASD
    const arrowKeysIcon = KeyboardHelpIconFactory.arrowKeysRowIcon();
    const wasdKeysIcon = KeyboardHelpIconFactory.wasdRowIcon();
    const shiftPlusWasdKeysIcon = KeyboardHelpIconFactory.shiftPlusIcon( wasdKeysIcon );
    const shiftPluArrowKeysIcon = KeyboardHelpIconFactory.shiftPlusIcon( arrowKeysIcon );
    const slowerRow = KeyboardHelpSectionRow.labelWithIconList( SceneryPhetStrings.keyboardHelpDialog.moveSlowerStringProperty, [
      shiftPluArrowKeysIcon,
      shiftPlusWasdKeysIcon
    ], {
      labelInnerContent: SceneryPhetStrings.a11y.keyboardHelpDialog.draggableItems.moveSlowerDescriptionStringProperty
    } );

    super( SceneryPhetStrings.keyboardHelpDialog.moveDraggableItemsStringProperty, [ normalRow, slowerRow ] );

    this.disposeEmitter.addListener( () => {
      normalRow.dispose();
      slowerRow.dispose();
      wasdOrArrowsIcon.dispose();
      arrowKeysIcon.dispose();
      wasdKeysIcon.dispose();
      shiftPlusWasdKeysIcon.dispose();
      shiftPluArrowKeysIcon.dispose();
    } );
  }
}

sceneryPhet.register( 'MoveDraggableItemsKeyboardHelpSection', MoveDraggableItemsKeyboardHelpSection );
export default MoveDraggableItemsKeyboardHelpSection;