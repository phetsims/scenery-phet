// Copyright 2022-2026, University of Colorado Boulder

/**
 * A row of KeyboardHelpSection, containing the label, icon, and text. Many of the static functions of
 * KeyboardHelpSection will return a KeyboardHelpSectionRow. The label and icon are often grouped in an AlignGroup for
 * easy positioning in KeyboardHelpSection. This cannot be done in KeyboardHelpSection directly because different
 * labels and icons will have varying layout. For instance, see labelWithIcon vs labelWithIconList.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
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
import SceneryPhetFluent from '../../SceneryPhetFluent.js';
import HotkeyDescriptionBuilder from './HotkeyDescriptionBuilder.js';
import { HotkeySetVariant } from './HotkeySetDefinitions.js';
import KeyboardHelpIconFactory, { KeyAlternativesIcon } from './KeyboardHelpIconFactory.js';
import KeyboardHelpSection from './KeyboardHelpSection.js';

// text fonts and max widths
const LABEL_FONT = new PhetFont( 16 );
const OR_TEXT_MAX_WIDTH = 16;

// Options type for labelWithIconList, see that function.
type LabelWithIconListOptions = {

  // content for the parallel DOM representing the entire row, read by a screen reader
  accessibleRowDescriptionProperty?: TReadOnlyProperty<string> | null;

  // options passed to the RichText label - maxWidth is set by the KeyboardHelpSection for all rows at once
  labelOptions?: StrictOmit<RichTextOptions, 'maxWidth'>;

  // voicing
  // Content for this icon that is read by the Voicing feature when in a KeyboardHelpSection. If null,
  // will default to options.accessibleRowDescriptionProperty.
  readingBlockContent?: VoicingResponse | null;

  // Options for the VBox that manages layout for all icons in the list. Options omitted are set by the function.
  iconsVBoxOptions?: StrictOmit<VBoxOptions, 'innerContent' | 'spacing' | 'align' | 'tagName'>;
};

// Options type for labelWithIcon, see that function
export type LabelWithIconOptions = {

  // The description content describing this row. It should describe the label string and icons together in a
  // single descriptive sentence. Something like:
  // "Move object with Arrow keys."
  accessibleRowDescriptionProperty?: TReadOnlyProperty<string> | null;

  // {string} - Content for this icon that is read by the Voicing feature when in a KeyboardHelpSection. If null,
  // will default to the options.accessibleRowDescriptionProperty.
  readingBlockContent?: VoicingResponse | null;

  // options passed to the RichText label - maxWidth is set by the KeyboardHelpSection for all rows at once
  labelOptions?: StrictOmit<RichTextOptions, 'maxWidth'>;

  // options passed to the AlignBox surrounding the icon
  iconOptions?: StrictOmit<AlignBoxOptions, 'innerContent'>;
};

type FromHotkeyDataOptions = {

  // A custom icon for this row, if you don't want the one from the HotkeyData.
  icon?: Node | null;

  // The visual label for this row, if you don't want the one from the HotkeyData.
  labelStringProperty?: TReadOnlyProperty<string> | null;

  // The accessible content for this row, if you are not using the default from HotkeyData. You should almost
  // never need to use this because fromHotkeyData should generate this for you. This should be a description
  // that describes the keys used and the function. For example:
  // "Move object with Arrow keys."
  accessibleRowDescriptionProperty?: TReadOnlyProperty<string> | null;

  // Options for the labelWithIcon produced by this function
  labelWithIconOptions?: StrictOmit<LabelWithIconOptions, 'accessibleRowDescriptionProperty'>;

  // Optional variant identifier for alternate hotkey set definitions and layout. Some hotkey sets have variants
  // that change the appearance and description of the hotkeys. For example, the 'paired' variant for arrow keys.
  // See HotkeySetDefinitions for more information.
  hotkeySetVariant?: HotkeySetVariant;
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
      accessibleRowDescriptionProperty: null,
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

    iconBox.innerContent = options.accessibleRowDescriptionProperty;

    return new KeyboardHelpSectionRow( labelText, labelBox, iconBox, {
      readingBlockContent: options.readingBlockContent || options.accessibleRowDescriptionProperty
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
      accessibleRowDescriptionProperty: null,
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
      innerContent: options.accessibleRowDescriptionProperty
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
      const orText = new Text( SceneryPhetFluent.keyboardHelpDialog.orStringProperty, {
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
      readingBlockContent: options.readingBlockContent || options.accessibleRowDescriptionProperty
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
      accessibleRowDescriptionProperty: hotkeyData.accessibleKeyboardHelpDialogDescriptionStringProperty,
      labelWithIconOptions: {},
      hotkeySetVariant: 'default'
    }, providedOptions );

    const visualLabelStringProperty = options.labelStringProperty!;
    affirm( visualLabelStringProperty, 'A visual labelStringProperty must be defined.' );

    // Only build the icon data if one wasn't provided via options.
    const iconData = options.icon ? null :
                     KeyboardHelpIconFactory.fromHotkeyDataDetailed( hotkeyData, options.hotkeySetVariant );
    const icon = options.icon || KeyboardHelpIconFactory.composeHotkeyIcon( iconData! );

    // Determine the PDOM content. Use the provided one when available, otherwise make sure that markup is removed
    // from the visual label and build the description from it.
    const accessibleContentProperty = options.accessibleRowDescriptionProperty ||
                                      HotkeyDescriptionBuilder.createDescriptionProperty(
                                        RichText.getAccessibleStringProperty( visualLabelStringProperty ),
                                        hotkeyData.keyDescriptorsProperty,
                                        options.hotkeySetVariant
                                      );

    // If the icon data indicates a stacked layout (modifierPartitionLayout), align the label with the first icon in
    // the stack by using labelWithIconList. Stacking only makes sense when a single modifier group fans out into
    // multiple key partitions (for example Shift + [A/D] and Shift + [arrowLeft/arrowRight]), so we only switch
    // to the stacked label layout when there is exactly one group and it prefers stacking.
    let stackedGroup: KeyAlternativesIcon | null = null;
    if ( iconData && iconData.length === 1 ) {
      const candidateGroup = iconData[ 0 ];
      if ( candidateGroup.layout === 'stacked' && candidateGroup.alternatives.length > 0 ) {
        stackedGroup = candidateGroup;
      }
    }

    let row: KeyboardHelpSectionRow;
    if ( stackedGroup ) {
      row = KeyboardHelpSectionRow.labelWithIconList(
        visualLabelStringProperty,
        stackedGroup.alternatives,
        {
          accessibleRowDescriptionProperty: accessibleContentProperty,
          readingBlockContent: options.labelWithIconOptions.readingBlockContent || null,
          labelOptions: options.labelWithIconOptions.labelOptions
        }
      );
    }
    else {
      row = KeyboardHelpSectionRow.labelWithIcon(
        visualLabelStringProperty,
        icon,
        combineOptions<LabelWithIconOptions>( {
          accessibleRowDescriptionProperty: accessibleContentProperty
        }, options.labelWithIconOptions )
      );
    }

    return row;
  }
}

sceneryPhet.register( 'KeyboardHelpSectionRow', KeyboardHelpSectionRow );
export default KeyboardHelpSectionRow;