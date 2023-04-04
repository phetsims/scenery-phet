// Copyright 2022-2023, University of Colorado Boulder

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
import { AlignBoxOptions, AlignGroup, HBox, Node, PDOMValueType, RichText, RichTextOptions, Text, VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import Disposable from '../../../../axon/js/Disposable.js';
import { VoicingResponse } from '../../../../utterance-queue/js/ResponsePacket.js';
import PhetFont from '../../PhetFont.js';
import sceneryPhet from '../../sceneryPhet.js';
import SceneryPhetStrings from '../../SceneryPhetStrings.js';
import LetterKeyNode from '../LetterKeyNode.js';
import TextKeyNode from '../TextKeyNode.js';
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
type LabelWithIconOptions = {

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

type SelfOptions = {

  // voicing - The content that is read with the Voicing feature when enabled. When clicked, the readingBlockContent
  // for every KeyboardHelpSectionRow in the KeyboardHelpSection is read.
  readingBlockContent?: VoicingResponse | null;
};
type KeyboardHelpSectionRowOptions = SelfOptions;

class KeyboardHelpSectionRow extends Disposable {

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

    super();

    this.text = text;
    this.label = label;
    this.icon = icon;
    this.readingBlockContent = options.readingBlockContent;
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

    const keyboardHelpSectionRow = new KeyboardHelpSectionRow( labelText, labelBox, iconBox, {
      readingBlockContent: options.readingBlockContent || options.labelInnerContent
    } );

    keyboardHelpSectionRow.disposeEmitter.addListener( () => {
      labelIconGroup.dispose();
      labelText.dispose();
    } );
    return keyboardHelpSectionRow;
  }

  /**
   * Creates a row with one or more keys, with keys separated by '+'.
   * @param keyStrings - each should be a letter key
   * @param labelString
   * @param [providedOptions]
   */
  public static createKeysRowFromStrings( keyStrings: string[], labelString: string | TReadOnlyProperty<string>,
                                          providedOptions?: LabelWithIconOptions ): KeyboardHelpSectionRow {
    return KeyboardHelpSectionRow.createKeysRow( keyStrings.map( key => new LetterKeyNode( key ) ), labelString, providedOptions );
  }

  /**
   * Creates a row with one or more keys, with keys separated by '+'.
   */
  public static createKeysRow( keyIcons: Node[], labelString: string | TReadOnlyProperty<string>,
                               providedOptions?: LabelWithIconOptions ): KeyboardHelpSectionRow {
    assert && assert( keyIcons.length > 0, 'expected keys' );
    let keysNode = null;
    for ( let i = 0; i < keyIcons.length; i++ ) {
      const keyNode = keyIcons[ i ];

      // Continue to "add" more icons to the end of the keysNode with iconPlusIcon until we go through all keyIcons.
      // If there is only one keyIcon it will just be returned without any '+' icons.
      keysNode = keysNode ? KeyboardHelpIconFactory.iconPlusIcon( keysNode, keyNode ) : keyNode;
    }

    assert && assert( keysNode, 'keysNode must be defined since there were more than zero keyIcons.' );
    return KeyboardHelpSectionRow.labelWithIcon( labelString, keysNode!, providedOptions );
  }

  /**
   * Create an entry for the dialog that looks horizontally aligns a letter key with a 'J' key separated by a plus
   * sign, with a descriptive label. Something like:   * "J + S jumps close to sweater"
   * @param keyString - the letter name that will come after 'J', note this can be hard coded, no need for i18n.
   * @param labelString - visual label
   * @param [providedOptions]
   */
  public static createJumpKeyRow( keyString: string, labelString: string | TReadOnlyProperty<string>,
                                  providedOptions?: LabelWithIconOptions ): KeyboardHelpSectionRow {
    return KeyboardHelpSectionRow.createKeysRowFromStrings( [ 'J', keyString ], labelString, providedOptions );
  }

  /**
   * Create a KeyboardHelpSectionRow that describes how to play and pause the sim with the "Alt" + "K" hotkey.
   */
  public static createPlayPauseKeyRow( labelString: string | TReadOnlyProperty<string>,
                                       providedOptions?: LabelWithIconOptions ): KeyboardHelpSectionRow {
    return KeyboardHelpSectionRow.createGlobalHotkeyRow( labelString, SceneryPhetStrings.key.kStringProperty, providedOptions );
  }

  /**
   * Create a KeyboardHelpSectionRow that describes how to step forward the sim with the "Alt" + "L" hotkeys.
   */
  public static createStepForwardKeyRow( labelString: string | TReadOnlyProperty<string>,
                                         providedOptions?: LabelWithIconOptions ): KeyboardHelpSectionRow {
    return KeyboardHelpSectionRow.createGlobalHotkeyRow( labelString, SceneryPhetStrings.key.lStringProperty, providedOptions );
  }

  /**
   * Create a KeyboardHelpSectionRow that describes how to use a global hotkey. Global hotkeys are triggered with "Alt" plus
   * some other key, to be provided.
   */
  public static createGlobalHotkeyRow( labelString: string | TReadOnlyProperty<string>, keyString: string | TReadOnlyProperty<string>,
                                       providedOptions?: LabelWithIconOptions ): KeyboardHelpSectionRow {
    return KeyboardHelpSectionRow.createKeysRow( [ TextKeyNode.altOrOption(), new LetterKeyNode( keyString ) ], labelString, providedOptions );
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

    const toDispose: Node[] = [];

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
      toDispose.push( orText, hBox );

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

    const keyboardHelpSectionRow = new KeyboardHelpSectionRow( labelText, labelWithHeightBox, iconsBox, {
      readingBlockContent: options.readingBlockContent || options.labelInnerContent
    } );

    keyboardHelpSectionRow.disposeEmitter.addListener( () => {
      labelFirstIconGroup.dispose();
      labelText.dispose();
      labelIconListGroup.dispose();
      toDispose.forEach( disposable => disposable.dispose() );
    } );
    return keyboardHelpSectionRow;
  }
}

sceneryPhet.register( 'KeyboardHelpSectionRow', KeyboardHelpSectionRow );
export default KeyboardHelpSectionRow;
