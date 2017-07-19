// Copyright 2017, University of Colorado Boulder

/**
 * A node that looks like a keyboard key.  Has a shadow rectangle under the key
 * icon with a slight offset so that it has a 3D appearance.  KeyNodes are primarily
 * used for accessibility to provide extra information about keyboard navigation and
 * functionality, but an icon could be used for any purpose.
 * 
 * @author Jesse Greenberg
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Node = require( 'SCENERY/nodes/Node' );
  var AlignBox = require( 'SCENERY/nodes/AlignBox' );

  // constants
  // default options for the KeyNode, all widths, offsets, and height values are
  // in the ScreenView coordinate frame
  var DEFAULT_OPTIONS = {

    // color and styling
    keyFill: 'white',
    keyShadowFill: 'black',
    lineWidth: 1, // line width for the key icon
    cornerRadius: 3, // corner radius applied to the key and its shadow

    // offset for the shadow rectangle relative to the top left corner of the key
    xShadowOffset: 2,
    yShadowOffset: 2,

    // margins
    xMargin: 0, // sets the horizontal margin for the icon from the left/right edge
    yMargin: 0, // set the vertical margin for the icon from the top/botton edges

    // icon aligned in center of key by default
    xAlign: 'center', // {string} 'left', 'center', or 'right'
    yAlign: 'center', // {string} 'top', 'center', or 'bottom'

    // by default the max and min widths are the same so that the icon size does not
    // change the size of the key
    minKeyWidth: 32, // minimum width of the key
    minKeyHeight: 32, // min height of the key

    maxKeyWidth: 32, // max width of the key, will apply scaling to the icon
    maxKeyHeight: 32 // max height of key, will apply scaling to the icon 
  };

  /**
   * Constructor.
   * @param {Node} keyIcon - icon placed in the key
   * @param {Object} options
   */
  function KeyNode( keyIcon, options ) {

    options = _.extend( {}, DEFAULT_OPTIONS, options );
    assert && assert( options.minKeyWidth <= options.maxKeyWidth, 'max key width must be greater than min key width' );
    assert && assert( options.minKeyHeight <= options.maxKeyHeight, 'max key height must be greater than min key height' );
    assert && assert( !options.children, 'KeyNode cannot have additional children' );

    // i18n, and to make sure the icon is completely within the key
    keyIcon.maxWidth = options.maxKeyWidth - 2 * options.xMargin;
    keyIcon.maxHeight = options.maxKeyHeight - 2 * options.yMargin;    

    // place content in an align box so that the key surrounding the icon has minimum bounds
    var content = new AlignBox( keyIcon, {
      alignBounds: new Bounds2( 0, 0, options.minKeyWidth, options.minKeyHeight ),
      xMargin: options.xMargin,
      yMargin: options.yMargin,
      xAlign: options.xAlign, 
      yAlign: options.yAlign,
      maxWidth: options.maxKeyWidth,
      maxHeight: options.maxKeyHeight
    } );

    // children of the icon node, including the background shadow, foreground key, and content icon
    options.children = [
      // background (shadow rectangle)
      Rectangle.roundedBounds( content.bounds.shifted( 
        options.xShadowOffset, options.yShadowOffset ), options.cornerRadius, options.cornerRadius, {
          fill: options.keyShadowFill
        } ),
      // foreground
      Rectangle.roundedBounds( content.bounds, options.cornerRadius, options.cornerRadius, {
        fill: options.keyFill,
        stroke: 'black',
        lineWidth: options.lineWidth
      } ),
      // content on top
      content
    ];

    Node.call( this, options );
 }

 sceneryPhet.register( 'KeyNode', KeyNode );

  return inherit( Node, KeyNode );
} );
