// Copyright 2022-2025, University of Colorado Boulder

/**
 * A row of KeyboardHelpSection, containing the label, icon, and text. Many of the static functions of
 * KeyboardHelpSection will return a KeyboardHelpSectionRow. The label and icon are often grouped in an AlignGroup for
 * easy positioning in KeyboardHelpSection. This cannot be done in KeyboardHelpSection directly because different
 * labels and icons will have varying layout. For instance, see labelWithIcon vs labelWithIconList.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import { PDOMValueType } from '../../../../scenery/js/accessibility/pdom/ParallelDOM.js';
import HotkeyData from '../../../../scenery/js/input/HotkeyData.js';
import AlignGroup from '../../../../scenery/js/layout/constraints/AlignGroup.js';
import { AlignBoxOptions } from '../../../../scenery/js/layout/nodes/AlignBox.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import VBox, { VBoxOptions } from '../../../../scenery/js/layout/nodes/VBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import RichText, { RichTextOptions } from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import { VoicingResponse } from '../../../../utterance-queue/js/ResponsePacket.js';
import PhetFont from '../../PhetFont.js';
import sceneryPhet from '../../sceneryPhet.js';
import SceneryPhetStrings from '../../SceneryPhetStrings.js';
import KeyboardHelpIconFactory from './KeyboardHelpIconFactory.js';
import KeyboardHelpSection from './KeyboardHelpSection.js';

// text fonts and max widths
const LABEL_FONT = new PhetFont( 16 );
const OR_TEXT_MAX_WIDTH = 16;

// Options type for labelWithIconList, see that function.
type LabelWithIconListOptions = {

  // content for the parallel DOM representing the entire row, read by a screen reader
  labelInnerContent?: PDOMValueType | null;

  // options passed to the RichText label
  labelOptions?: RichTextOptions;

  // voicing
  // Content for this icon that is read by the Voicing feature when in a KeyboardHelpSection. If null,
  // will default to options.labelInnerContent.
  readingBlockContent?: VoicingResponse | null;

  // Options for the VBox that manages layout for all icons in the list. Options omitted are set by the function.
  iconsVBoxOptions?: StrictOmit<VBoxOptions, 'innerContent' | 'spacing' | 'align' | 'tagName'>;
};

// Options type for labelWithIcon, see that function
export type LabelWithIconOptions = {

  // {string|null} to provide the PDOM description of this row
  labelInnerContent?: string | TReadOnlyProperty<string> | null;

  // {string} - Content for this icon that is read by the Voicing feature when in a KeyboardHelpSection. If null,
  // will default to the options.labelInnerContent.
  readingBlockContent?: VoicingResponse | null;

  // options passed to the RichText label
  labelOptions?: RichTextOptions;

  // options passed to the AlignBox surrounding the icon
  iconOptions?: StrictOmit<AlignBoxOptions, 'innerContent'>;
};

type FromHotkeyDataOptions = {

  // A custom icon for this row, if you don't want the one from the HotkeyData.
  icon?: Node | null;

  // The visual label for this row, if you don't want the one from the HotkeyData.
  labelStringProperty?: TReadOnlyProperty<string> | null;

  // The label used for the PDOM (screen readers) for this row, if you don't want the one from the HotkeyData.
  pdomLabelStringProperty?: TReadOnlyProperty<string> | string | null;

  // Options for the labelWithIcon produced by this function
  labelWithIconOptions?: StrictOmit<LabelWithIconOptions, 'labelInnerContent'>;
};

type SelfOptions = {

  // voicing - The content that is read with the Voicing feature when enabled. When clicked, the readingBlockContent
  // for every KeyboardHelpSectionRow in the KeyboardHelpSection is read.
  readingBlockContent?: VoicingResponse | null;
};
type KeyboardHelpSectionRowOptions = SelfOptions;

class KeyboardHelpSectionRow {

  // Includes a reference to the Text because KeyboardHelpSection will constrain the width of all text in its
  // KeyboardHelpSectionRows for i18n.
  public readonly text: Text | RichText;

  // A layout Node containing the readable Text describing this row.
  public readonly label: Node;

  // An icon Node graphically showing the keyboard keys for this row.
  public readonly icon: Node;

  // voicing - When Voicing is enabled, this is the content for this row that will be spoken with speech synthesis
  // when the row is activated with a click.
  public readonly readingBlockContent: VoicingResponse | null;

  // Reusable font style and size for the KeyboardHelpDialog labels.
  public static readonly LABEL_FONT = LABEL_FONT;

  public constructor( text: Text | RichText, label: Node, icon: Node, providedOptions?: KeyboardHelpSectionRowOptions ) {
    const options = optionize<KeyboardHelpSectionRowOptions, SelfOptions>()( {
      readingBlockContent: null
    }, providedOptions );

    this.text = text;
    this.label = label;
    this.icon = icon;
    this.readingBlockContent = options.readingBlockContent;
  }

  /**
   * Sets visibility of the label, icon, and text so that it can be hidden if necessary. If using
   * KeyboardHelpSection, this will also correctly layout the content because of scenery dynamic layout.
   */
  public setContentsVisible( visible: boolean ): void {
    this.text.visible = visible;
    this.label.visible = visible;
    this.icon.visible = visible;
  }

  /**
   * Horizontally align a label and an icon, with the label on the left and the icon on the right. AlignGroup is used
   * to give the label and icon identical dimensions for easy layout in KeyboardHelpSection.
   */
  public static labelWithIcon( labelString: string | TReadOnlyProperty<string>, icon: Node,
                               providedOptions?: LabelWithIconOptions ): KeyboardHelpSectionRow {
    const options = optionize<LabelWithIconOptions>()( {
      labelInnerContent: null,
      readingBlockContent: null,

      labelOptions: {
        font: LABEL_FONT
      },

      iconOptions: {
        tagName: 'li'
      }
    }, providedOptions );

    const labelText = new RichText( labelString, options.labelOptions );

    // make the label and icon the same height so that they will align when we assemble help section group
    const labelIconGroup = new AlignGroup( { matchHorizontal: false } );
    const labelBox = labelIconGroup.createBox( labelText );
    const iconBox = labelIconGroup.createBox( new Node( { children: [ icon ] } ), options.iconOptions );

    iconBox.innerContent = options.labelInnerContent;

    return new KeyboardHelpSectionRow( labelText, labelBox, iconBox, {
      readingBlockContent: options.readingBlockContent || options.labelInnerContent
    } );
  }

  /**
   * Create a label with a list of icons. The icons will be vertically aligned, each separated by 'or' text. The
   * label will be vertically centered with the first item in the list of icons. To vertically align the label
   * with the first icon, AlignGroup is used. Finally, an AlignGroup is used to make the label
   * content match height with the entire icon list. When assembled, the label with icon list will look like:
   *
   * This is the label: Icon1 or
   *                    Icon2 or
   *                    Icon3
   */
  public static labelWithIconList( labelString: string | TReadOnlyProperty<string>, icons: Node[],
                                   providedOptions?: LabelWithIconListOptions ): KeyboardHelpSectionRow {

    const options = optionize<LabelWithIconListOptions>()( {
      labelInnerContent: null,
      readingBlockContent: null,
      iconsVBoxOptions: {},
      labelOptions: {
        font: LABEL_FONT
      }
    }, providedOptions );

    options.iconsVBoxOptions = combineOptions<VBoxOptions>( {
      spacing: KeyboardHelpSection.DEFAULT_VERTICAL_ICON_SPACING * 0.75, // less than the normal vertical icon spacing since it is a group
      align: 'left',

      // pdom - each icon will be presented as a list item under the parent 'ul' of the KeyboardHelpSectionRow.
      tagName: 'li',
      innerContent: options.labelInnerContent
    }, options.iconsVBoxOptions );

    const labelText = new RichText( labelString, options.labelOptions );

    // horizontally align the label with the first item in the list of icons, guarantees that the label and first
    // icon have identical heights
    const labelFirstIconGroup = new AlignGroup( { matchHorizontal: false } );
    labelFirstIconGroup.createBox( new Node( { children: [ icons[ 0 ] ] } ) ); // create the box to restrain bounds, but a reference isn't necessary
    const labelBox = labelFirstIconGroup.createBox( labelText );

    const iconsWithOrText = [];

    // for each of the icons (excluding the last one, add a vertically aligned 'or' text to the right
    for ( let i = 0; i < icons.length - 1; i++ ) {
      const orText = new Text( SceneryPhetStrings.keyboardHelpDialog.orStringProperty, {
        font: LABEL_FONT,
        maxWidth: OR_TEXT_MAX_WIDTH
      } );

      // place orText with the icon in an HBox
      const hBox = new HBox( {
        children: [ new Node( { children: [ icons[ i ] ] } ), orText ],
        spacing: KeyboardHelpIconFactory.DEFAULT_ICON_SPACING
      } );
      iconsWithOrText.push( hBox );
    }
    iconsWithOrText.push( icons[ icons.length - 1 ] );

    // place icons in a VBox, passing through optional spacing and a11y representation
    const iconsVBox = new VBox( combineOptions<VBoxOptions>( {
      children: iconsWithOrText
    }, options.iconsVBoxOptions ) );

    // make the label the same height as the icon list by aligning them in a box that matches height
    const groupOptions: AlignBoxOptions = { yAlign: 'top' };
    const labelIconListGroup = new AlignGroup( { matchHorizontal: false } );
    const iconsBox = labelIconListGroup.createBox( iconsVBox, groupOptions ); // create the box to match height, but reference not necessary
    const labelWithHeightBox = labelIconListGroup.createBox( labelBox, groupOptions );

    return new KeyboardHelpSectionRow( labelText, labelWithHeightBox, iconsBox, {
      readingBlockContent: options.readingBlockContent || options.labelInnerContent
    } );
  }

  /**
   * Create a row for the keyboard help dialog from a HotkeyData object. Optionally override the icons and labels if
   * you want to customize the row so it is different from the actual key data.
   */
  public static fromHotkeyData( hotkeyData: HotkeyData, providedOptions?: FromHotkeyDataOptions ): KeyboardHelpSectionRow {
    const options = optionize<FromHotkeyDataOptions>()( {
      icon: null,
      labelStringProperty: hotkeyData.keyboardHelpDialogLabelStringProperty,
      pdomLabelStringProperty: hotkeyData.keyboardHelpDialogPDOMLabelStringProperty,
      labelWithIconOptions: {}
    }, providedOptions );

    // fromHotkeyData is not used in options so that it is only called if necessary
    const icon = options.icon || KeyboardHelpIconFactory.fromHotkeyData( hotkeyData );

    assert && assert( options.labelStringProperty, 'labelStringProperty must be defined' );
    return KeyboardHelpSectionRow.labelWithIcon(
      options.labelStringProperty!,
      icon,
      combineOptions<LabelWithIconOptions>( {
        labelInnerContent: options.pdomLabelStringProperty
      }, options.labelWithIconOptions )
    );
  }
}

sceneryPhet.register( 'KeyboardHelpSectionRow', KeyboardHelpSectionRow );
export default KeyboardHelpSectionRow;