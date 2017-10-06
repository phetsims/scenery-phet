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
  var ArrowKeyNode = require( 'SCENERY_PHET/keyboard/ArrowKeyNode' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var PlusNode = require( 'SCENERY_PHET/PlusNode' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var ShiftKeyNode = require( 'SCENERY_PHET/keyboard/ShiftKeyNode' );
  var Tandem = require( 'TANDEM/Tandem' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var orString = require( 'string!SCENERY_PHET/or' );

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
  var DEFAULT_TEXT_MAX_WIDTH = 150;

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

      tandem: Tandem.tandemRequired()
    }, options );

    // create the heading
    var headingText = new Text( headingString, {
      font: options.headingFont,
      maxWidth: DEFAULT_HEADING_MAX_WIDTH
    } );

    // heading and content aligned in a VBox
    VBox.call( this, {
      children: [ headingText, content ],
      align: options.align,
      spacing: DEFAULT_HEADING_CONTENT_SPACING,
      tandem: options.tandem
    } );
  }

  sceneryPhet.register( 'HelpContent', HelpContent );

  return inherit( VBox, HelpContent, {}, {

    /**
     * Horizontally align a label and an icon, with the label on the left and the icon on the right.
     * @public
     * @static
     *
     * @param {Node} label - label for the icon, usually Text or RichText
     * @param {Node} icon
     * @param {Object} options
     * @return {HBox}
     */
    labelWithIcon: function( label, icon, options ) {

      options = _.extend( {
        spacing: DEFAULT_LABEL_ICON_SPACING,
        align: 'center'
      }, options );
      assert && assert( !options.children, 'children are not optional' );

      options.children = [ label, icon ];
      return new HBox( options );
    },

    /**
     * Get horizontally aligned arrow keys, all in a row including left, up, down, and right arrow keys in that order.
     *
     * @param {Object} options
     * @return {HBox}
     */
    arrowKeysRowIcon: function( options ) {

      options = _.extend( {
        spacing: 2,
      }, options );
      assert && assert( !options.children, 'children cannot be passed to options' );

      var leftArrowKeyNode = new ArrowKeyNode( 'up' );
      var upArrowKeyNode = new ArrowKeyNode( 'left' );
      var downArrowKeyNode = new ArrowKeyNode( 'down' );
      var rightArowKeyNode = new ArrowKeyNode( 'right' );

      options.children = [ leftArrowKeyNode, upArrowKeyNode, downArrowKeyNode, rightArowKeyNode ];
      return new HBox( options );
    },

    /**
     * Get horizontally aligned shift key icon plus another icon node. Horizontally aligned in order
     * of shift, plus icon, and desired icon.
     *
     * @param {Node} icon - icon to right of 'shift +'
     * @param {Object} options
     *
     * @return {HBox}
     */
    shiftPlusIcon: function( icon, options ) {

      options = _.extend( {
        spacing: DEFAULT_ICON_SPACING,

        // plus icon
        plusIconSize: new Dimension2( 8, 1.2 ),
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
     * @param {Object} options
     *
     * @return {HBox}
     */
    iconOrIcon: function( iconA, iconB, options ) {

      options = _.extend( {
        spacing: DEFAULT_ICON_SPACING,
      }, options );
      assert && assert( !options.children );

      var orText = new Text( orString, {
        font: DEFAULT_LABEL_FONT,
        maxWidth: DEFAULT_TEXT_MAX_WIDTH / 10
      } );

      options.children = [ iconA, orText, iconB ];
      return new HBox( options );
    },

    // static defaults fonts for content
    DEFAULT_LABEL_ICON_SPACING: DEFAULT_LABEL_ICON_SPACING,
    DEFAULT_LABEL_FONT: DEFAULT_LABEL_FONT,
    DEFAULT_TEXT_MAX_WIDTH: DEFAULT_TEXT_MAX_WIDTH,
    DEFAULT_VERTICAL_ICON_SPACING: DEFAULT_VERTICAL_ICON_SPACING
  } );
} );
