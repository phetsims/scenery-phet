// Copyright 2020-2026, University of Colorado Boulder

/**
 * Help section for explaining how to use a keyboard to interact with a ComboBox.
 *
 * NOTE that this keyboard help section is a numbered list by design. See https://github.com/phetsims/molarity/issues/96.
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import { HasDispose } from '../../../../axon/js/Disposable.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import StringProperty from '../../../../axon/js/StringProperty.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';
import HotkeyData from '../../../../scenery/js/input/HotkeyData.js';
import { OneKeyStroke } from '../../../../scenery/js/input/KeyDescriptor.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import sceneryPhet from '../../sceneryPhet.js';
import SceneryPhetFluent from '../../SceneryPhetFluent.js';
import HotkeyDescriptionBuilder from './HotkeyDescriptionBuilder.js';
import KeyboardHelpSection, { KeyboardHelpSectionOptions } from './KeyboardHelpSection.js';
import KeyboardHelpSectionRow from './KeyboardHelpSectionRow.js';

/**
 * Helper function to create a KeyboardHelpSectionRow for this content. The content for
 * this section is more complicated than usual. The visual string needs to be numbered, and that number
 * needs to be in the translatable strings file for localized formatting. However, the accessible string
 * can NOT include the number, because it is implicit from the PDOM markup. As such, there are unique
 * strings for both the visual and accessible content.
 *
 * This class still generates the description of the actual keys from HotkeyData, using the accessible
 * label.
 *
 * Note that this creates Properties that cannot be disposed. If this section needs to be destroyed,
 * dispose will need to be implemented here.
 */
const createSectionRow = (
  keys: OneKeyStroke[],
  visualLabelStringProperty: TReadOnlyProperty<string>,
  accessibleRowDescriptionProperty: TReadOnlyProperty<string>,
  disposables: HasDispose[]
) => {

  const hotkeyData = new HotkeyData( {
    keys: keys,
    repoName: sceneryPhet.name,
    keyboardHelpDialogLabelStringProperty: visualLabelStringProperty
  } );

  // The final description for the row, including the leading accessible string plus the generated
  // description of the keys.
  const accessibleDescriptionStringProperty = HotkeyDescriptionBuilder.createDescriptionProperty(
    accessibleRowDescriptionProperty,
    hotkeyData.keyDescriptorsProperty
  );

  disposables.push( accessibleDescriptionStringProperty );
  disposables.push( hotkeyData );

  return KeyboardHelpSectionRow.fromHotkeyData( hotkeyData, {
    accessibleRowDescriptionProperty: accessibleDescriptionStringProperty
  } );
};

type SelfOptions = {

  // Heading for the section, should be capitalized as a title
  headingString?: string | TReadOnlyProperty<string>;

  // the item being changed by the combo box, lower case as used in a sentence
  thingAsLowerCaseSingular?: string | TReadOnlyProperty<string>;

  // plural version of thingAsLowerCaseSingular
  thingAsLowerCasePlural?: string | TReadOnlyProperty<string>;
};

export type ComboBoxKeyboardHelpSectionOptions = SelfOptions & KeyboardHelpSectionOptions;

export default class ComboBoxKeyboardHelpSection extends KeyboardHelpSection {

  public constructor( providedOptions?: ComboBoxKeyboardHelpSectionOptions ) {

    const options = optionize<ComboBoxKeyboardHelpSectionOptions, SelfOptions, KeyboardHelpSectionOptions>()( {

      // SelfOptions
      headingString: SceneryPhetFluent.keyboardHelpDialog.comboBox.headingStringStringProperty,
      thingAsLowerCaseSingular: SceneryPhetFluent.keyboardHelpDialog.comboBox.optionStringProperty,
      thingAsLowerCasePlural: SceneryPhetFluent.keyboardHelpDialog.comboBox.optionsStringProperty,

      // KeyboardHelpSectionOptions
      a11yContentTagName: 'ol', // ordered list
      vBoxOptions: {
        spacing: 8 // A bit tighter so that it looks like one set of instructions
      }
    }, providedOptions );

    const disposables: HasDispose[] = [];

    // options may be string or TReadOnlyProperty<string>, so ensure that we have a TReadOnlyProperty<string>.
    const thingAsLowerCasePluralStringProperty = ( typeof options.thingAsLowerCasePlural === 'string' ) ?
                                                 new StringProperty( options.thingAsLowerCasePlural ) :
                                                 options.thingAsLowerCasePlural;
    const thingAsLowerCaseSingularStringProperty = ( typeof options.thingAsLowerCaseSingular === 'string' ) ?
                                                   new StringProperty( options.thingAsLowerCaseSingular ) :
                                                   options.thingAsLowerCaseSingular;

    // Create a PatternStringProperty that fills in a plural/singular pattern, and support dynamic locale.
    const createPatternStringProperty = ( providedStringProperty: TReadOnlyProperty<string> ) => {
      const patternStringProperty = new PatternStringProperty(
        providedStringProperty, {
          thingPlural: thingAsLowerCasePluralStringProperty,
          thingSingular: thingAsLowerCaseSingularStringProperty
        }, { tandem: Tandem.OPT_OUT } );

      disposables.push( patternStringProperty );
      return patternStringProperty;
    };

    const popUpList = createSectionRow(
      [ 'space', 'enter' ],
      createPatternStringProperty( SceneryPhetFluent.keyboardHelpDialog.comboBox.popUpListPatternStringProperty ),
      createPatternStringProperty( SceneryPhetFluent.a11y.keyboardHelpDialog.comboBox.popUpListPatternStringProperty ),
      disposables
    );

    const moveThrough = createSectionRow(
      [ 'arrowUp', 'arrowDown' ],
      createPatternStringProperty( SceneryPhetFluent.keyboardHelpDialog.comboBox.moveThroughPatternStringProperty ),
      createPatternStringProperty( SceneryPhetFluent.a11y.keyboardHelpDialog.comboBox.moveThroughPatternStringProperty ),
      disposables
    );

    const chooseNew = createSectionRow(
      [ 'enter' ],
      createPatternStringProperty( SceneryPhetFluent.keyboardHelpDialog.comboBox.chooseNewPatternStringProperty ),
      createPatternStringProperty( SceneryPhetFluent.a11y.keyboardHelpDialog.comboBox.chooseNewPatternStringProperty ),
      disposables
    );

    const closeWithoutChanging = createSectionRow(
      [ 'escape' ],
      SceneryPhetFluent.keyboardHelpDialog.comboBox.closeWithoutChangingStringProperty,
      SceneryPhetFluent.a11y.keyboardHelpDialog.comboBox.closeWithoutChangingStringProperty,
      disposables
    );

    // order the rows of content
    const rows = [ popUpList, moveThrough, chooseNew, closeWithoutChanging ];
    super( options.headingString, rows, options );

    // Add all created disposables after the super call
    this.addDisposable( ...disposables );
  }
}

sceneryPhet.register( 'ComboBoxKeyboardHelpSection', ComboBoxKeyboardHelpSection );