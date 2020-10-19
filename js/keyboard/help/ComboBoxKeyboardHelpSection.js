// Copyright 2020, University of Colorado Boulder

/**
 * Help section for explaining how to use a keyboard to change a combo box.
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import merge from '../../../../phet-core/js/merge.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import sceneryPhet from '../../sceneryPhet.js';
import sceneryPhetStrings from '../../sceneryPhetStrings.js';
import TextKeyNode from '../TextKeyNode.js';
import KeyboardHelpIconFactory from './KeyboardHelpIconFactory.js';
import KeyboardHelpSection from './KeyboardHelpSection.js';

class ComboBoxKeyboardHelpSection extends KeyboardHelpSection {

  /**
   * @param {string} thingAsTitle - the item being changed by the combo box, capitalized as a title
   * @param {Object} [options]
   */
  constructor( thingAsTitle, options ) {
    assert && assert( typeof thingAsTitle === 'string' );

    options = merge( {

      headingString: StringUtils.fillIn( sceneryPhetStrings.keyboardHelpDialog.comboBox.chooseAThingPattern, {
        thingTitle: thingAsTitle
      } ),

      // the item being changed by the combo box, lower case as used in a sentence.
      thingAsLowerCaseSingular: sceneryPhetStrings.keyboardHelpDialog.comboBox.option,

      // plural version of thingAsLowerCaseSingular
      thingAsLowerCasePlural: sceneryPhetStrings.keyboardHelpDialog.comboBox.options,

      a11yContentTagName: 'ol', // ordered list
      vBoxOptions: {
        spacing: 8 // A bit tighter so that it looks like one set of instructions
      }
    }, options );

    // convencience funtion for all the filling in done below
    const fillIn = stringPattern => StringUtils.fillIn( stringPattern, {
      thingPlural: options.thingAsLowerCasePlural,
      thingSingular: options.thingAsLowerCaseSingular
    } );

    const popUpList = KeyboardHelpSection.labelWithIcon( fillIn( sceneryPhetStrings.keyboardHelpDialog.comboBox.popUpListPattern ),
      KeyboardHelpIconFactory.iconOrIcon( TextKeyNode.space(), TextKeyNode.enter() ),
      fillIn( sceneryPhetStrings.a11y.keyboardHelpDialog.comboBox.popUpListPatternDescription ) );

    const moveThrough = KeyboardHelpSection.labelWithIcon( fillIn( sceneryPhetStrings.keyboardHelpDialog.comboBox.moveThroughPattern ),
      KeyboardHelpIconFactory.upDownArrowKeysRowIcon(),
      fillIn( sceneryPhetStrings.a11y.keyboardHelpDialog.comboBox.moveThroughPatternDescription ) );

    const chooseNew = KeyboardHelpSection.labelWithIcon( fillIn( sceneryPhetStrings.keyboardHelpDialog.comboBox.chooseNewPattern ),
      TextKeyNode.enter(),
      fillIn( sceneryPhetStrings.a11y.keyboardHelpDialog.comboBox.chooseNewPatternDescription ) );

    const closeWithoutChanging = KeyboardHelpSection.labelWithIcon( sceneryPhetStrings.keyboardHelpDialog.comboBox.closeWithoutChanging,
      TextKeyNode.esc(),
      sceneryPhetStrings.a11y.keyboardHelpDialog.comboBox.closeWithoutChangingDescription );

    // order the rows of content
    super( options.headingString, [ popUpList, moveThrough, chooseNew, closeWithoutChanging ], options );
  }
}

sceneryPhet.register( 'ComboBoxKeyboardHelpSection', ComboBoxKeyboardHelpSection );
export default ComboBoxKeyboardHelpSection;