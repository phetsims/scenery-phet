// Copyright 2022-2025, University of Colorado Boulder

/**
 * Help section for explaining how to use a keyboard to interact with the grab/release interaction.
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import sceneryPhet from '../../sceneryPhet.js';
import SceneryPhetStrings from '../../SceneryPhetStrings.js';
import TextKeyNode from '../TextKeyNode.js';
import KeyboardHelpIconFactory from './KeyboardHelpIconFactory.js';
import KeyboardHelpSection, { KeyboardHelpSectionOptions } from './KeyboardHelpSection.js';
import KeyboardHelpSectionRow from './KeyboardHelpSectionRow.js';

type GrabReleaseKeyboardHelpSectionOptions = StrictOmit<KeyboardHelpSectionOptions, 'a11yContentTagName'>;

export default class GrabReleaseKeyboardHelpSection extends KeyboardHelpSection {

  /**
   * @param thingAsTitle - the item being grabbed, capitalized as a title
   * @param thingAsLowerCase - the item being grabbed, lower case as used in a sentence.
   * @param [providedOptions]
   */
  public constructor( thingAsTitle: TReadOnlyProperty<string>, thingAsLowerCase: TReadOnlyProperty<string>,
                      providedOptions?: GrabReleaseKeyboardHelpSectionOptions ) {

    const options = combineOptions<KeyboardHelpSectionOptions>( {

      // There is only a single paragraph for this section, no list needed in the PDOM
      a11yContentTagName: null
    }, providedOptions );

    // the visible heading string
    const headingStringProperty = new PatternStringProperty( SceneryPhetStrings.keyboardHelpDialog.grabOrReleaseHeadingPatternStringProperty, {
      thing: thingAsTitle
    }, { tandem: Tandem.OPT_OUT } );

    // the visible label string
    const labelStringProperty = new PatternStringProperty( SceneryPhetStrings.keyboardHelpDialog.grabOrReleaseLabelPatternStringProperty, {
      thing: thingAsLowerCase
    }, { tandem: Tandem.OPT_OUT } );

    // the string for the PDOM
    const descriptionStringProperty = new PatternStringProperty( SceneryPhetStrings.a11y.keyboardHelpDialog.grabOrReleaseDescriptionPatternStringProperty, {
      thing: thingAsLowerCase
    }, { tandem: Tandem.OPT_OUT } );

    const spaceKeyNode = TextKeyNode.space();
    const enterKeyNode = TextKeyNode.enter();
    const icons = KeyboardHelpIconFactory.iconOrIcon( spaceKeyNode, enterKeyNode );
    const labelWithContentRow = KeyboardHelpSectionRow.labelWithIcon( labelStringProperty, icons, {
      labelInnerContent: descriptionStringProperty,
      iconOptions: {
        tagName: 'p' // it is the only item, so it is 'p' rather than 'li'
      }
    } );

    super( headingStringProperty, [ labelWithContentRow ], options );
  }
}

sceneryPhet.register( 'GrabReleaseKeyboardHelpSection', GrabReleaseKeyboardHelpSection );