// Copyright 2017, University of Colorado Boulder

/**
 * Contains help content for a KeyboardHelpDialog.  Takes a heading string for Text, and an array of content with
 * labels and icons. This type has many static functions for creating and laying out content that could be useful for
 * subtypes of this Node. Default values for spacing and fonts are also available through statics.
 *
 * Help content is aligned with two groups. Text labels are aligned in one VBox, icons are aligned in another. To
 * structure the accessible content, we chose to instrument a11y on the icons in the help content. To label content
 * in your own HelpContent, instrument the icons not the label Text so a11y content is placed correctly in the DOM.
 * Help content is generally a list of items, so each icon has a  tagName of 'li' be default.
 *
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var AlignGroup = require( 'SCENERY/nodes/AlignGroup' );
  var ArrowKeyNode = require( 'SCENERY_PHET/keyboard/ArrowKeyNode' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LetterKeyNode = require( 'SCENERY_PHET/keyboard/LetterKeyNode' );
  var PageDownKeyNode = require( 'SCENERY_PHET/keyboard/PageDownKeyNode' );
  var PageUpKeyNode = require( 'SCENERY_PHET/keyboard/PageUpKeyNode' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var PlusNode = require( 'SCENERY_PHET/PlusNode' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var ShiftKeyNode = require( 'SCENERY_PHET/keyboard/ShiftKeyNode' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var keyboardHelpDialogOrString = require( 'string!SCENERY_PHET/keyboardHelpDialog.or' );

  // constants
  // heading defaults
  var DEFAULT_HEADING_CONTENT_SPACING = 10; // spacing between h
  var DEFAULT_HEADING_FONT = new PhetFont( { size: 16, weight: 'bold' } );
  var DEFAULT_HEADING_MAX_WIDTH = 300; // i18n

  // Content spacing and alignment
  var DEFAULT_ALIGN = 'left'; // default alignment for the content and title
  var DEFAULT_LABEL_ICON_SPACING = 20; // spacing between 
  var DEFAULT_ICON_SPACING = 5;
  var DEFAULT_VERTICAL_ICON_SPACING = 10;
  var DEFAULT_LETTER_KEY_SPACING = 1;

  // labels and keys
  var DEFAULT_LABEL_FONT = new PhetFont( 12 );
  var DEFAULT_TEXT_MAX_WIDTH = 175;

  /**
   * @constructor
   *
   * @param {string} headingString - the translatable label for this content
   * @param {Array.<Object>} content - {label: <Node>, icon: <Node> }, icons and labels are each placed in their own
   *                                   VBox, and these layout boxes are aligned horizontally. It is assumed that each
   *                                   label and icon have bounds so that each row of content is aligned as desired.
   *                                   See HelpContent.labelWithIcon and HelpContent.labelWithIconList for how this is
   *                                   done with AlignBox.
   *
   * @param {Object} [options]
   */
  function HelpContent( headingString, content, options ) {

    options = _.extend( {

      // heading options
      headingContentSpacing: DEFAULT_HEADING_CONTENT_SPACING,
      headingFont: DEFAULT_HEADING_FONT,
      headingMaxWidth: DEFAULT_HEADING_MAX_WIDTH,

      // VBox options
      align: DEFAULT_ALIGN,

      // a11y - tag name for the entire content, usually content is a list of items
      a11yContentTagName: 'ul'
    }, options );

    // create the heading
    var headingText = new Text( headingString, {
      font: options.headingFont,
      maxWidth: DEFAULT_HEADING_MAX_WIDTH,

      // a11y
      tagName: 'h2',
      innerContent: headingString
    } );

    // place icons in labels in unique layout boxes for alignment
    var icons = [];
    var labels = [];
    for ( var i = 0; i < content.length; i++ ) {
      icons.push( content[ i ].icon );
      labels.push( content[ i ].label );
    }

    var vBoxOptions = { align: 'left', spacing: DEFAULT_VERTICAL_ICON_SPACING };

    // @private - to adjust spacing if necessary for alignment
    this.labelVBox = new VBox( _.extend( {
      children: labels
    }, vBoxOptions ) );

    // @private - parent for all icons, instance variable to adjust spacing if necessary
    this.iconVBox = new VBox( _.extend( {
      children: icons,

      // a11y
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
      spacing: DEFAULT_HEADING_CONTENT_SPACING
    } );
  }

  sceneryPhet.register( 'HelpContent', HelpContent );

  return inherit( VBox, HelpContent, {}, {

    /**
     * Horizontally align a label and an icon, with the label on the left and the icon on the right. AlignGroup is used
     * to give the label and icon identical heights when laying out the content in a Dialog. Optionally, the icon can
     * be ordered before the label, see labelFirst option.
     * @public
     * @static
     *
     * @param {Node} label - label for the icon, usually Text or RichText
     * @param {Node} icon
     * @param {Object} [options]
     * @return {Object} - Object {label: <Node>, icon: <Node>} so HelpContent can layout content groups
     */
    labelWithIcon: function( label, icon, options ) {

      options = _.extend( {
        spacing: DEFAULT_LABEL_ICON_SPACING,
        align: 'center',
        labelFirst: true,
        matchHorizontal: false,
        iconOptions: null // specific options for the icon mostly to add a11y content, extended with defaults below
      }, options );
      assert && assert( !options.children, 'children are not optional' );

      options.iconOptions = _.extend( {
        tagName: 'li'
      }, options.iconOptions );

      // make the label and icon the same height so that they will align when we assemble help content group
      var labelIconGroup = new AlignGroup( options );
      var labelBox = labelIconGroup.createBox( label );
      var iconBox = labelIconGroup.createBox( icon, options.iconOptions );

      // options.children = options.labelFirst ? [ label, icon ] : [ icon, label ];
      var content = options.labelFirst ? { label: labelBox, icon: iconBox } : { label: iconBox, icon: labelBox };
      return content;
    },

    /**
     * Create a label with a list of icons. The icons will be vertically aligned, each separated by 'or' text. The
     * label will be vertically centered with the first item in the list of icons. To vertically align the label
     * with the first icon, AlignGroup is used to match their heights. Finally, an AlignGroup is used to make the label
     * content match height with the icon content. When assembled, the label with icon list will look like:
     *
     * This is the label: Icon1 or
     *                    Icon2 or
     *                    Icon3
     *
     * @param {Node} label - label for the icon, usually Text or RichText
     * @param {Node[]} icons
     * @param {Object} [options] - cannot pass in children
     *
     * @return {Object} - Object {label: <Node>, icon: <Node>} so HelpContent can layout content groups
     */
    labelWithIconList: function( label, icons, options ) {

      options = _.extend( {
        iconsVBoxOptions: null // options for the iconsVBox, extended below
      }, options );
      assert && assert( !options.children, 'labelWithIconList adds its own children' );

      options.iconsVBoxOptions = _.extend( {
        spacing: DEFAULT_VERTICAL_ICON_SPACING * .75, // less than the normal vertical icon spacing since it is a group
        align: 'left',
        tagName: 'li'
      }, options.iconsVBoxOptions );

      // horizontally align the label with the first item in the list of icons, guarantees that the label and first
      // icon have identical heights
      var labelFirstIconGroup = new AlignGroup( { matchHorizontal: false } );
      labelFirstIconGroup.createBox( icons[ 0 ] ); // create the box to restrain bounds, but a reference isn't necessary
      var labelBox = labelFirstIconGroup.createBox( label );

      // for each of the icons (excluding the last one,  add a vertically aligned 'or' text to the right
      var iconsWithOrText = [];
      for ( var i = 0; i < icons.length - 1; i++ ) {
        var orText = new Text( keyboardHelpDialogOrString, {
          font: DEFAULT_LABEL_FONT,
          maxWidth: DEFAULT_TEXT_MAX_WIDTH / 10
        } );

        // place orText with the icon in an HBox
        iconsWithOrText.push( new HBox( {
          children: [ icons[ i ], orText ],
          spacing: DEFAULT_ICON_SPACING
        } ) );
      }
      iconsWithOrText.push( icons[ icons.length - 1 ] );

      // place icons in a VBox, passing through optional spacing and a11y representation
      var iconsVBox = new VBox( _.extend( {
        children: iconsWithOrText
      }, options.iconsVBoxOptions ) );

      // make the label the same height as the icon list by aligning them in a box that matches height
      var groupOptions = { yAlign: 'top' };
      var labelIconListGroup = new AlignGroup( { matchHorizontal: false } );
      var iconsBox = labelIconListGroup.createBox( iconsVBox, groupOptions ); // create the box to match height, but reference not necessary
      var labelWithHeightBox = labelIconListGroup.createBox( labelBox, groupOptions );

      return { label: labelWithHeightBox, icon: iconsBox };
    },

    /**
     * Get horizontally aligned arrow keys, all in a row including up, left, down, and right arrow keys in that order.
     *
     * @param {Object} [options]
     * @return {HBox}
     */
    arrowKeysRowIcon: function( options ) {

      options = _.extend( {
        spacing: DEFAULT_LETTER_KEY_SPACING
      }, options );
      assert && assert( !options.children, 'children cannot be passed to options' );

      var upArrowKeyNode = new ArrowKeyNode( 'up' );
      var leftArrowKeyNode = new ArrowKeyNode( 'left' );
      var downArrowKeyNode = new ArrowKeyNode( 'down' );
      var rightArowKeyNode = new ArrowKeyNode( 'right' );

      options.children = [ upArrowKeyNode, leftArrowKeyNode, downArrowKeyNode, rightArowKeyNode ];
      return new HBox( options );
    },

    /**
     * An icon containing icons for the up and down arrow keys aligned horizontally.
     *
     * @param {Object} [options]
     * @return {HBox}
     */
    upDownArrowKeysRowIcon: function( options ) {
      options = _.extend( {
        spacing: DEFAULT_LETTER_KEY_SPACING
      }, options );
      assert && assert( !options.children, 'children cannot be passed to options' );

      var upArrowKeyNode = new ArrowKeyNode( 'up' );
      var downArrowKeyNode = new ArrowKeyNode( 'down' );

      options.children = [ upArrowKeyNode, downArrowKeyNode ];
      return new HBox( options );
    },

    /**
     * An icon containing the icons for the left and right arrow keys,  aligned horizontally.
     *
     * @param {Object} [options]
     * @return {HBox}
     */
    leftRightArrowKeysRowIcon: function( options ) {
      options = _.extend( {
        spacing: DEFAULT_LETTER_KEY_SPACING
      }, options );
      assert && assert( !options.children, 'children cannot be passed to options' );

      var upArrowKeyNode = new ArrowKeyNode( 'left' );
      var downArrowKeyNode = new ArrowKeyNode( 'right' );

      options.children = [ upArrowKeyNode, downArrowKeyNode ];
      return new HBox( options );
    },

    /**
     * An icon containing icons for the up and down arrow keys aligned horizontally.
     *
     * @param {Object} [options]
     * @return {HBox}
     */
    wasdRowIcon: function( options ) {
      options = _.extend( {
        spacing: DEFAULT_LETTER_KEY_SPACING
      }, options );
      assert && assert( !options.children, 'children cannot be passed to options' );

      // 'W' is a wider character than the others, give it less horizontal padding
      var wKeyNode = new LetterKeyNode( 'W' );
      var aKeyNode = new LetterKeyNode( 'A' );
      var sKeyNode = new LetterKeyNode( 'S' );
      var dKeyNode = new LetterKeyNode( 'D' );

      options.children = [ wKeyNode, aKeyNode, sKeyNode, dKeyNode ];
      return new HBox( options );
    },

    /**
     * An icon containing horizontally aligned arrow keys and horizontally aligned WASD keys, separated by an "or".
     *
     * @param {Object} [options]
     * @return {HBox}
     */
    arrowOrWasdKeysRowIcon: function( options ) {
      options = _.extend( {
        spacing: DEFAULT_ICON_SPACING
      }, options );
      assert && assert( !options.children, 'children cannot be passed to options' );

      var arrowKeys = HelpContent.arrowKeysRowIcon();
      var wasdKeys = HelpContent.wasdRowIcon();

      return HelpContent.iconOrIcon( arrowKeys, wasdKeys, options );
    },

    /**
     * An icon containing icons for the page up/down keys aligned horizontally.
     *
     * @param  {Object} [options]
     * @return {HBox}
     */
    pageUpPageDownRowIcon: function( options ) {
      options = _.extend( {
        spacing: DEFAULT_ICON_SPACING
      }, options );
      assert && assert( !options.children, 'children cannot be passed to options' );

      var pageUpKeyNode = new PageUpKeyNode();
      var pageDownKeyNode = new PageDownKeyNode();

      options.children = [ pageUpKeyNode, pageDownKeyNode ];

      return new HBox( options );
    },

    /**
     * Get horizontally aligned shift key icon plus another icon node. Horizontally aligned in order
     * of shift, plus icon, and desired icon.
     *
     * @param {Node} icon - icon to right of 'shift +'
     * @param {Object} [options]
     *
     * @return {HBox}
     */
    shiftPlusIcon: function( icon, options ) {

      options = _.extend( {
        spacing: DEFAULT_ICON_SPACING,

        // plus icon
        plusIconSize: new Dimension2( 8, 1.2 )
      }, options );
      assert && assert( !options.children );

      // shift key icon
      var shiftKeyIcon = new ShiftKeyNode();

      // plus icon
      var plusIconNode = new PlusNode( {
        size: options.plusIconSize
      } );

      options.children = [ shiftKeyIcon, plusIconNode, icon ];
      return new HBox( options );
    },

    /**
     * Get two icons horizontally aligned and separated by 'or' text.
     *
     * @param {Node} iconA - to the left of 'or' text
     * @param {Node} iconB - to the right of 'or' text
     * @param {Object} [options]
     *
     * @return {HBox}
     */
    iconOrIcon: function( iconA, iconB, options ) {

      options = _.extend( {
        spacing: DEFAULT_ICON_SPACING
      }, options );
      assert && assert( !options.children );

      var orText = new Text( keyboardHelpDialogOrString, {
        font: DEFAULT_LABEL_FONT,
        maxWidth: DEFAULT_TEXT_MAX_WIDTH / 10
      } );

      options.children = [ iconA, orText, iconB ];
      return new HBox( options );
    },

    /**
     * Get two icons horizontally aligned and separated by '+' text.
     *
     * @param {Node} iconA - to the left of '+' text
     * @param {Node} iconB - to the right of '+' text
     * @param {Object} [options]
     *
     * @return {HBox}
     */
    iconPlusIcon: function( iconA, iconB, options ) {

      options = _.extend( {
        spacing: DEFAULT_ICON_SPACING,

        // plus icon
        plusIconSize: new Dimension2( 8, 1.2 )
      }, options );
      assert && assert( !options.children );

      // plus icon
      var plusIconNode = new PlusNode( {
        size: options.plusIconSize
      } );

      options.children = [ iconA, plusIconNode, iconB ];
      return new HBox( options );
    },

    /**
     * Vertically align icons for a number of different HelpContents. Useful when two HelpContent sections are
     * stacked vertically in a Dialog. Loops through  contentArray and finds the max x value of the left edge
     * of the icon VBox. Then increases spacing of all other content HBoxes accordingly.
     *
     * @param {[].HelpContent} contentArray
     */
    alignHelpContentIcons: function( contentArray ) {

      // left edge of icons farthest to the right in the array of HelpContent
      var maxLeftEdge = _.maxBy( contentArray, function( content ) { return content.iconVBox.left; } ).iconVBox.left;

      // adjust the spacing of all content HBoxes so that they align
      contentArray.forEach( function( content ) {
        content.contentHBox.spacing = content.contentHBox.spacing + maxLeftEdge - content.iconVBox.left;
      } );
    },

    // static defaults fonts for content
    DEFAULT_ICON_SPACING: DEFAULT_ICON_SPACING,
    DEFAULT_LABEL_ICON_SPACING: DEFAULT_LABEL_ICON_SPACING,
    DEFAULT_LABEL_FONT: DEFAULT_LABEL_FONT,
    DEFAULT_TEXT_MAX_WIDTH: DEFAULT_TEXT_MAX_WIDTH,
    DEFAULT_VERTICAL_ICON_SPACING: DEFAULT_VERTICAL_ICON_SPACING
  } );
} );