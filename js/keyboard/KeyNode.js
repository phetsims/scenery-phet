// Copyright 2017, University of Colorado Boulder

/**
 * A node that looks like a keyboard key.  Has a shadow rectangle under the key icon with a slight offset so that it
 * has a 3D appearance.  KeyNodes are primarily used for accessibility to provide extra information about keyboard
 * navigation and functionality, but an icon could be used for any purpose.
 *
 * Each KeyNode has the same height by default, and the content node will be scaled down if it is too large to maintain the
 * proper key height. The width will expand based on padding and the width of the icon node in order to surround content
 * fully.
 *
 * @author Jesse Greenberg
 */

define( function( require ) {
  'use strict';

  // modules
  var AlignBox = require( 'SCENERY/nodes/AlignBox' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );

  // default options for the KeyNode, all widths, offsets, and height values are in the ScreenView coordinate frame
  var DEFAULT_OPTIONS = {

    // color and styling
    keyFill: 'white',
    keyShadowFill: 'black',
    lineWidth: 1, // line width for the key icon
    cornerRadius: 2, // corner radius applied to the key and its shadow

    // offset for the shadow rectangle relative to the top left corner of the key
    xShadowOffset: 1.3,
    yShadowOffset: 1.3,

    // margins set by AlignBox
    xMargin: 0, // sets the horizontal margin for the icon from the left/right edge
    yMargin: 0, // set the vertical margin for the icon from the top/botton edges

    // icon aligned in center of key by default
    xAlign: 'center', // {string} 'left', 'center', or 'right'
    yAlign: 'center', // {string} 'top', 'center', or 'bottom'

    // x and y padding around the icon, will increase the size of the key if there is available space,
    // or scale down the icon if key is at max width or height
    xPadding: 3,
    yPadding: 3,

    // Key will be at least this wide, making it possible to surround the icon with extra space if necessary.
    // The minimum width of the KeyNode allowed, if the icon is wider, than it will expand gracefully
    minKeyWidth: 17, // default equal to the height, a square key as the minimum.

    // the desired height of the KeyNode; icon will be scaled down if too big
    keyHeight: 17,

    // Force the width of the KeyNode to be the same width as height, based on the height.
    // Will scale down the icon if too wide.
    forceSquareKey: false
  };

  /**
   * Constructor.
   * @param {Node} keyIcon - icon placed in the key
   * @param {Object} options
   */
  function KeyNode( keyIcon, options ) {

    options = _.extend( {}, DEFAULT_OPTIONS, options );
    assert && assert( !options.children, 'KeyNode cannot have additional children' );

    // scale down the size of the keyIcon passed in if it is taller than the max height of the icon
    var heightScalar = 1;
    var availableHeightForKeyIcon = options.keyHeight - options.yPadding; // adjust for the vertical margin
    if ( keyIcon.height > availableHeightForKeyIcon ) {
      heightScalar = availableHeightForKeyIcon / keyIcon.height;
    }

    // Add the scale to a new node based on the height, with keyIcon as a child so that we don't mutate the parameter node.
    var scaleNode = new Node( { children: [ keyIcon ], scale: heightScalar } );

    // Set the keyWidth to either be the minimum, or the width of the icon + padding, which ever is larger.
    var keyWidth = Math.max( options.minKeyWidth, scaleNode.width + options.xPadding );

    // Make the width the same as the height by scaling down the icon if necessary
    if ( options.forceSquareKey ) {

      // If we are forcing square, we may have to scale the node down to fit
      var availableWidthForKeyIcon = options.minKeyWidth - options.xPadding; // adjust for the horizontal margin

      var widthScalar = 1;
      if ( keyIcon.width > availableWidthForKeyIcon ) {
        widthScalar = availableWidthForKeyIcon / keyIcon.width;
      }
      // Add the scale to a new node based on the width
      scaleNode = new Node( { children: [ scaleNode ], scale: widthScalar } );

      // Set the width to the height to make sure the alignBounds below are set correctly as a square.
      keyWidth = options.keyHeight;
    }

    // place content in an align box so that the key surrounding the icon has minimum bounds calculated above
    // with support for margins
    var content = new AlignBox( scaleNode, {
      alignBounds: new Bounds2( 0, 0, keyWidth, options.keyHeight ),
      xAlign: options.xAlign,
      yAlign: options.yAlign,
      xMargin: options.xMargin,
      yMargin: options.yMargin
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
