// Copyright 2017-2022, University of Colorado Boulder

/**
 * KeyboardHelpSection contains a section of text and icons for a KeyboardHelpDialog. Typically multiple KeyboardHelpSections
 * are assembled to describe the keyboard interactions for the sim. Takes a heading string for the section label and
 * an array of contents for rows of labels and icons.
 *
 * This type has many static functions for creating and laying out rows of content.
 * Default values for spacing and fonts are also available through statics if necessary.
 *
 * Help sections are aligned with two groups. Text labels are aligned in one VBox, icons are aligned in another. To
 * structure the accessible content, we chose to instrument a11y on the icons in the section. To label content
 * in your own KeyboardHelpSection, instrument the icons not the label Text so a11y content is placed correctly in the DOM.
 * KeyboardHelpSections are generally a list of items, so each icon has a  tagName of 'li' be default.
 *
 * @author Jesse Greenberg
 */

import merge from '../../../../phet-core/js/merge.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import { AlignBoxOptions, AlignGroup, HBox, Node, ReadingBlock, ReadingBlockOptions, RichText, RichTextOptions, Text, TextOptions, VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import { VoicingResponse } from '../../../../utterance-queue/js/ResponsePacket.js';
import PhetFont from '../../PhetFont.js';
import sceneryPhet from '../../sceneryPhet.js';
import sceneryPhetStrings from '../../sceneryPhetStrings.js';
import LetterKeyNode from '../LetterKeyNode.js';
import TextKeyNode from '../TextKeyNode.js';
import KeyboardHelpIconFactory from './KeyboardHelpIconFactory.js';

// TODO: https://github.com/phetsims/scenery-phet/issues/762
/* eslint-disable @typescript-eslint/no-explicit-any */

// constants
const keyboardHelpDialogGrabOrReleaseHeadingPatternString = sceneryPhetStrings.keyboardHelpDialog.grabOrReleaseHeadingPattern;
const keyboardHelpDialogGrabOrReleaseLabelPatternString = sceneryPhetStrings.keyboardHelpDialog.grabOrReleaseLabelPattern;
const keyboardHelpDialogOrString = sceneryPhetStrings.keyboardHelpDialog.or;
const grabOrReleaseDescriptionPatternString = sceneryPhetStrings.a11y.keyboardHelpDialog.grabOrReleaseDescriptionPattern;

// heading defaults
const DEFAULT_HEADING_CONTENT_SPACING = 13; // spacing between h
const DEFAULT_HEADING_FONT = new PhetFont( { size: 19, weight: 'bold' } );

const DEFAULT_LABEL_ICON_SPACING = 28; // spacing between Text labels and icons in a KeyboardHelpSectionRow
const DEFAULT_VERTICAL_ICON_SPACING = 13;

// text fonts and max widths
const LABEL_FONT = new PhetFont( 16 );
const OR_TEXT_MAX_WIDTH = 16;
const DEFAULT_LABEL_MAX_WIDTH = 235;
const DEFAULT_HEADING_MAX_WIDTH = 335;

// Options type for labelWithIcon, see that function
type LabelWithIconOptions = {

  // {string|null} to provide the PDOM description of this row
  labelInnerContent?: string | null;

  // {string} - Content for this icon that is read by the Voicing feature when in a KeyboardHelpSection. If null,
  // will default to the options.labelInnerContent.
  readingBlockContent?: VoicingResponse | null;

  // options passed to the RichText label
  labelOptions?: RichTextOptions;

  // options passed to the AlignBox surrounding the icon
  iconOptions?: StrictOmit<AlignBoxOptions, 'innerContent'>;
};

type SelfOptions = {

  // propagated to the Text for the section heading
  headingOptions?: TextOptions;

  // Used as maxWidth for each KeyboardHelpSectionRow.text
  textMaxWidth?: number;

  // propagated to VBox for layout
  vBoxOptions?: StrictOmit<VBoxOptions, 'tagName'>;

  // tag name for the entire content, usually content is a list of items
  a11yContentTagName?: string | null;
};
type ParentOptions = ReadingBlockOptions & VBoxOptions;
export type KeyboardHelpSectionOptions = SelfOptions & ParentOptions;

export default class KeyboardHelpSection extends ReadingBlock( VBox, 0 ) {

  // the translatable heading for this section
  private readonly headingString: string;

  // collection of icons in this section
  private readonly icons: Node[];

  private keyboardHelpSectionRows: KeyboardHelpSectionRow[];

  // used by methods to adjust spacing if necessary
  private readonly iconVBox: VBox;
  private readonly contentHBox: HBox;

  /**
   * @param headingString - the translatable heading for this section
   * @param content -  icons and labels are each placed in their own VBox, and these layout boxes are aligned
   *   horizontally. It is assumed that label and icon have identical bounds so that each row of content can be
   *   aligned by KeyboardHelpSection. Static functions in this file use AlignGroup to achieve this. For examples,
   *   see labelWithIcon() and labelWithIconList().
   * @param [providedOptions]
   */
  public constructor( headingString: string, content: KeyboardHelpSectionRow[], providedOptions?: KeyboardHelpSectionOptions ) {

    const options = optionize<KeyboardHelpSectionOptions, SelfOptions, ParentOptions>()( {

      // SelfOptions
      headingOptions: {
        font: DEFAULT_HEADING_FONT,
        maxWidth: DEFAULT_HEADING_MAX_WIDTH,

        // pdom
        tagName: 'h2',
        innerContent: headingString
      },
      textMaxWidth: DEFAULT_LABEL_MAX_WIDTH,
      vBoxOptions: {
        align: 'left',
        spacing: DEFAULT_VERTICAL_ICON_SPACING
      },
      a11yContentTagName: 'ul',

      // ParentOptions
      spacing: DEFAULT_HEADING_CONTENT_SPACING,
      align: 'left'
    }, providedOptions );

    // create the heading
    const headingText = new Text( headingString, options.headingOptions );

    // place icons in labels in unique layout boxes for alignment
    const icons = [];
    const labels = [];
    for ( let i = 0; i < content.length; i++ ) {
      const helpSectionRow = content[ i ];

      assert && assert( helpSectionRow.text.maxWidth === null, 'KeyboardHelpSection sets maxWidth for children' );
      helpSectionRow.text.maxWidth = options.textMaxWidth;

      icons.push( helpSectionRow.icon );
      labels.push( helpSectionRow.label );
    }

    // parent for all labels
    const labelVBox = new VBox( combineOptions<VBoxOptions>( {
      children: labels
    }, options.vBoxOptions ) );

    // parent for all icons
    const iconVBox = new VBox( combineOptions<VBoxOptions>( {
      children: icons,

      // pdom
      tagName: options.a11yContentTagName
    }, options.vBoxOptions ) );

    // labels and icons horizontally aligned
    const contentHBox = new HBox( {
      children: [ labelVBox, iconVBox ],
      spacing: DEFAULT_LABEL_ICON_SPACING
    } );

    // heading and content aligned in a VBox
    assert && assert( !options.children, 'KeyboardHelpSection sets children' );
    options.children = [ headingText, contentHBox ];

    super( options );

    this.headingString = headingString;
    this.icons = icons;
    this.iconVBox = iconVBox;
    this.contentHBox = contentHBox;
    this.keyboardHelpSectionRows = content;

    this.setReadingBlockNameResponse( this.generateReadingBlockNameResponse() );
  }

  /**
   * Assemble the content that is read for this KeyboardHelpSection as a ReadingBlock. When
   * Voicing is enabled, activating the section will read all the content to the user.
   *
   * NOTE: This probably doesn't hold up for i18n, but Voicing does not support translation and
   * that will have to be worked on another time.
   */
  private generateReadingBlockNameResponse(): string {

    // Include the section heading. Headings typically don't have punctuation, but don't use a period because
    // it may appear to the synth as an abbreviation and change the pronunciation.
    let readingBlockNameResponse = '';
    readingBlockNameResponse += `${this.headingString}, `;

    // Append the readingBlockNameResponse assigned to each row.
    this.keyboardHelpSectionRows.forEach( row => {
      if ( row.readingBlockContent ) {
        readingBlockNameResponse += `${row.readingBlockContent} `;
      }
    } );

    return readingBlockNameResponse;
  }

  /**
   * Horizontally align a label and an icon, with the label on the left and the icon on the right. AlignGroup is used
   * to give the label and icon identical dimensions for easy layout in KeyboardHelpSection.
   */
  public static labelWithIcon( labelString: string, icon: Node, providedOptions?: LabelWithIconOptions ): KeyboardHelpSectionRow {
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
    const iconBox = labelIconGroup.createBox( icon, options.iconOptions );

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
  // TODO https://github.com/phetsims/scenery-phet/issues/762 what is the type of providedOptions?
  public static labelWithIconList( labelString: string, icons: Node[], providedOptions?: any ): KeyboardHelpSectionRow {

    //TODO https://github.com/phetsims/scenery-phet/issues/762 these options are not propagated to KeyboardHelpSectionRow
    //TODO https://github.com/phetsims/scenery-phet/issues/762 should any of these fields be omitted from type of providedOptions?
    //TODO https://github.com/phetsims/scenery-phet/issues/762 convert to optionize
    // eslint-disable-next-line bad-typescript-text
    const options = merge( {

      // {string|null} content for the parallel DOM, read by a screen reader
      labelInnerContent: null,

      // voicing
      // {string} - Content for this icon that is read by the Voicing feature when in a KeyboardHelpSection. If null,
      // will default to options.labelInnerContent.
      readingBlockContent: null,

      iconsVBoxOptions: {} // options for the iconsVBox, extended below
    }, providedOptions );

    //TODO https://github.com/phetsims/scenery-phet/issues/762 'children' should be omitted from providedOptions type
    assert && assert( !options.children, 'labelWithIconList adds its own children' );
    //TODO https://github.com/phetsims/scenery-phet/issues/762 'innerContent' should be omitted from providedOptions.iconOptions type
    assert && assert( !options.iconsVBoxOptions.innerContent, 'should be specified as an argument' );

    //TODO https://github.com/phetsims/scenery-phet/issues/762 should any of these fields be omitted from the type of options.iconsVBoxOptions, or can the caller override all of them?
    options.iconsVBoxOptions = combineOptions<VBoxOptions>( {
      spacing: DEFAULT_VERTICAL_ICON_SPACING * 0.75, // less than the normal vertical icon spacing since it is a group
      align: 'left',
      tagName: 'li',
      innerContent: options.labelInnerContent
    }, options.iconsVBoxOptions );

    const labelText = new RichText( labelString, { font: LABEL_FONT } );

    // horizontally align the label with the first item in the list of icons, guarantees that the label and first
    // icon have identical heights
    const labelFirstIconGroup = new AlignGroup( { matchHorizontal: false } );
    labelFirstIconGroup.createBox( new Node( { children: [ icons[ 0 ] ] } ) ); // create the box to restrain bounds, but a reference isn't necessary
    const labelBox = labelFirstIconGroup.createBox( labelText );

    // for each of the icons (excluding the last one, add a vertically aligned 'or' text to the right
    const iconsWithOrText = [];
    for ( let i = 0; i < icons.length - 1; i++ ) {
      const orText = new Text( keyboardHelpDialogOrString, {
        font: LABEL_FONT,
        maxWidth: OR_TEXT_MAX_WIDTH
      } );

      // place orText with the icon in an HBox
      iconsWithOrText.push( new HBox( {
        children: [ new Node( { children: [ icons[ i ] ] } ), orText ],
        spacing: KeyboardHelpIconFactory.DEFAULT_ICON_SPACING
      } ) );
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
   * Creates a row with one or more keys, with keys separated by '+'.
   * @param keyStrings - each should be a letter key
   * @param labelString
   * @param [providedOptions]
   */
  // TODO https://github.com/phetsims/scenery-phet/issues/762 providedOptions should have the same type as used in createKeysRow
  public static createKeysRowFromStrings( keyStrings: string[], labelString: string, providedOptions?: any ): KeyboardHelpSectionRow {
    return KeyboardHelpSection.createKeysRow( keyStrings.map( key => new LetterKeyNode( key ) ), labelString, providedOptions );
  }

  /**
   * Creates a row with one or more keys, with keys separated by '+'.
   */
  // TODO https://github.com/phetsims/scenery-phet/issues/762 providedOptions should have the same type as used in labelWithIcon
  public static createKeysRow( keyIcons: Node[], labelString: string, providedOptions?: any ): KeyboardHelpSectionRow {
    assert && assert( keyIcons.length > 0, 'expected keys' );
    let keysNode = null;
    // TODO https://github.com/phetsims/scenery-phet/issues/762 should this loop exit when keyNode is found? I don't understand why it iterates over all keyIcons.
    for ( let i = 0; i < keyIcons.length; i++ ) {
      const keyNode = keyIcons[ i ];
      keysNode = keysNode ? KeyboardHelpIconFactory.iconPlusIcon( keysNode, keyNode ) : keyNode;
    }
    // @ts-ignore TODO https://github.com/phetsims/scenery-phet/issues/762 keyNode might be null, and there is no check to verify that it's non-null after the loop
    return KeyboardHelpSection.labelWithIcon( labelString, keysNode, providedOptions );
  }

  /**
   * Create an entry for the dialog that looks horizontally aligns a letter key with a 'J' key separated by a plus
   * sign, with a descriptive label. Something like:   * "J + S jumps close to sweater"
   * @param keyString - the letter name that will come after 'J', note this can be hard coded, no need for i18n.
   * @param labelString - visual label
   * @param [providedOptions]
   */
  // TODO https://github.com/phetsims/scenery-phet/issues/762 providedOptions should have the same type as used in createKeysRowFromStrings
  public static createJumpKeyRow( keyString: string, labelString: string, providedOptions?: any ): KeyboardHelpSectionRow {
    return KeyboardHelpSection.createKeysRowFromStrings( [ 'J', keyString ], labelString, providedOptions );
  }

  /**
   * Create a KeyboardHelpSectionRow that describes how to play and pause the sim with the "Alt" + "K" hotkey.
   */
  // TODO https://github.com/phetsims/scenery-phet/issues/762 providedOptions should have the same type as used in createGlobalHotkeyRow
  public static createPlayPauseKeyRow( labelString: string, providedOptions?: any ): KeyboardHelpSectionRow {
    return KeyboardHelpSection.createGlobalHotkeyRow( labelString, 'K', providedOptions );
  }

  /**
   * Create a KeyboardHelpSectionRow that describes how to step forward the sim with the "Alt" + "L" hotkeys.
   */
  // TODO https://github.com/phetsims/scenery-phet/issues/762 providedOptions should have the same type as used in createGlobalHotkeyRow
  public static createStepForwardKeyRow( labelString: string, providedOptions?: any ): KeyboardHelpSectionRow {
    return KeyboardHelpSection.createGlobalHotkeyRow( labelString, 'L', providedOptions );
  }

  /**
   * Create a KeyboardHelpSectionRow that describes how to use a global hotkey. Global hotkeys are triggered with "Alt" plus
   * some other key, to be provided.
   */
  // TODO https://github.com/phetsims/scenery-phet/issues/762 providedOptions should have the same type as used in createKeysRow
  public static createGlobalHotkeyRow( labelString: string, keyString: string, providedOptions?: any ): KeyboardHelpSectionRow {
    return KeyboardHelpSection.createKeysRow( [ TextKeyNode.alt(), new LetterKeyNode( keyString ) ], labelString, providedOptions );
  }

  /**
   * Vertically align icons for a number of different KeyboardHelpSections. Useful when two KeyboardHelpSection
   * sections are stacked vertically in a Dialog. Loops through sectionArray and finds the max x value of the left
   * edge of the icon VBox. Then increases spacing of all other content HBoxes accordingly.
   */
  public static alignHelpSectionIcons( sectionArray: KeyboardHelpSection[] ): void {

    // left edge of icons farthest to the right in the array of KeyboardHelpSection
    // @ts-ignore TODO https://github.com/phetsims/scenery-phet/issues/762 TS2532: Object is possibly 'undefined'.
    const maxLeftEdge = _.maxBy( sectionArray, section => section.iconVBox.left ).iconVBox.left;

    // adjust the spacing of all section HBoxes so that they align
    sectionArray.forEach( section => {
      section.contentHBox.spacing = section.contentHBox.spacing + maxLeftEdge - section.iconVBox.left;
    } );
  }

  /**
   * Convenience method to construct a KeyboardHelpSection for describing the grab button interaction
   * @param thingAsTitle - the item being grabbed, capitalized as a title
   * @param thingAsLowerCase - the item being grabbed, lower case as used in a sentence.
   * @param [providedOptions]
   */
  public static getGrabReleaseHelpSection( thingAsTitle: string, thingAsLowerCase: string,
                                           providedOptions?: KeyboardHelpSectionOptions ): KeyboardHelpSection {

    const options = combineOptions<KeyboardHelpSectionOptions>( {

      // just a paragraph for this section, no list
      a11yContentTagName: null  //TODO https://github.com/phetsims/scenery-phet/issues/762 should 'a11yContentTagName' be omitted from providedOptions, or can the caller override it?
    }, providedOptions );

    // the visible heading string
    const heading = StringUtils.fillIn( keyboardHelpDialogGrabOrReleaseHeadingPatternString, {
      thing: thingAsTitle
    } );

    // the visible label string
    const labelString = StringUtils.fillIn( keyboardHelpDialogGrabOrReleaseLabelPatternString, {
      thing: thingAsLowerCase
    } );

    // the string for the PDOM
    const descriptionString = StringUtils.fillIn( grabOrReleaseDescriptionPatternString, {
      thing: thingAsLowerCase
    } );

    const spaceKeyNode = TextKeyNode.space();
    const enterKeyNode = TextKeyNode.enter();
    const icons = KeyboardHelpIconFactory.iconOrIcon( spaceKeyNode, enterKeyNode );
    const labelWithContentRow = KeyboardHelpSection.labelWithIcon( labelString, icons, {
      labelInnerContent: descriptionString,
      iconOptions: {
        tagName: 'p' // it is the only item, so it is 'p' rather than 'li'
      }
    } );

    return new KeyboardHelpSection( heading, [ labelWithContentRow ], options );
  }
}

type KeyboardHelpSectionRowOptions = {

  // voicing - The content that is read with the Voicing feature when enabled. When clicked, the readingBlockContent
  // for every KeyboardHelpSectionRow in the KeyboardHelpSection is read.
  readingBlockContent?: VoicingResponse | null;
};

//TODO https://github.com/phetsims/scenery-phet/issues/762 I would move this to its own file, along with the static methods above that return KeyboardHelpSectionRow
/**
 * A row of KeyboardHelpSection, containing the label, icon, and text. Many of the static functions of KeyboardHelpSection
 * will return a KeyboardHelpSectionRow. The label and icon are often grouped in an AlignGroup for easy positioning
 * in KeyboardHelpSection. This cannot be done in KeyboardHelpSection directly because different labels and icons will
 * have varying layout. For instance, see labelWithIcon vs labelWithIconList.
 *
 * Includes a reference to the Text because KeyboardHelpSection will constrain the width of all text in its
 * KeyboardHelpSectionRows for i18n.
 */
class KeyboardHelpSectionRow {
  public readonly text: Text | RichText;
  public readonly label: Node;
  public readonly icon: Node;
  public readonly readingBlockContent: VoicingResponse | null;

  public constructor( text: Text | RichText, label: Node, icon: Node, providedOptions?: KeyboardHelpSectionRowOptions ) {
    const options = optionize<KeyboardHelpSectionRowOptions>()( {
      readingBlockContent: null
    }, providedOptions );

    this.text = text;
    this.label = label;
    this.icon = icon;
    this.readingBlockContent = options.readingBlockContent;
  }
}

sceneryPhet.register( 'KeyboardHelpSection', KeyboardHelpSection );