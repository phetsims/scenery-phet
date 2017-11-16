// Copyright 2017, University of Colorado Boulder

/**
 * Maintains help content for a KeyboardHelpDialog.  Takes a heading string for Text, and content which is aligned in a
 * VBox. This type has many static functions for creating and laying out content that could be useful for subtypes
 * that use this Node. Default values for spacing and fonts are also available through statics.
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
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var PlusNode = require( 'SCENERY_PHET/PlusNode' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var ShiftKeyNode = require( 'SCENERY_PHET/keyboard/ShiftKeyNode' );
  var Text = require( 'SCENERY/nodes/Text' );
  var TextKeyNode = require( 'SCENERY_PHET/keyboard/TextKeyNode' );
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
  var DEFAULT_LABEL_ICON_SPACING = 6; // spacing between 
  var DEFAULT_ICON_SPACING = 5;
  var DEFAULT_VERTICAL_ICON_SPACING = 10;

  // labels and keys
  var DEFAULT_LABEL_FONT = new PhetFont( 12 );
  var DEFAULT_TEXT_MAX_WIDTH = 175;
  var DEFAULT_ARROW_AND_LETTER_KEY_OPTIONS = { forceSquareKey: true };

  /**
   * @constructor
   *
   * @param {string} headingString - the translatable label for this content
   * @param {Node} content
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

      // a11y
      a11yContentTagName: 'ul' // almost all help content will be list items, wrap with a ul tag
    }, options );

    // create the heading
    var headingText = new Text( headingString, {
      font: options.headingFont,
      maxWidth: DEFAULT_HEADING_MAX_WIDTH,

      // a11y
      tagName: 'h2',
      accessibleLabel: headingString
    } );

    // wrap the content with a node that represents the optional a11yContentTagName, if defined
    var contentWrapper = new Node( { children: [ content ] } );
    options.a11yContentTagName && contentWrapper.setTagName( options.a11yContentTagName );

    // heading and content aligned in a VBox
    VBox.call( this, {
      children: [ headingText, contentWrapper ],
      align: options.align,
      spacing: DEFAULT_HEADING_CONTENT_SPACING
    } );
  }

  sceneryPhet.register( 'HelpContent', HelpContent );

  return inherit( VBox, HelpContent, {}, {

    /**
     * Horizontally align a label and an icon, with the label on the left and the icon on the right. Optionally,
     * the icon can be ordered before the label, see labelFirst option.
     * @public
     * @static
     *
     * @param {Node} label - label for the icon, usually Text or RichText
     * @param {Node} icon
     * @param {Object} [options]
     * @return {HBox}
     */
    labelWithIcon: function( label, icon, options ) {

      options = _.extend( {
        spacing: DEFAULT_LABEL_ICON_SPACING,
        align: 'center',
        labelFirst: true,

        // a11y
        tagName: 'li'
      }, options );
      assert && assert( !options.children, 'children are not optional' );

      options.children = options.labelFirst ? [ label, icon ] : [ icon, label ];
      return new HBox( options );
    },

    /**
     * Horizontally aligned label with a list of icons.  The icons will be vertically aligned, each separated by 'or'
     * text.The label will be vertically centered with the first item in the list of icons.  The result will look like
     *
     * This is the label: Icon1 or
     *                    Icon2 or
     *                    Icon3
     *
     * @param {Node} label - label for the icon, usually Text or RichText
     * @param {Node[]} icons
     * @param {Object} [options]
     *
     * @return {HBox}
     */
    labelWithIconList: function( label, icons, options ) {

      options = _.extend( {
        verticalSpacing: DEFAULT_VERTICAL_ICON_SPACING * .75, // less than the normal vertical icon spacing since it is a group

        // a11y
        tagName: 'li',
        accessibleLabel: null // screen reader description often used for entire list, passed to final HBox
      }, options );

      // Use align group to horizontally align the label with the first item in the list of icons, guarantees
      // that the label and first icon have identical heights
      var labelIconGroup = new AlignGroup( { matchHorizontal: false } );
      labelIconGroup.createBox( icons[ 0 ] ); // create the box to restrain bounds, but a reference isn't necessary
      var labelBox = labelIconGroup.createBox( label );

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

      // place icons in a VBox
      var iconsVBox = new VBox( {
        children: iconsWithOrText,
        spacing: options.verticalSpacing,
        align: 'left'
      } );

      return new HBox( {
        children: [ labelBox, iconsVBox ],
        align: 'top',
        spacing: DEFAULT_LABEL_ICON_SPACING,
        tagName: options.tagName,
        accessibleLabel: options.accessibleLabel
      } );
    },

    /**
     * Get horizontally aligned arrow keys, all in a row including up, left, down, and right arrow keys in that order.
     *
     * @param {Object} [options]
     * @return {HBox}
     */
    arrowKeysRowIcon: function( options ) {

      options = _.extend( {
        spacing: 2
      }, options );
      assert && assert( !options.children, 'children cannot be passed to options' );

      var upArrowKeyNode = new ArrowKeyNode( 'up', DEFAULT_ARROW_AND_LETTER_KEY_OPTIONS );
      var leftArrowKeyNode = new ArrowKeyNode( 'left', DEFAULT_ARROW_AND_LETTER_KEY_OPTIONS );
      var downArrowKeyNode = new ArrowKeyNode( 'down', DEFAULT_ARROW_AND_LETTER_KEY_OPTIONS );
      var rightArowKeyNode = new ArrowKeyNode( 'right', DEFAULT_ARROW_AND_LETTER_KEY_OPTIONS );

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
        spacing: 2
      }, options );
      assert && assert( !options.children, 'children cannot be passed to options' );

      var upArrowKeyNode = new ArrowKeyNode( 'up', DEFAULT_ARROW_AND_LETTER_KEY_OPTIONS );
      var downArrowKeyNode = new ArrowKeyNode( 'down', DEFAULT_ARROW_AND_LETTER_KEY_OPTIONS );

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
        spacing: 2
      }, options );
      assert && assert( !options.children, 'children cannot be passed to options' );

      var upArrowKeyNode = new ArrowKeyNode( 'left', DEFAULT_ARROW_AND_LETTER_KEY_OPTIONS );
      var downArrowKeyNode = new ArrowKeyNode( 'right', DEFAULT_ARROW_AND_LETTER_KEY_OPTIONS );

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
        spacing: 2
      }, options );
      assert && assert( !options.children, 'children cannot be passed to options' );

      var wKeyNode = new TextKeyNode( 'W', DEFAULT_ARROW_AND_LETTER_KEY_OPTIONS );
      var aKeyNode = new TextKeyNode( 'A', DEFAULT_ARROW_AND_LETTER_KEY_OPTIONS );
      var sKeyNode = new TextKeyNode( 'S', DEFAULT_ARROW_AND_LETTER_KEY_OPTIONS );
      var dKeyNode = new TextKeyNode( 'D', DEFAULT_ARROW_AND_LETTER_KEY_OPTIONS );

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

    // static defaults fonts for content
    DEFAULT_ICON_SPACING: DEFAULT_ICON_SPACING,
    DEFAULT_LABEL_ICON_SPACING: DEFAULT_LABEL_ICON_SPACING,
    DEFAULT_LABEL_FONT: DEFAULT_LABEL_FONT,
    DEFAULT_TEXT_MAX_WIDTH: DEFAULT_TEXT_MAX_WIDTH,
    DEFAULT_VERTICAL_ICON_SPACING: DEFAULT_VERTICAL_ICON_SPACING
  } );
} );
