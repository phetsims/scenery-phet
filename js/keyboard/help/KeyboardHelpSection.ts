// Copyright 2017-2023, University of Colorado Boulder

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

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import StringProperty from '../../../../axon/js/StringProperty.js';
import TReadOnlyProperty, { isTReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import { HBox, Node, ReadingBlock, ReadingBlockOptions, Text, TextOptions, VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import ResponsePacket from '../../../../utterance-queue/js/ResponsePacket.js';
import PhetFont from '../../PhetFont.js';
import sceneryPhet from '../../sceneryPhet.js';
import KeyboardHelpSectionRow from './KeyboardHelpSectionRow.js';

// heading defaults
const DEFAULT_HEADING_CONTENT_SPACING = 13; // spacing between h
const DEFAULT_HEADING_FONT = new PhetFont( { size: 19, weight: 'bold' } );

const DEFAULT_LABEL_ICON_SPACING = 28; // spacing between Text labels and icons in a KeyboardHelpSectionRow
const DEFAULT_VERTICAL_ICON_SPACING = 13;

// text fonts and max widths
const DEFAULT_LABEL_MAX_WIDTH = 235;
const DEFAULT_HEADING_MAX_WIDTH = 335;

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

export default class KeyboardHelpSection extends ReadingBlock( VBox ) {

  // the translatable heading for this section
  private readonly headingStringProperty: TReadOnlyProperty<string>;

  // collection of icons in this section
  private readonly icons: Node[];

  private keyboardHelpSectionRows: KeyboardHelpSectionRow[];

  // used by methods to adjust spacing if necessary
  private readonly iconVBox: VBox;
  private readonly contentHBox: HBox;

  private readonly disposeKeyboardHelpSection: () => void;

  public static readonly DEFAULT_VERTICAL_ICON_SPACING = DEFAULT_VERTICAL_ICON_SPACING;

  /**
   * @param headingString - the translatable heading for this section
   * @param content -  icons and labels are each placed in their own VBox, and these layout boxes are aligned
   *   horizontally. It is assumed that label and icon have identical bounds so that each row of content can be
   *   aligned by KeyboardHelpSection. Static functions in this file use AlignGroup to achieve this. For examples,
   *   see labelWithIcon() and labelWithIconList().
   * @param [providedOptions]
   */
  public constructor( headingString: string | TReadOnlyProperty<string>, content: KeyboardHelpSectionRow[],
                      providedOptions?: KeyboardHelpSectionOptions ) {

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

    this.headingStringProperty = ( typeof headingString === 'string' ) ? new StringProperty( headingString ) : headingString;
    this.icons = icons;
    this.iconVBox = iconVBox;
    this.contentHBox = contentHBox;
    this.keyboardHelpSectionRows = content;

    const readingBlockResponseProperty = this.createReadingBlockResponseProperty();
    this.setReadingBlockNameResponse( readingBlockResponseProperty );

    this.disposeKeyboardHelpSection = () => {
      readingBlockResponseProperty.dispose();
      headingText.dispose();
      this.keyboardHelpSectionRows = []; // defensive in case one row has a memory leak
    };
  }

  public override dispose(): void {
    this.disposeKeyboardHelpSection();
    super.dispose();
  }

  /**
   * Assemble the content that is read for this KeyboardHelpSection as a ReadingBlock. When
   * Voicing is enabled, activating the section will read all the content to the user.
   *
   * NOTE: Though this supports dynamic string Properties, this probably doesn't hold up for i18n. That said Voicing
   * does not support translation and that will have to be worked on another time.
   */
  private createReadingBlockResponseProperty(): TReadOnlyProperty<string> {

    const dependencies: TReadOnlyProperty<unknown>[] = [ this.headingStringProperty ];
    for ( let i = 0; i < this.keyboardHelpSectionRows.length; i++ ) {
      const keyboardHelpSectionRow = this.keyboardHelpSectionRows[ i ];

      if ( isTReadOnlyProperty( keyboardHelpSectionRow.readingBlockContent ) ) {
        dependencies.push( keyboardHelpSectionRow.readingBlockContent );
      }
    }

    return DerivedProperty.deriveAny( dependencies, () => {

      let readingBlockNameResponse = '';

      // Include the section heading. Headings typically don't have punctuation, but don't use a period because
      // it may appear to the synth as an abbreviation and change the pronunciation.
      readingBlockNameResponse += `${this.headingStringProperty.value}, `;

      // Append the readingBlockNameResponse assigned to each row.
      this.keyboardHelpSectionRows.forEach( row => {
        if ( row.readingBlockContent ) {
          readingBlockNameResponse += `${ResponsePacket.getResponseText( row.readingBlockContent )} `;
        }
      } );
      return readingBlockNameResponse;
    } );
  }

  /**
   * Vertically align icons for a number of different KeyboardHelpSections. Useful when two KeyboardHelpSection
   * sections are stacked vertically in a Dialog. Loops through sectionArray and finds the max x value of the left
   * edge of the icon VBox. Then increases spacing of all other content HBoxes accordingly.
   */
  public static alignHelpSectionIcons( sectionArray: KeyboardHelpSection[] ): void {
    assert && assert( sectionArray.length > 0, 'Must provide at least one KeyboardHelpSection to align.' );

    // left edge of icons farthest to the right in the array of KeyboardHelpSection
    const leftMostKeyboardHelpSection = _.maxBy( sectionArray, section => section.iconVBox.left );
    assert && assert( leftMostKeyboardHelpSection,
      'There must be a KeyboardHelpSection if sectionArray has entries.' );
    const maxLeftEdge = leftMostKeyboardHelpSection!.iconVBox.left;

    // adjust the spacing of all section HBoxes so that they align
    sectionArray.forEach( section => {
      section.contentHBox.spacing = section.contentHBox.spacing + maxLeftEdge - section.iconVBox.left;
    } );
  }
}

sceneryPhet.register( 'KeyboardHelpSection', KeyboardHelpSection );