// Copyright 2020-2022, University of Colorado Boulder

/**
 * Help section for explaining how to use a keyboard to interact with a ComboBox.
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import StringProperty from '../../../../axon/js/StringProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import sceneryPhet from '../../sceneryPhet.js';
import sceneryPhetStrings from '../../sceneryPhetStrings.js';
import TextKeyNode from '../TextKeyNode.js';
import KeyboardHelpIconFactory from './KeyboardHelpIconFactory.js';
import KeyboardHelpSection from './KeyboardHelpSection.js';
import KeyboardHelpSectionRow from './KeyboardHelpSectionRow.js';

class ComboBoxKeyboardHelpSection extends KeyboardHelpSection {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {

      // {string|TReadOnlyProperty.<string>} Heading for the section, should be capitalized as a title
      headingString: sceneryPhetStrings.keyboardHelpDialog.comboBox.headingStringStringProperty,

      // {string|TReadOnlyProperty.<string>} the item being changed by the combo box, lower case as used in a sentence.
      thingAsLowerCaseSingular: sceneryPhetStrings.keyboardHelpDialog.comboBox.option,

      // {string|TReadOnlyProperty.<string>} plural version of thingAsLowerCaseSingular
      thingAsLowerCasePlural: sceneryPhetStrings.keyboardHelpDialog.comboBox.options,

      a11yContentTagName: 'ol', // ordered list
      vBoxOptions: {
        spacing: 8 // A bit tighter so that it looks like one set of instructions
      }
    }, options );

    // options may be string or TReadOnlyProperty<string>, so ensure that we have a TReadOnlyProperty<string>.
    const thingAsLowerCasePluralStringProperty = ( typeof options.thingAsLowerCasePlural === 'string' ) ?
                                                 new StringProperty( options.thingAsLowerCasePlural ) :
                                                 options.thingAsLowerCasePlural;
    const thingAsLowerCaseSingularStringProperty = ( typeof options.thingAsLowerCaseSingular === 'string' ) ?
                                                   new StringProperty( options.thingAsLowerCaseSingular ) :
                                                   options.thingAsLowerCaseSingular;

    // Create a DerivedProperty that fills in a plural/singular pattern, and support dynamic locale.
    const createDerivedStringProperty = patternStringProperty => new DerivedProperty(
      [ patternStringProperty, thingAsLowerCasePluralStringProperty, thingAsLowerCaseSingularStringProperty ],
      ( patternString, thingAsLowerCasePluralString, thingAsLowerCaseSingular ) =>
        StringUtils.fillIn( patternString, {
          thingPlural: thingAsLowerCasePluralString,
          thingSingular: thingAsLowerCaseSingular
        } ) );

    const popUpList = KeyboardHelpSectionRow.labelWithIcon(
      createDerivedStringProperty( sceneryPhetStrings.keyboardHelpDialog.comboBox.popUpListPatternStringProperty ),
      KeyboardHelpIconFactory.iconOrIcon( TextKeyNode.space(), TextKeyNode.enter() ), {
        labelInnerContent: createDerivedStringProperty( sceneryPhetStrings.a11y.keyboardHelpDialog.comboBox.popUpListPatternDescriptionStringProperty )
      } );

    const moveThrough = KeyboardHelpSectionRow.labelWithIcon(
      createDerivedStringProperty( sceneryPhetStrings.keyboardHelpDialog.comboBox.moveThroughPatternStringProperty ),
      KeyboardHelpIconFactory.upDownArrowKeysRowIcon(), {
        labelInnerContent: createDerivedStringProperty( sceneryPhetStrings.a11y.keyboardHelpDialog.comboBox.moveThroughPatternDescriptionStringProperty )
      } );

    const chooseNew = KeyboardHelpSectionRow.labelWithIcon(
      createDerivedStringProperty( sceneryPhetStrings.keyboardHelpDialog.comboBox.chooseNewPatternStringProperty ),
      TextKeyNode.enter(), {
        labelInnerContent: createDerivedStringProperty( sceneryPhetStrings.a11y.keyboardHelpDialog.comboBox.chooseNewPatternDescriptionStringProperty )
      } );

    const closeWithoutChanging = KeyboardHelpSectionRow.labelWithIcon(
      sceneryPhetStrings.keyboardHelpDialog.comboBox.closeWithoutChangingStringProperty,
      TextKeyNode.esc(), {
        labelInnerContent: sceneryPhetStrings.a11y.keyboardHelpDialog.comboBox.closeWithoutChangingDescriptionStringProperty
      } );

    // order the rows of content
    super( options.headingString, [ popUpList, moveThrough, chooseNew, closeWithoutChanging ], options );
  }
}

sceneryPhet.register( 'ComboBoxKeyboardHelpSection', ComboBoxKeyboardHelpSection );
export default ComboBoxKeyboardHelpSection;