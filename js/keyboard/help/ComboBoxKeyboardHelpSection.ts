// Copyright 2020-2023, University of Colorado Boulder

/**
 * Help section for explaining how to use a keyboard to interact with a ComboBox.
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import StringProperty from '../../../../axon/js/StringProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';
import sceneryPhet from '../../sceneryPhet.js';
import SceneryPhetStrings from '../../SceneryPhetStrings.js';
import TextKeyNode from '../TextKeyNode.js';
import KeyboardHelpIconFactory from './KeyboardHelpIconFactory.js';
import KeyboardHelpSection, { KeyboardHelpSectionOptions } from './KeyboardHelpSection.js';
import KeyboardHelpSectionRow from './KeyboardHelpSectionRow.js';

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
      headingString: SceneryPhetStrings.keyboardHelpDialog.comboBox.headingStringStringProperty,
      thingAsLowerCaseSingular: SceneryPhetStrings.keyboardHelpDialog.comboBox.optionStringProperty,
      thingAsLowerCasePlural: SceneryPhetStrings.keyboardHelpDialog.comboBox.optionsStringProperty,

      // KeyboardHelpSectionOptions
      a11yContentTagName: 'ol', // ordered list
      vBoxOptions: {
        spacing: 8 // A bit tighter so that it looks like one set of instructions
      }
    }, providedOptions );

    // options may be string or TReadOnlyProperty<string>, so ensure that we have a TReadOnlyProperty<string>.
    const thingAsLowerCasePluralStringProperty = ( typeof options.thingAsLowerCasePlural === 'string' ) ?
                                                 new StringProperty( options.thingAsLowerCasePlural ) :
                                                 options.thingAsLowerCasePlural;
    const thingAsLowerCaseSingularStringProperty = ( typeof options.thingAsLowerCaseSingular === 'string' ) ?
                                                   new StringProperty( options.thingAsLowerCaseSingular ) :
                                                   options.thingAsLowerCaseSingular;

    const ourPatternStringsToDispose: PatternStringProperty<object>[] = [];

    // Create a DerivedProperty that fills in a plural/singular pattern, and support dynamic locale.
    const createPatternStringProperty = ( providedStringProperty: TReadOnlyProperty<string> ) => {
      const patternStringProperty = new PatternStringProperty(
        providedStringProperty, {
          thingPlural: thingAsLowerCasePluralStringProperty,
          thingSingular: thingAsLowerCaseSingularStringProperty
        } );
      ourPatternStringsToDispose.push( patternStringProperty );
      return patternStringProperty;
    };

    const spaceKeyNode = TextKeyNode.space();
    const enterKeyNode = TextKeyNode.enter();
    const spaceOrEnterIcon = KeyboardHelpIconFactory.iconOrIcon( spaceKeyNode, enterKeyNode );

    const popUpList = KeyboardHelpSectionRow.labelWithIcon(
      createPatternStringProperty( SceneryPhetStrings.keyboardHelpDialog.comboBox.popUpListPatternStringProperty ),
      spaceOrEnterIcon, {
        labelInnerContent: createPatternStringProperty( SceneryPhetStrings.a11y.keyboardHelpDialog.comboBox.popUpListPatternDescriptionStringProperty )
      } );

    const moveThrough = KeyboardHelpSectionRow.labelWithIcon(
      createPatternStringProperty( SceneryPhetStrings.keyboardHelpDialog.comboBox.moveThroughPatternStringProperty ),
      KeyboardHelpIconFactory.upDownArrowKeysRowIcon(), {
        labelInnerContent: createPatternStringProperty( SceneryPhetStrings.a11y.keyboardHelpDialog.comboBox.moveThroughPatternDescriptionStringProperty )
      } );

    const chooseNew = KeyboardHelpSectionRow.labelWithIcon(
      createPatternStringProperty( SceneryPhetStrings.keyboardHelpDialog.comboBox.chooseNewPatternStringProperty ),
      enterKeyNode, {
        labelInnerContent: createPatternStringProperty( SceneryPhetStrings.a11y.keyboardHelpDialog.comboBox.chooseNewPatternDescriptionStringProperty )
      } );

    const escapeKeyNode = TextKeyNode.esc();
    const closeWithoutChanging = KeyboardHelpSectionRow.labelWithIcon(
      SceneryPhetStrings.keyboardHelpDialog.comboBox.closeWithoutChangingStringProperty,
      escapeKeyNode, {
        labelInnerContent: SceneryPhetStrings.a11y.keyboardHelpDialog.comboBox.closeWithoutChangingDescriptionStringProperty
      } );

    // order the rows of content
    const rows = [ popUpList, moveThrough, chooseNew, closeWithoutChanging ];
    super( options.headingString, rows, options );

    this.disposeEmitter.addListener( () => {
      rows.forEach( row => row.dispose() );
      escapeKeyNode.dispose();
      spaceOrEnterIcon.dispose();
      enterKeyNode.dispose();
      spaceKeyNode.dispose();
      ourPatternStringsToDispose.forEach( pattern => pattern.dispose() );
    } );
  }
}

sceneryPhet.register( 'ComboBoxKeyboardHelpSection', ComboBoxKeyboardHelpSection );