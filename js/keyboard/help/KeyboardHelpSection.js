// Copyright 2017-2020, University of Colorado Boulder

/**
 * A Node that contains a section of text and icons for a KeyboardHelpDialog. Typically multiple KeyboardHelpSecctions
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

import inherit from '../../../../phet-core/js/inherit.js';
import merge from '../../../../phet-core/js/merge.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import AlignGroup from '../../../../scenery/js/nodes/AlignGroup.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import PhetFont from '../../PhetFont.js';
import sceneryPhetStrings from '../../sceneryPhetStrings.js';
import sceneryPhet from '../../sceneryPhet.js';
import AltKeyNode from '../AltKeyNode.js';
import EnterKeyNode from '../EnterKeyNode.js';
import KKeyNode from '../KKeyNode.js';
import LetterKeyNode from '../LetterKeyNode.js';
import SpaceKeyNode from '../SpaceKeyNode.js';
import KeyboardHelpIconFactory from './KeyboardHelpIconFactory.js';

// constants
const keyboardHelpDialogGrabOrReleaseHeadingPatternString = sceneryPhetStrings.keyboardHelpDialog.grabOrReleaseHeadingPattern;
const keyboardHelpDialogGrabOrReleaseLabelPatternString = sceneryPhetStrings.keyboardHelpDialog.grabOrReleaseLabelPattern;
const keyboardHelpDialogOrString = sceneryPhetStrings.keyboardHelpDialog.or;
const grabOrReleaseDescriptionPatternString = sceneryPhetStrings.a11y.keyboardHelpDialog.grabOrReleaseDescriptionPattern;

// heading defaults
const DEFAULT_HEADING_CONTENT_SPACING = 10; // spacing between h
const DEFAULT_HEADING_FONT = new PhetFont( { size: 16, weight: 'bold' } );

// Content spacing and alignment
const DEFAULT_ALIGN = 'left'; // default alignment for the content and title
const DEFAULT_LABEL_ICON_SPACING = 20; // spacing between
const DEFAULT_VERTICAL_ICON_SPACING = 10;

// text fonts and max widths
const LABEL_FONT = new PhetFont( 12 );
const OR_TEXT_MAX_WIDTH = 12;
const DEFAULT_LABEL_MAX_WIDTH = 175;
const DEFAULT_HEADING_MAX_WIDTH = 250;

/**
 * @constructor
 *
 * @param {string} headingString - the translatable label for this content
 * @param {Array.<HelpSectionRow>} content -  icons and labels are each placed in their own VBox, and these layout
 *                                            boxes are aligned horizontally. It is assumed that label and icon have
 *                                            identical bounds so that each row of content can be aligned by
 *                                            KeyboardHelpSection. Static functions in this file use AlignGroup to acheive
 *                                            this. For examples, see labelWithIcon() and labelWithIconList().
 * @param {Object} [options]
 */
function KeyboardHelpSection( headingString, content, options ) {

  options = merge( {

    // heading options
    headingContentSpacing: DEFAULT_HEADING_CONTENT_SPACING,
    headingFont: DEFAULT_HEADING_FONT,
    headingMaxWidth: DEFAULT_HEADING_MAX_WIDTH,

    // {number} The max width for all labels in the KeyboardHelpSection. Used as the base sizing to layout the rest
    // of the KeyboardHelpSection.
    labelMaxWidth: DEFAULT_LABEL_MAX_WIDTH,

    // VBox options
    align: DEFAULT_ALIGN,

    // pdom - tag name for the entire content, usually content is a list of items
    a11yContentTagName: 'ul'
  }, options );

  // create the heading
  const headingText = new Text( headingString, {
    font: options.headingFont,
    maxWidth: options.headingMaxWidth,

    // pdom
    tagName: 'h2',
    innerContent: headingString
  } );

  // place icons in labels in unique layout boxes for alignment
  const icons = [];
  const labels = [];
  for ( let i = 0; i < content.length; i++ ) {
    const helpSectionRow = content[ i ];

    assert && assert( helpSectionRow.text.maxWidth === null, 'KeyboardHelpSection sets maxWidth for children' );
    helpSectionRow.text.maxWidth = options.labelMaxWidth;

    icons.push( helpSectionRow.icon );
    labels.push( helpSectionRow.label );
  }

  const vBoxOptions = { align: 'left', spacing: DEFAULT_VERTICAL_ICON_SPACING };

  // @private - to adjust spacing if necessary for alignment
  this.labelVBox = new VBox( merge( {
    children: labels
  }, vBoxOptions ) );

  // @private - parent for all icons, instance variable to adjust spacing if necessary
  this.iconVBox = new VBox( merge( {
    children: icons,

    // pdom
    tagName: options.a11yContentTagName
  }, vBoxOptions ) );

  // @private - labels and icons horizontally aligned, instance variable to adjust spacing if necessary
  this.contentHBox = new HBox( {
    children: [ this.labelVBox, this.iconVBox ],
    spacing: DEFAULT_LABEL_ICON_SPACING
  } );

  // heading and content aligned in a VBox
  VBox.call( this, {
    children: [ headingText, this.contentHBox ],
    align: options.align,
    spacing: options.headingContentSpacing
  } );
}

sceneryPhet.register( 'KeyboardHelpSection', KeyboardHelpSection );

inherit( VBox, KeyboardHelpSection, {}, {

  /**
   * Horizontally align a label and an icon, with the label on the left and the icon on the right. AlignGroup is used
   * to give the label and icon identical dimensions for easy layout in KeyboardHelpSection.
   * @public
   * @static
   *
   * @param {string} labelString - string for the label Text
   * @param {Node} icon
   * @param {string} labelInnerContent - required to have the PDOM description of this row in the dialog
   * @param {Object} [options]
   * @returns {HelpSectionRow} - so KeyboardHelpSection can layout content groups
   */
  labelWithIcon: function( labelString, icon, labelInnerContent, options ) {
    assert && assert( typeof labelString === 'string', 'labelWithIcon creates Text label from string.' );
    assert && assert( typeof labelInnerContent === 'string', 'labelInnerContent should be a string.' );

    options = merge( {

      // options passed for layout, passed to AlignGroup
      spacing: DEFAULT_LABEL_ICON_SPACING,
      align: 'center',
      matchHorizontal: false,

      // options for the AlignBox surrounding the icon
      iconOptions: {
        tagName: 'li'
      }
    }, options );
    assert && assert( !options.children, 'children are not optional' );
    assert && assert( !options.iconOptions.innerContent, 'should be specified as an parameter, see labelInnerContent' );

    options.iconOptions.innerContent = labelInnerContent;

    const labelText = new RichText( labelString, { font: LABEL_FONT } );

    // make the label and icon the same height so that they will align when we assemble help section group
    const labelIconGroup = new AlignGroup( options );
    const labelBox = labelIconGroup.createBox( labelText );
    const iconBox = labelIconGroup.createBox( icon, options.iconOptions );

    return new HelpSectionRow( labelText, labelBox, iconBox );
  },

  /**
   * Create a label with a list of icons. The icons will be vertically aligned, each separated by 'or' text. The
   * label will be vertically centered with the first item in the list of icons. To vertically align the label
   * with the first icon, AlignGroup is used. Finally, an AlignGroup is used to make the label
   * content match height with the entire icon list. When assembled, the label with icon list will look like:
   *
   * This is the label: Icon1 or
   *                    Icon2 or
   *                    Icon3
   *
   * @param {string} labelString - string for the visible label RichText
   * @param {Node[]} icons
   * @param {string} labelInnerContent - content for the parallel DOM, read by a screen reader
   * @param {Object} [options] - cannot pass in children
   *
   * @returns {HelpSectionRow} -  so KeyboardHelpSection can layout content groups
   */
  labelWithIconList: function( labelString, icons, labelInnerContent, options ) {
    assert && assert( typeof labelString === 'string', 'labelWithIcon creates Text label from string.' );

    options = merge( {
      iconsVBoxOptions: {} // options for the iconsVBox, extended below
    }, options );
    assert && assert( !options.children, 'labelWithIconList adds its own children' );

    assert && assert( !options.iconsVBoxOptions.innerContent, 'should be specified as an argument' );
    options.iconsVBoxOptions = merge( {
      spacing: DEFAULT_VERTICAL_ICON_SPACING * .75, // less than the normal vertical icon spacing since it is a group
      align: 'left',
      tagName: 'li',
      innerContent: labelInnerContent
    }, options.iconsVBoxOptions );

    const labelText = new RichText( labelString, { font: LABEL_FONT } );

    // horizontally align the label with the first item in the list of icons, guarantees that the label and first
    // icon have identical heights
    const labelFirstIconGroup = new AlignGroup( { matchHorizontal: false } );
    labelFirstIconGroup.createBox( icons[ 0 ] ); // create the box to restrain bounds, but a reference isn't necessary
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
        children: [ icons[ i ], orText ],
        spacing: KeyboardHelpIconFactory.DEFAULT_ICON_SPACING
      } ) );
    }
    iconsWithOrText.push( icons[ icons.length - 1 ] );

    // place icons in a VBox, passing through optional spacing and a11y representation
    const iconsVBox = new VBox( merge( {
      children: iconsWithOrText
    }, options.iconsVBoxOptions ) );

    // make the label the same height as the icon list by aligning them in a box that matches height
    const groupOptions = { yAlign: 'top' };
    const labelIconListGroup = new AlignGroup( { matchHorizontal: false } );
    const iconsBox = labelIconListGroup.createBox( iconsVBox, groupOptions ); // create the box to match height, but reference not necessary
    const labelWithHeightBox = labelIconListGroup.createBox( labelBox, groupOptions );

    return new HelpSectionRow( labelText, labelWithHeightBox, iconsBox );
  },

  /**
   * Create an entry for the dialog that looks horizontally aligns a letter key with a 'J' key separated by a plus
   * sign, with a descriptive label. Something like:   * "J + S jumps close to sweater"
   *
   * @param {string} keyString - the letter name that will come after 'J', note this can be hard coded, no need for i18n.
   * @param {string} labelString - visual label
   * @param {string} labelInnerContent - PDOM description
   * @returns {HBox}
   */
  createJumpKeyRow: function( keyString, labelString, labelInnerContent ) {

    // Not translated because it maps directly to a specific key code.
    const jKey = new LetterKeyNode( 'J' );
    const otherKey = new LetterKeyNode( keyString );

    const jPlusOtherKey = KeyboardHelpIconFactory.iconPlusIcon( jKey, otherKey );
    return KeyboardHelpSection.labelWithIcon( labelString, jPlusOtherKey, labelInnerContent );
  },

  /**
   * Create a HelpSectionRow that describes how to play and pause the sim with the "Alt" + "K" hotkey.
   * @public
   *
   * @param {string} labelString - visual label string for the "Alt" + "K" icon
   * @param labelInnerContent - description for screen readers in the PDOM
   * @returns {HelpSectionRow}
   */
  createPlayPauseKeyRow: function( labelString, labelInnerContent ) {
    return KeyboardHelpSection.labelWithIcon(
      labelString,
      KeyboardHelpIconFactory.iconPlusIcon( new AltKeyNode(), new KKeyNode() ),
      labelInnerContent
    );
  },

  /**
   * Vertically align icons for a number of different KeyboardHelpSections. Useful when two KeyboardHelpSection
   * sections are stacked vertically in a Dialog. Loops through sectionArray and finds the max x value of the left
   * edge of the icon VBox. Then increases spacing of all other content HBoxes accordingly.
   *
   * @param {KeyboardHelpSection[]} sectionArray
   */
  alignHelpSectionIcons: function( sectionArray ) {

    // left edge of icons farthest to the right in the array of KeyboardHelpSection
    const maxLeftEdge = _.maxBy( sectionArray, function( section ) { return section.iconVBox.left; } ).iconVBox.left;

    // adjust the spacing of all section HBoxes so that they align
    sectionArray.forEach( function( section ) {
      section.contentHBox.spacing = section.contentHBox.spacing + maxLeftEdge - section.iconVBox.left;
    } );
  },

  /**
   * Convenience method to construct a KeyboardHelpSection for describing the grab button interaction
   * @param {string} thingAsTitle - the item being grabbed, capitalized as a title
   * @param {string} thingAsLowerCase - the item being grabbed, lower case as used in a sentence.
   * @param {Object} [options]
   * @static
   * @returns {KeyboardHelpSection}
   */
  getGrabReleaseHelpSection: function( thingAsTitle, thingAsLowerCase, options ) {

    options = merge( {

      // just a paragraph for this section, no list
      a11yContentTagName: null
    }, options );

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

    const spaceKeyNode = new SpaceKeyNode();
    const enterKeyNode = new EnterKeyNode();
    const icons = KeyboardHelpIconFactory.iconOrIcon( spaceKeyNode, enterKeyNode );
    const labelWithContentRow = KeyboardHelpSection.labelWithIcon( labelString, icons, descriptionString, {
      iconOptions: {
        tagName: 'p' // it is the only item so it is a p rather than an li
      }
    } );

    return new KeyboardHelpSection( heading, [ labelWithContentRow ], options );
  }
} );

/**
 * A row of KeyboardHelpSection, containing the label, icon, and text. Many of the static functions of KeyboardHelpSection
 * will return a HelpSectionRow. The label and icon are often grouped in an AlignGroup for easy positioning
 * in KeyboardHelpSection. This cannot be done in KeyboardHelpSection directly because different labels and icons will have
 * varying layout. For instance, see labelWithIcon vs labelWithIconList.
 *
 * Includes a reference to the Text because KeyboardHelpSection will constrain the width of all text in its
 * HelpSectionRows for i18n.
 */
class HelpSectionRow {

  /**
   * @param {Text|RichText} text - must be a child of the "label" Node, KeyboardHelpSection
   * @param {Node} label
   * @param {Node} icon
   */
  constructor( text, label, icon ) {
    assert && assert( text instanceof Text || text instanceof RichText, 'unsupported label type: ' + text );

    // @public (read-only)
    this.label = label;
    this.icon = icon;
    this.text = text;
  }
}

export default KeyboardHelpSection;