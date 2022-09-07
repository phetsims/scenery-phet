// Copyright 2020-2022, University of Colorado Boulder

/**
 * Help section for explaining how to use a keyboard to interact with a ComboBox.
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import StringProperty from '../../../../axon/js/StringProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
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

    // Create a DerivedProperty that fills in a plural/singular pattern, and support dynamic locale.
    const createDerivedStringProperty = ( patternStringProperty: TReadOnlyProperty<string> ) => new DerivedProperty(
      [ patternStringProperty, thingAsLowerCasePluralStringProperty, thingAsLowerCaseSingularStringProperty ],
      ( patternString, thingAsLowerCasePluralString, thingAsLowerCaseSingular ) =>
        StringUtils.fillIn( patternString, {
          thingPlural: thingAsLowerCasePluralString,
          thingSingular: thingAsLowerCaseSingular
        } ) );

    const popUpList = KeyboardHelpSectionRow.labelWithIcon(
      createDerivedStringProperty( SceneryPhetStrings.keyboardHelpDialog.comboBox.popUpListPatternStringProperty ),
      KeyboardHelpIconFactory.iconOrIcon( TextKeyNode.space(), TextKeyNode.enter() ), {
        labelInnerContent: createDerivedStringProperty( SceneryPhetStrings.a11y.keyboardHelpDialog.comboBox.popUpListPatternDescriptionStringProperty )
      } );

    const moveThrough = KeyboardHelpSectionRow.labelWithIcon(
      createDerivedStringProperty( SceneryPhetStrings.keyboardHelpDialog.comboBox.moveThroughPatternStringProperty ),
      KeyboardHelpIconFactory.upDownArrowKeysRowIcon(), {
        labelInnerContent: createDerivedStringProperty( SceneryPhetStrings.a11y.keyboardHelpDialog.comboBox.moveThroughPatternDescriptionStringProperty )
      } );

    const chooseNew = KeyboardHelpSectionRow.labelWithIcon(
      createDerivedStringProperty( SceneryPhetStrings.keyboardHelpDialog.comboBox.chooseNewPatternStringProperty ),
      TextKeyNode.enter(), {
        labelInnerContent: createDerivedStringProperty( SceneryPhetStrings.a11y.keyboardHelpDialog.comboBox.chooseNewPatternDescriptionStringProperty )
      } );

    const closeWithoutChanging = KeyboardHelpSectionRow.labelWithIcon(
      SceneryPhetStrings.keyboardHelpDialog.comboBox.closeWithoutChangingStringProperty,
      TextKeyNode.esc(), {
        labelInnerContent: SceneryPhetStrings.a11y.keyboardHelpDialog.comboBox.closeWithoutChangingDescriptionStringProperty
      } );

    // order the rows of content
    super( options.headingString, [ popUpList, moveThrough, chooseNew, closeWithoutChanging ], options );
  }
}

sceneryPhet.register( 'ComboBoxKeyboardHelpSection', ComboBoxKeyboardHelpSection );